'use server';

import { ReviewStatus } from '@prisma/client';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitReview(
  applicationId: number,
  review: ReviewStatus | null,
  userId: string
) {
  try {
    let result;

    // If review is null, delete the review instead of trying to update it to null
    if (review === null) {
      result = await db.review
        .delete({
          where: {
            applicationId_userId: {
              applicationId,
              userId,
            },
          },
        })
        .catch(() => {
          // If no record exists to delete, that's fine
          return null;
        });
    } else {
      // Otherwise, proceed with upsert as before
      result = await db.review.upsert({
        where: {
          applicationId_userId: {
            applicationId,
            userId,
          },
        },
        update: {
          review,
        },
        create: {
          applicationId,
          userId,
          review,
        },
      });
    }

    revalidatePath(`/applications`);
    revalidatePath(`/applications/${applicationId}`);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error submitting review:', error);
    return { success: false, error: 'Failed to submit review' };
  }
}
