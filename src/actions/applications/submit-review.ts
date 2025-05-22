'use server';

import { withAuthAndLog } from '@/lib/auth-and-log-wrapper';
import { ReviewStatus } from '@prisma/client';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const submitReview = withAuthAndLog(
  async (
    logger,
    applicationId: number,
    review: ReviewStatus | null,
    kindeUserId: string,
    kindeGivenName: string = '',
    kindeFamilyName: string = '',
    kindeUserImage: string = ''
  ) => {
    try {
      let result;

      // If review is null, delete the review instead of trying to update it to null
      if (review === null) {
        // Check if a review exists first
        const existingReview = await db.review.findUnique({
          where: {
            applicationId_kindeUserId: {
              applicationId,
              kindeUserId,
            },
          },
          select: { review: true },
        });

        result = await db.review
          .delete({
            where: {
              applicationId_kindeUserId: {
                applicationId,
                kindeUserId,
              },
            },
          })
          .catch(() => {
            // No record exists to delete; that's acceptable
            return null;
          });

        // Only log if we actually deleted something
        if (result) {
          logger.info(
            {
              action: 'deleteReview',
              applicationId,
              kindeUserId,
              previousReview: existingReview?.review,
            },
            `Deleted ${existingReview?.review || 'unknown'} review for application ${applicationId}`
          );
        }
      } else {
        // Check if this is an update or create
        const existingReview = await db.review.findUnique({
          where: {
            applicationId_kindeUserId: {
              applicationId,
              kindeUserId,
            },
          },
          select: { review: true },
        });

        // Otherwise, proceed with upsert as before
        result = await db.review.upsert({
          where: {
            applicationId_kindeUserId: {
              applicationId,
              kindeUserId,
            },
          },
          update: {
            review,
            kindeGivenName,
            kindeFamilyName,
            kindeUserImage,
          },
          create: {
            applicationId,
            kindeUserId,
            kindeGivenName,
            kindeFamilyName,
            kindeUserImage,
            review,
          },
        });

        // Single log with meaningful context
        if (existingReview) {
          logger.info(
            {
              action: 'updateReview',
              applicationId,
              kindeUserId,
              previousReview: existingReview.review,
              newReview: review,
            },
            `Updated review from ${existingReview.review} to ${review} for application ${applicationId}`
          );
        } else {
          logger.info(
            {
              action: 'createReview',
              applicationId,
              kindeUserId,
              review,
            },
            `Created new ${review} review for application ${applicationId}`
          );
        }
      }

      revalidatePath(`/soknader`);
      revalidatePath(`/soknader/${applicationId}`);

      return { success: true, data: result };
    } catch (error) {
      logger.error(
        {
          action: 'reviewError',
          applicationId,
          kindeUserId,
          review,
          error: error instanceof Error ? error : new Error(String(error)),
        },
        `Error with review for application ${applicationId}: ${error instanceof Error ? error.message : String(error)}`
      );

      return { success: false, error: 'Failed to submit review' };
    }
  }
);
