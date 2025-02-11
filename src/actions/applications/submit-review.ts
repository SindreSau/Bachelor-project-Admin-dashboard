'use server';

import { ReviewStatus } from '@prisma/client';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitReview(applicationId: number, review: ReviewStatus, userId: string) {
  try {
    const newReview = await db.review.upsert({
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

    revalidatePath(`/applications/${applicationId}`);
    return { success: true, data: newReview };
  } catch (error) {
    console.error('Error submitting review:', error);
    return { success: false, error: 'Failed to submit review' };
  }
}
