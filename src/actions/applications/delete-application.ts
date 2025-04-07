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
          'Starting GDPR-compliant application deletion transaction'
        );

        // 1. see if application exists and get all students
        const application = await tx.application.findUnique({
          where: { id: applicationId },
          include: {
            students: {
              include: {
                files: true,
                // to check if student has other applications
                applications: {
                  where: {
                    id: {
                      not: applicationId, // all except current
                    },
                  },
                },
              },
            },
            reviews: true,
            comments: true,
          },
        });

        if (!application) {
          logger.warn(
            { action: 'deleteApplication', applicationId },
            'Attempted to delete non-existent application'
          );
          return { success: false, error: 'Application not found' };
        }

        // 2. delete all reviews linked to application
        const { count: deletedReviewsCount } = await tx.review.deleteMany({
          where: { applicationId },
        });

        logger.info(
          { action: 'deleteApplication', applicationId, count: deletedReviewsCount },
          'Deleted associated reviews'
        );

        // 3. deelete all comments connected to application
        const { count: deletedCommentsCount } = await tx.comment.deleteMany({
          where: { applicationId },
        });

        logger.info(
          { action: 'deleteApplication', applicationId, count: deletedCommentsCount },
          'Deleted associated comments'
        );

        // 4. for each student:
        for (const student of application.students) {
          // check if student has other applications
          const hasOtherApplications = student.applications.length > 0;

          if (!hasOtherApplications) {
            // first delete all files associated with this student if they have no other applications
            if (student.files.length > 0) {
              const { count: deletedFilesCount } = await tx.file.deleteMany({
                where: { studentId: student.id },
              });

              logger.info(
                { action: 'deleteApplication', studentId: student.id, count: deletedFilesCount },
                'Deleted student files as part of GDPR compliance'
              );
            }

            // then delete the student if they have no other applications
            await tx.student.delete({
              where: { id: student.id },
            });

            logger.info(
              { action: 'deleteApplication', studentId: student.id },
              'Deleted student as part of GDPR compliance'
            );
          } else {
            // 4c. If student has other applications, just disconnect from this one
            logger.info(
              {
                action: 'deleteApplication',
                studentId: student.id,
                otherApplicationsCount: student.applications.length,
              },
              'Student retained due to other application associations'
            );
          }
        }

        // 5. and finally delete the applicatoin
        await tx.application.delete({
          where: { id: applicationId },
        });

        logger.info(
          { action: 'deleteApplication', applicationId, status: 'completed' },
          'Succesfully deleted application!!'
        );

        return { success: true };
      });

      // Revalidate the applications path to update the UI
      revalidatePath('/applications');

      return { success: true };
    } catch (error: unknown) {
      // errors the same as in getOneApplication

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
