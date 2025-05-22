'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { withAuthAndLog } from '@/lib/auth-and-log-wrapper';
import { RequestLogger } from '@/lib/logger.server';

export const restoreTask = withAuthAndLog(async (logger: RequestLogger, taskId: number) => {
  try {
    const task = await db.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      const err = new Error('Task not found');
      logger.error({ error: err, taskId }, 'Task not found for restore');
      return { success: false, error: 'task not found' };
    }

    await db.task.update({
      where: { id: taskId },
      data: { deletedAt: null },
    });

    revalidatePath('/oppgaver');

    logger.info(
      {
        details: {
          taskId,
        },
      },
      'Restored task'
    );

    return { success: true };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error({ error: err, taskId }, 'Failed to restore task');
    return {
      success: false,
      error: 'Failed to restore task. Please try again.',
    };
  }
});
