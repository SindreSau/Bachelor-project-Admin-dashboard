'use server';
import { RequestLogger, withRequestLogger } from '@/lib/logger.server';
import { db } from '@/lib/prisma';

export const getPublishedTasks = withRequestLogger(async (logger: RequestLogger) => {
  try {
    const tasks = await db.task
      .findMany({
        where: {
          published: true,
        },
        omit: {
          updatedAt: true,
          createdAt: true,
          published: true,
        },
        orderBy: {
          createdAt: 'asc',
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
        },
      },
      'Server action: Fetched published tasks'
    );

    return tasks;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error({ error: err }, 'Failed to fetch published tasks');
    // Return empty array instead of failing
    return [];
  }
});
