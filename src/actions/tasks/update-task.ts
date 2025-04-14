'use server';

import { withAuthAndLog } from '@/lib/auth-and-log-wrapper';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import triggerRevalidation from './trigger-revalidate';

export const updateTask = withAuthAndLog(
  async (
    logger,
    id: number,
    data: {
      taskName: string;
      taskDescription: string;
      deadline?: string | null;
      minStudents?: number;
      maxStudents?: number;
    },
    kindeUserId?: string
  ) => {
    try {
      const existingTask = await db.task.findUnique({
        where: { id },
        select: {
          taskName: true,
          taskDescription: true,
          deadline: true,
          minStudents: true,
          maxStudents: true,
        },
      });

      if (!existingTask) {
        logger.error(
          {
            action: 'updateTaskError',
            taskId: id,
            kindeUserId,
            error: {
              message: 'Task not found',
              taskId: id,
            },
          },
          `Failed to update task ${id}: Task not found`
        );
        return { success: false, error: 'Task not found' };
      }

      const deadlineDate = data.deadline ? new Date(data.deadline) : null;

      const result = await db.task.update({
        where: {
          id,
        },
        data: {
          taskName: data.taskName,
          taskDescription: data.taskDescription,
          deadline: deadlineDate,
          minStudents: data.minStudents,
          maxStudents: data.maxStudents,
        },
      });

      logger.info(
        {
          action: 'updateTask',
          taskId: id,
          kindeUserId,
          previousData: existingTask,
          newData: {
            taskName: data.taskName,
            taskDescription: data.taskDescription,
            deadline: deadlineDate,
            minStudents: data.minStudents,
            maxStudents: data.maxStudents,
          },
        },
        `Updated task ${id}`
      );

      await triggerRevalidation();
      revalidatePath('/oppgaver');

      return { success: true, data: result };
    } catch (error) {
      logger.error(
        {
          action: 'updateTaskError',
          taskId: id,
          kindeUserId,
          error: error instanceof Error ? error : new Error(String(error)),
        },
        `Failed to update task ${id}: ${error instanceof Error ? error.message : String(error)}`
      );

      return { success: false, error: 'Failed to update task' };
    }
  }
);
