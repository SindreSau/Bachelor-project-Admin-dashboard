'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/prisma';
import { RequestLogger } from '@/lib/logger.server';
import { withAuthAndLog } from '@/lib/auth-and-log-wrapper';
import { deleteByUrl } from '@/utils/blobstorage/delete-files';

type DeleteApplicationResult = {
  success: boolean;
  error?: string;
};

export const deleteApplication = withAuthAndLog<DeleteApplicationResult, [number]>(
  async (logger: RequestLogger, applicationId: number): Promise<DeleteApplicationResult> => {
    try {
      const filesToDelete = await db.file.findMany({
        where: {
          student: {
            applicationId: applicationId,
          },
        },
        select: {
          storageUrl: true,
        },
      });

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

        //TODO: Delete files from blob

        // With cascade delete, deleting the application automatically deletes:
        // - All related students
        // - All related files (via students)
        // - All related reviews
        // - All related comments
        await tx.application.delete({
          where: { id: applicationId },
        });

        const blobDeletionPromises = filesToDelete.map(async (file) => {
          try {
            await deleteByUrl(file.storageUrl);
            logger.info(
              { action: 'deleteApplication', blobUrl: file.storageUrl },
              'Successfully deleted blob file'
            );
          } catch (error) {
            // Log the error but don't fail the whole operation
            const errorObj = error instanceof Error ? error : new Error(String(error));
            logger.error(
              { action: 'deleteApplication', blobUrl: file.storageUrl, error: errorObj },
              'Failed to delete blob file'
            );
          }
        });

        // Wait for all blob deletions to complete
        await Promise.all(blobDeletionPromises);

        logger.info(
          { action: 'deleteApplication', applicationId, status: 'completed' },
          'Successfully deleted application with all related entities (via cascade) and files via blob deletion'
        );

        return { success: true };
      });

      // Revalidate the applications path to update the UI
      revalidatePath('/applications');

      return { success: true };
    } catch (error) {
      const errorObject = error instanceof Error ? error : new Error(String(error));

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
