'use server';

import { withAuthAndLog } from '@/lib/auth-and-log-wrapper';
import { RequestLogger } from '@/lib/logger.server';
import { db } from '@/lib/prisma';

export const getTask = withAuthAndLog(async (logger: RequestLogger, id: number) => {
  try {
    const task = await db.task
      .findUnique({
        where: { id },
        include: { applications: true },
      })
      .catch((err) => {
        logger.error({ error: err }, 'Database query failed');
        return null;
      });

    logger.info(
      {
        details: {
          taskId: id,
          found: !!task,
          includes: ['applications'],
        },
      },
      'Fetched task by ID'
    );

    return task;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error({ error: err, taskId: id }, 'Failed to fetch task');
    // Return null instead of failing
    return null;
  }
});
