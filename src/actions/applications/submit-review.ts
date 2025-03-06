'use server';

import { ReviewStatus } from '@prisma/client';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitReview(
  applicationId: number,
  review: ReviewStatus | null,
  kindeUserId: string,
  kindeGivenName: string = ''
) {
  try {
    let result;

    // If review is null, delete the review instead of trying to update it to null
    if (review === null) {
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
          // If no record exists to delete, that's fine
          return null;
        });
      console.log('deleted result:', result);
    } else {
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
        },
        create: {
          applicationId,
          kindeUserId,
          kindeGivenName,
          review,
        },
      });
      console.log('upserted result:', result);
    }

    revalidatePath(`/soknader`);
    revalidatePath(`/soknader/${applicationId}`);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error submitting review:', error);
    return { success: false, error: 'Failed to submit review' };
  }
}
