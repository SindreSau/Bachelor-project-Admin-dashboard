'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/prisma';
import { withRequestLogger, RequestLogger } from '@/lib/logger.server';

type DeleteApplicationResult = {
  success: boolean;
  error?: string;
};

export const deleteApplication = withRequestLogger<DeleteApplicationResult, [number]>(
  async (logger: RequestLogger, applicationId: number): Promise<DeleteApplicationResult> => {
    try {
      await db.$transaction(async (tx) => {
        logger.info(
          { action: 'deleteApplication', applicationId, step: 'started' },
          'Starting delete process'
        );

        // Check if application exists
        const application = await tx.application.findUnique({
          where: { id: applicationId },
        });

        if (!application) {
          logger.warn(
            { action: 'deleteApplication', applicationId },
            'Attempted to delete non-existent application'
          );
          return { success: false, error: 'Application not found' };
        }

        // With cascade delete, deleting the application automatically deletes:
        // - All related students
        // - All related files (via students)
        // - All related reviews
        // - All related comments
        await tx.application.delete({
          where: { id: applicationId },
        });

        logger.info(
          { action: 'deleteApplication', applicationId, status: 'completed' },
          'Successfully deleted application with all related entities (via cascade)'
        );

        return { success: true };
      });

      // Revalidate the applications path to update the UI
      revalidatePath('/applications');

      return { success: true };
    } catch (error: unknown) {
      const errorObject: { message: string } = {
        message: error instanceof Error ? error.message : String(error),
      };

      if (
        error !== null &&
        typeof error === 'object' &&
        'code' in error &&
        typeof error.code === 'string'
      ) {
        (errorObject as { message: string; code: string }).code = error.code;
      }

      if (process.env.NODE_ENV !== 'production' && error instanceof Error && error.stack) {
        (errorObject as { message: string; stack: string }).stack = error.stack;
      }

      logger.error(
        {
          action: 'deleteApplication',
          applicationId,
          error: errorObject,
        },
        'Failed to delete application'
      );

      return {
        success: false,
        error: errorObject.message,
      };
    }
  }
);
