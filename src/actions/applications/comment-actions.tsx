'use server';

import { db } from '@/lib/prisma'; // Make sure this path matches your Prisma client import

// Server action to add a comment to the database
export async function addComment(data: {
  applicationId: number;
  commentText: string;
  userId: string;
}) {
  const { applicationId, commentText, userId } = data;

  // Validate inputs
  if (!commentText.trim()) {
    return { success: false, error: 'Comment text is required' };
  }

  try {
    // Create a new comment in the database using Prisma
    const comment = await db.comment.create({
      data: {
        applicationId,
        commentText: commentText.trim(),
        userId,
      },
    });

    return {
      success: true,
      comment,
    };
  } catch (error) {
    console.error('Failed to add comment:', error);
    return {
      success: false,
      error: 'Failed to add comment. Please try again.',
    };
  }
}
