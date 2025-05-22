'use server';

import { db } from '@/lib/prisma';
import { RequestLogger } from '@/lib/logger.server';
import { Application, Student, Review, Task, Comment, File } from '@prisma/client';
import { withAuthAndLog } from '@/lib/auth-and-log-wrapper';

// Define the complete return type with all relations
export type ApplicationWithRelations = Application & {
  students: (Student & {
    files: File[];
  })[];
  studentRepresentative: Student | null;
  reviews: Review[];
  tasks: Task[];
  comments: Comment[];
};

export const getOneApplication = withAuthAndLog<ApplicationWithRelations | null, [number]>(
  async (
    logger: RequestLogger,
    applicationId: number
  ): Promise<ApplicationWithRelations | null> => {
    try {
      const applicationWithUnsortedTasks = await db.application.findUnique({
        where: { id: applicationId },
        include: {
          students: {
            include: {
              files: true,
            },
          },
          studentRepresentative: true,
          reviews: true,
          tasks: true,
          comments: {
            where: {
              deletedAt: null,
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

      if (!applicationWithUnsortedTasks) {
        logger.info({ action: 'getOneApplication', applicationId }, 'Application not found');
        return null;
      }

      const taskPriorityIds = applicationWithUnsortedTasks?.taskpriorityids;
      const sortedTasks = applicationWithUnsortedTasks?.tasks.sort((a, b) => {
        if (!taskPriorityIds) return 0;
        return taskPriorityIds.indexOf(a.id) - taskPriorityIds.indexOf(b.id);
      });

      const applicationWithSortedTasks = {
        ...applicationWithUnsortedTasks,
        tasks: sortedTasks,
      };

      // Log success with useful metrics
      logger.info(
        {
          details: {
            action: 'getOneApplication',
            applicationId,
            studentsCount: applicationWithSortedTasks.students.length,
            tasksCount: applicationWithSortedTasks.tasks.length,
            commentsCount: applicationWithSortedTasks.comments.length,
            reviewsCount: applicationWithSortedTasks.reviews.length,
          },
        },
        'Successfully fetched application with relations'
      );

      return applicationWithSortedTasks;
    } catch (error: unknown) {
      // Create error object explicitly without properties first
      const errorObject: { message: string } = {
        message: error instanceof Error ? error.message : String(error),
      };

      // Add properties conditionally
      if (
        error !== null &&
        typeof error === 'object' &&
        'code' in error &&
        typeof error.code === 'string'
      ) {
        (errorObject as { message: string; code: string }).code = error.code;
      }

      // Only add stack trace in non-production
      if (process.env.NODE_ENV !== 'production' && error instanceof Error && error.stack) {
        (errorObject as { message: string; stack: string }).stack = error.stack;
      }

      logger.error(
        {
          action: 'getOneApplication',
          applicationId,
          error: errorObject,
        },
        'Failed to fetch application'
      );

      // Re-throw the error to be handled by the caller
      throw error;
    }
  }
);
