'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { withRequestLogger, RequestLogger } from '@/lib/logger.server';
import { Comment } from '@prisma/client';

// Updated interface to match the new model
interface CommentData {
  applicationId: number;
  commentText: string;
  kindeUserId: string;
  kindeGivenName: string;
  kindeFamilyName: string;
  kindeUserImage: string;
  deletedAt?: Date;
}

interface CommentResponse {
  success: boolean;
  comment?: Comment;
  error?: string;
}

interface DeleteRestoreResponse {
  success: boolean;
  error?: string;
}

// Server action to add a comment to the database
export const addComment = withRequestLogger<CommentResponse, [CommentData]>(
  async (logger: RequestLogger, data: CommentData): Promise<CommentResponse> => {
    const {
      applicationId,
      commentText,
      kindeUserId,
      kindeGivenName,
      kindeFamilyName,
      kindeUserImage,
    } = data;

    // Validate inputs
    if (!commentText?.trim()) {
      return { success: false, error: 'Comment text is required' };
    }

    try {
      // Create a new comment in the database using Prisma
      const comment = await db.comment.create({
        data: {
          applicationId,
          commentText: commentText.trim(),
          kindeUserId,
          kindeGivenName,
          kindeFamilyName,
          kindeUserImage,
        },
      });

      // Log success
      logger.info(
        {
          action: 'addComment',
          applicationId,
          userId: kindeUserId,
          commentId: comment.id,
        },
        'Comment added successfully'
      );

      // Revalidate the path
      revalidatePath(`/soknader/${applicationId}`);

      return {
        success: true,
        comment,
      };
    } catch (error) {
      const errorObject = {
        message: error instanceof Error ? error.message : String(error),
        code: (error as { code?: string })?.code,
        stack:
          process.env.NODE_ENV !== 'production' && error instanceof Error ? error.stack : undefined,
      };

      logger.error(
        {
          action: 'addComment',
          applicationId,
          userId: kindeUserId,
          error: errorObject,
        },
        'Failed to add comment'
      );

      return {
        success: false,
        error: 'Failed to add comment. Please try again.',
      };
    }
  }
);

export const deleteComment = withRequestLogger<DeleteRestoreResponse, [number]>(
  async (logger: RequestLogger, commentId: number): Promise<DeleteRestoreResponse> => {
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
      const updatedComment = await db.comment.update({
        where: { id: commentId },
        data: { deletedAt: new Date() },
      });

      // Verify update was successful
      if (!updatedComment.deletedAt) {
        return { success: false, error: 'Failed to delete comment' };
      }

      // Log success
      logger.info(
        {
          action: 'deleteComment',
          commentId,
          applicationId: comment.applicationId,
        },
        'Comment deleted successfully'
      );

      // Revalidate the application path
      revalidatePath(`/soknader/${comment.applicationId}`);
      return { success: true };
    } catch (error) {
      const errorObject = {
        message: error instanceof Error ? error.message : String(error),
        code: (error as { code?: string })?.code,
        stack:
          process.env.NODE_ENV !== 'production' && error instanceof Error ? error.stack : undefined,
      };

      logger.error(
        {
          action: 'deleteComment',
          commentId,
          error: errorObject,
        },
        'Failed to delete comment'
      );

      return {
        success: false,
        error: 'Failed to delete comment. Please try again.',
      };
    }
  }
);

export const restoreComment = withRequestLogger<DeleteRestoreResponse, [number]>(
  async (logger: RequestLogger, commentId: number): Promise<DeleteRestoreResponse> => {
    try {
      // get the comment
      const comment = await db.comment.findUnique({
        where: { id: commentId },
        select: { applicationId: true },
      });

      if (!comment) {
        return { success: false, error: 'Comment not found' };
      }

      // Restore the comment
      await db.comment.update({
        where: { id: commentId },
        data: { deletedAt: null },
      });

      // Log success
      logger.info(
        {
          action: 'restoreComment',
          commentId,
          applicationId: comment.applicationId,
        },
        'Comment restored successfully'
      );

      // Revalidate the application path
      revalidatePath(`/soknader/${comment.applicationId}`);
      return { success: true };
    } catch (error) {
      const errorObject = {
        message: error instanceof Error ? error.message : String(error),
        code: (error as { code?: string })?.code,
        stack:
          process.env.NODE_ENV !== 'production' && error instanceof Error ? error.stack : undefined,
      };

      logger.error(
        {
          action: 'restoreComment',
          commentId,
          error: errorObject,
        },
        'Failed to restore comment'
      );

      return {
        success: false,
        error: 'Failed to restore comment. Please try again.',
      };
    }
  }
);
