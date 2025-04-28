'use server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/prisma';
import { RequestLogger } from '@/lib/logger.server';
import { withAuthAndLog } from '@/lib/auth-and-log-wrapper';
import { deleteAll } from '@/utils/blobstorage/delete-files';

export type DeleteAllApplicationsResult = {
  success: boolean;
  error?: string;
};

export const deleteAllApplications = withAuthAndLog<DeleteAllApplicationsResult, []>(
  async (logger: RequestLogger): Promise<DeleteAllApplicationsResult> => {
    try {
      try {
        await db.$transaction(async (tx) => {
          logger.info(
            { action: 'deleteAllApplications', step: 'started' },
            'Starting bulk delete process'
          );
          await tx.application.deleteMany({});
          logger.info(
            { action: 'deleteAllApplications', status: 'completed' },
            'Deleted all applications'
          );
        });
      } catch (error) {
        const errorObject = error instanceof Error ? error : new Error(String(error));
        logger.error(
          { action: 'deleteAllApplications', error: errorObject },
          'Failed to delete all applications'
        );
        return { success: false, error: 'Failed to delete all applications' };
      }

      await deleteAll();
      logger.info({ action: 'deleteAllApplications' }, 'Deleted all blobs from all containers');

      revalidatePath('/applications');
      return { success: true };
    } catch (error) {
      const errorObject = error instanceof Error ? error : new Error(String(error));
      logger.error(
        { action: 'deleteAllApplications', error: errorObject },
        'Failed to delete all applications'
      );
      return { success: false, error: errorObject.message };
    }
  }
);
