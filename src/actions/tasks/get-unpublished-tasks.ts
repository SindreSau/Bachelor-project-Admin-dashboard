'use server';
import { withAuthAndLog } from '@/lib/auth-and-log-wrapper';
import { RequestLogger } from '@/lib/logger.server';
import { db } from '@/lib/prisma';

export const getUnpublishedTasks = withAuthAndLog(async (logger: RequestLogger) => {
  try {
    const tasks = await db.task
      .findMany({
        include: {
          _count: {
            select: { applications: true },
          },
        },
        where: { deletedAt: null, published: false },
        orderBy: {
          createdAt: 'desc',
        },
      })
      .catch((err) => {
        logger.error({ error: err }, 'Database query failed');
        return [];
      });

    logger.info(
      {
        details: {
          count: tasks.length,
          includes: ['applications'],
        },
      },
      'Fetched unpublished tasks'
    );
    return tasks;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error({ error: err }, 'Failed to fetch unpublished tasks');
    // Return empty array instead of failing
    return [];
  }
});
