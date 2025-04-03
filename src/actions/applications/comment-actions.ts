'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { RequestLogger } from '@/lib/logger.server';
import { withAuthAndLog } from '@/lib/auth-and-log-wrapper';
import { Comment } from '@prisma/client';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';

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
export const addComment = withAuthAndLog<CommentResponse, [CommentData, KindeUser]>(
  async (logger: RequestLogger, data: CommentData, user: KindeUser): Promise<CommentResponse> => {
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

    // Verify that the Kinde user ID matches the authenticated user
    if (kindeUserId !== user.id) {
      logger.warn(
        {
          authenticatedUserId: user.id,
          providedUserId: kindeUserId,
        },
        'User ID mismatch when adding comment'
      );
      return { success: false, error: 'Unauthorized' };
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
          details: {
            action: 'addComment',
            applicationId,
            userId: kindeUserId,
            commentId: comment.id,
          },
        },
        'Comment added successfully'
      );

      // Revalidate the path
      revalidatePath(`/soknader/${applicationId}`);

      return {
        success: true,
        comment,
      };
    } catch (err) {
      const errorObject = {
        message: err instanceof Error ? err.message : String(err),
        code: (err as { code?: string })?.code,
        stack:
          process.env.NODE_ENV !== 'production' && err instanceof Error ? err.stack : undefined,
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

export const deleteComment = withAuthAndLog<DeleteRestoreResponse, [number, KindeUser]>(
  async (
    logger: RequestLogger,
    commentId: number,
    user: KindeUser
  ): Promise<DeleteRestoreResponse> => {
    try {
      // First get the comment to know which application to revalidate and to check ownership
      const comment = await db.comment.findUnique({
        where: { id: commentId },
        select: { applicationId: true, kindeUserId: true },
      });

      if (!comment) {
        return { success: false, error: 'Comment not found' };
      }

      // Security check: Verify that the user can delete this comment
      // Allow the comment author or potentially add admin role check here
      if (comment.kindeUserId !== user.id) {
        logger.warn(
          {
            commentId,
            commentOwnerId: comment.kindeUserId,
            requestingUserId: user.id,
          },
          'Unauthorized attempt to delete comment'
        );
        return { success: false, error: 'Unauthorized' };
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
          details: {
            action: 'deleteComment',
            commentId,
            applicationId: comment.applicationId,
            userId: user.id,
          },
        },
        'Comment deleted successfully'
      );

      // Revalidate the application path
      revalidatePath(`/soknader/${comment.applicationId}`);
      return { success: true };
    } catch (err) {
      const errorObject = {
        message: err instanceof Error ? err.message : String(err),
        code: (err as { code?: string })?.code,
        stack:
          process.env.NODE_ENV !== 'production' && err instanceof Error ? err.stack : undefined,
      };

      logger.error(
        {
          action: 'deleteComment',
          commentId,
          userId: user.id,
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

export const restoreComment = withAuthAndLog<DeleteRestoreResponse, [number, KindeUser]>(
  async (
    logger: RequestLogger,
    commentId: number,
    user: KindeUser
  ): Promise<DeleteRestoreResponse> => {
    try {
      // Get the comment
      const comment = await db.comment.findUnique({
        where: { id: commentId },
        select: { applicationId: true, kindeUserId: true },
      });

      if (!comment) {
        return { success: false, error: 'Comment not found' };
      }

      // Security check: Verify that the user can restore this comment
      // Allow the comment author or potentially add admin role check here
      if (comment.kindeUserId !== user.id) {
        logger.warn(
          {
            commentId,
            commentOwnerId: comment.kindeUserId,
            requestingUserId: user.id,
          },
          'Unauthorized attempt to restore comment'
        );
        return { success: false, error: 'Unauthorized' };
      }

      // Restore the comment
      await db.comment.update({
        where: { id: commentId },
        data: { deletedAt: null },
      });

      // Log success
      logger.info(
        {
          details: {
            action: 'restoreComment',
            commentId,
            applicationId: comment.applicationId,
            userId: user.id,
          },
        },
        'Comment restored successfully'
      );

      // Revalidate the application path
      revalidatePath(`/soknader/${comment.applicationId}`);
      return { success: true };
    } catch (err) {
      const errorObject = {
        message: err instanceof Error ? err.message : String(err),
        code: (err as { code?: string })?.code,
        stack:
          process.env.NODE_ENV !== 'production' && err instanceof Error ? err.stack : undefined,
      };

      logger.error(
        {
          action: 'restoreComment',
          commentId,
          userId: user.id,
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
