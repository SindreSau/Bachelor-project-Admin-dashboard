'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { withAuthAndLog } from '@/lib/auth-and-log-wrapper';
import { RequestLogger } from '@/lib/logger.server';

export const deleteTask = withAuthAndLog(async (logger: RequestLogger, id: number) => {
  try {
    const task = await db.task.findUnique({
      where: { id: id },
    });

    if (!task) {
      const err = new Error('Task not found');
      logger.error({ error: err, taskId: id }, 'Task not found for deletion');
      return { success: false, error: 'Task not found' };
    }

    const updatedTask = await db.task.update({
      where: { id: id },
      data: { deletedAt: new Date(), published: false },
    });

    if (!updatedTask.deletedAt) {
      const err = new Error('Failed to delete task');
      logger.error({ error: err, taskId: id }, 'Failed to delete task');
      return { success: false, error: 'Failed to delete task' };
    }

    revalidatePath(`/oppgaver`);

    logger.info(
      {
        details: {
          taskId: id,
        },
      },
      'Soft deleted task'
    );

    return { success: true };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error({ error: err, taskId: id }, 'Failed to delete task');
    return {
      success: false,
      error: 'Failed to delete task. Please try again.',
    };
  }
});
