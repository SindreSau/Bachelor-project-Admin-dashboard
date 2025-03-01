'use server';

import { db } from '@/lib/prisma'; // Make sure this path matches your Prisma client import
import { revalidatePath } from 'next/cache';

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

    // Revalidate the path
    revalidatePath(`/applications/${applicationId}`);

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

export async function deleteComment(commentId: number) {
  try {
    // First get the comment to know which application to revalidate
    const comment = await db.comment.findUnique({
      where: { id: commentId },
      select: { applicationId: true },
    });

    if (!comment) {
      return { success: false, error: 'Comment not found' };
    }

    // Delete the comment
    await db.comment.delete({
      where: { id: commentId },
    });

    // Revalidate the application path
    revalidatePath(`/applications/${comment.applicationId}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to delete comment:', error);
    return {
      success: false,
      error: 'Failed to delete comment. Please try again.',
    };
  }
}
