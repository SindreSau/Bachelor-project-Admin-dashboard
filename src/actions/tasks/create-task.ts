'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import triggerRevalidation from './trigger-revalidate';
import { withAuthAndLog } from '@/lib/auth-and-log-wrapper';
import { RequestLogger } from '@/lib/logger.server';

interface TaskInput {
  taskName: string;
  taskDescription: string;
  deadline: string | null;
  published?: boolean;
}

export const createTask = withAuthAndLog(
  async (logger: RequestLogger, { taskName, taskDescription, deadline, published }: TaskInput) => {
    try {
      if (!taskName || !taskDescription) {
        const err = new Error('Task name and description are required.');
        logger.error({ error: err }, 'Missing required fields for task creation');
        throw err;
      }

      const task = await db.task.create({
        data: {
          taskName,
          taskDescription,
          deadline: deadline ? new Date(deadline) : null,
          published,
        },
      });

      await triggerRevalidation();
      revalidatePath('/oppgaver');

      logger.info(
        {
          details: {
            taskId: task.id,
            taskName,
            published,
          },
        },
        'Created new task successfully and revalidated bachelor portal'
      );
      return {
        success: true,
        task,
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error({ error: err }, 'Failed to create task');
      return {
        success: false,
        error: 'Failed to create task. Please try again.',
      };
    }
  }
);
