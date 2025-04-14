'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import triggerRevalidation from './trigger-revalidate';
import { withAuthAndLog } from '@/lib/auth-and-log-wrapper';

export const changePublishStatus = withAuthAndLog(
  async (logger, taskId: number, newPublishedState: boolean) => {
    try {
      await db.task.update({
        where: { id: taskId },
        data: { published: newPublishedState },
      });
      logger.info(
        { action: 'changePublishStatusUpdated', taskId, newPublishedState },
        'Task publish status updated'
      );

      await triggerRevalidation();
      revalidatePath('/oppgaver');
      logger.info(
        { action: 'changePublishStatusCompleted', taskId },
        'Revalidation of application portal completed'
      );
      return { success: true };
    } catch (err) {
      const errorObj = {
        message: err instanceof Error ? err.message : String(err),
        code: (err as { code?: string })?.code,
        stack:
          process.env.NODE_ENV !== 'production' && err instanceof Error ? err.stack : undefined,
      };

      logger.error(
        {
          action: 'changePublishStatusError',
          taskId,
          error: errorObj,
        },
        'Error changing publish status'
      );

      return {
        success: false,
        error: 'Failed to change publish status. Please try again.',
      };
    }
  }
);
