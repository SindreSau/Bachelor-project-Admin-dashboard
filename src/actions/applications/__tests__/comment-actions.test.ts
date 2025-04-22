import { prismaMock } from '@/../singleton';
import { addComment, deleteComment, restoreComment } from '@/actions/applications/comment-actions';
import { Comment } from '@prisma/client';

// Define interfaces to match those in comment-actions.ts
interface CommentResponse {
  success: boolean;
  comment?: Comment;
  error?: string;
}

// Mock dependencies before importing
jest.mock('../../../lib/prisma', () => ({
  db: prismaMock,
}));

// Mock revalidatePath
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Comment Actions', () => {
  const mockUser = {
    id: 'user-123',
    given_name: 'John',
    family_name: 'Doe',
    email: 'john@example.com',
    picture: 'https://example.com/image.jpg',
  };

  const mockCommentData = {
    applicationId: 1,
    commentText: 'This is a test comment',
    kindeUserId: 'user-123',
    kindeGivenName: 'John',
    kindeFamilyName: 'Doe',
    kindeUserImage: 'https://example.com/image.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addComment', () => {
    it('should add a new comment successfully', async () => {
      // Arrange
      const mockComment: Comment = {
        id: 1,
        applicationId: 1,
        commentText: 'This is a test comment',
        createdAt: new Date(),
        kindeUserId: 'user-123',
        kindeGivenName: 'John',
        kindeFamilyName: 'Doe',
        kindeUserImage: 'https://example.com/image.jpg',
        deletedAt: null,
      };

      prismaMock.comment.create.mockResolvedValue(mockComment);

      // Act
      const result = (await addComment(mockCommentData, mockUser)) as CommentResponse;

      // Assert
      expect(result?.success).toBe(true);
      expect(result?.comment).toEqual(mockComment);
      expect(prismaMock.comment.create).toHaveBeenCalledWith({
        data: {
          applicationId: 1,
          commentText: 'This is a test comment',
          kindeUserId: 'user-123',
          kindeGivenName: 'John',
          kindeFamilyName: 'Doe',
          kindeUserImage: 'https://example.com/image.jpg',
        },
      });
    });

    it('should return error for empty comment text', async () => {
      // Arrange
      const invalidCommentData = {
        ...mockCommentData,
        commentText: '   ', // Empty or whitespace-only
      };

      // Act
      const result = (await addComment(invalidCommentData, mockUser)) as CommentResponse;

      // Assert
      expect(result?.success).toBe(false);
      expect(result?.error).toBe('Comment text is required');
      expect(prismaMock.comment.create).not.toHaveBeenCalled();
    });

    it('should return unauthorized error when user IDs do not match', async () => {
      // Arrange
      const differentUser = {
        ...mockUser,
        id: 'different-user-id',
      };

      // Act
      const result = (await addComment(mockCommentData, differentUser)) as CommentResponse;

      // Assert
      expect(result?.success).toBe(false);
      expect(result?.error).toBe('Unauthorized');
      expect(prismaMock.comment.create).not.toHaveBeenCalled();
    });

    it('should handle database errors properly', async () => {
      // Arrange
      prismaMock.comment.create.mockRejectedValue(new Error('Database error'));

      // Act
      const result = (await addComment(mockCommentData, mockUser)) as CommentResponse;

      // Assert
      expect(result?.success).toBe(false);
      expect(result?.error).toBe('Failed to add comment. Please try again.');
    });
  });

  describe('deleteComment', () => {
    const mockCommentId = 1;
    const mockDeletedDate = new Date();

    beforeEach(() => {
      // Mock the comment find for authorization check
      prismaMock.comment.findUnique.mockResolvedValue({
        id: mockCommentId,
        applicationId: 1,
        kindeUserId: 'user-123',
        commentText: 'Test comment',
        createdAt: new Date(),
        kindeGivenName: 'John',
        kindeFamilyName: 'Doe',
        kindeUserImage: 'image-url',
        deletedAt: null,
      });

      // Mock the update operation
      prismaMock.comment.update.mockResolvedValue({
        id: mockCommentId,
        applicationId: 1,
        kindeUserId: 'user-123',
        commentText: 'Test comment',
        createdAt: new Date(),
        kindeGivenName: 'John',
        kindeFamilyName: 'Doe',
        kindeUserImage: 'image-url',
        deletedAt: mockDeletedDate,
      });
    });

    it('should delete a comment successfully', async () => {
      // Act
      const result = (await deleteComment(mockCommentId, mockUser)) as CommentResponse;

      // Assert
      expect(result?.success).toBe(true);
      expect(prismaMock.comment.findUnique).toHaveBeenCalledWith({
        where: { id: mockCommentId },
        select: { applicationId: true, kindeUserId: true },
      });
      expect(prismaMock.comment.update).toHaveBeenCalledWith({
        where: { id: mockCommentId },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should return error when comment is not found', async () => {
      // Arrange
      prismaMock.comment.findUnique.mockResolvedValue(null);

      // Act
      const result = (await deleteComment(mockCommentId, mockUser)) as CommentResponse;

      // Assert
      expect(result?.success).toBe(false);
      expect(result?.error).toBe('Comment not found');
      expect(prismaMock.comment.update).not.toHaveBeenCalled();
    });

    it('should return unauthorized error when user is not the comment owner', async () => {
      // Arrange
      const differentUser = {
        ...mockUser,
        id: 'different-user-id',
      };

      // Act
      const result = (await deleteComment(mockCommentId, differentUser)) as CommentResponse;

      // Assert
      expect(result?.success).toBe(false);
      expect(result?.error).toBe('Unauthorized');
      expect(prismaMock.comment.update).not.toHaveBeenCalled();
    });

    it('should handle database errors properly', async () => {
      // Arrange
      prismaMock.comment.update.mockRejectedValue(new Error('Database error'));

      // Act
      const result = (await deleteComment(mockCommentId, mockUser)) as CommentResponse;

      // Assert
      expect(result?.success).toBe(false);
      expect(result?.error).toBe('Failed to delete comment. Please try again.');
    });

    it('should return error if update operation does not set deletedAt', async () => {
      // Arrange
      prismaMock.comment.update.mockResolvedValue({
        id: mockCommentId,
        applicationId: 1,
        kindeUserId: 'user-123',
        commentText: 'Test comment',
        createdAt: new Date(),
        kindeGivenName: 'John',
        kindeFamilyName: 'Doe',
        kindeUserImage: 'image-url',
        deletedAt: null, // No deletedAt was set
      });

      // Act
      const result = (await deleteComment(mockCommentId, mockUser)) as CommentResponse;

      // Assert
      expect(result?.success).toBe(false);
      expect(result?.error).toBe('Failed to delete comment');
    });
  });

  describe('restoreComment', () => {
    const mockCommentId = 1;

    beforeEach(() => {
      // Mock the comment find for authorization check
      prismaMock.comment.findUnique.mockResolvedValue({
        id: mockCommentId,
        applicationId: 1,
        kindeUserId: 'user-123',
        commentText: 'Test comment',
        createdAt: new Date(),
        kindeGivenName: 'John',
        kindeFamilyName: 'Doe',
        kindeUserImage: 'image-url',
        deletedAt: new Date(), // Comment is deleted
      });

      // Mock the update operation
      prismaMock.comment.update.mockResolvedValue({
        id: mockCommentId,
        applicationId: 1,
        kindeUserId: 'user-123',
        commentText: 'Test comment',
        createdAt: new Date(),
        kindeGivenName: 'John',
        kindeFamilyName: 'Doe',
        kindeUserImage: 'image-url',
        deletedAt: null, // Comment is restored
      });
    });

    it('should restore a comment successfully', async () => {
      // Act
      const result = (await restoreComment(mockCommentId, mockUser)) as CommentResponse;

      // Assert
      expect(result?.success).toBe(true);
      expect(prismaMock.comment.findUnique).toHaveBeenCalledWith({
        where: { id: mockCommentId },
        select: { applicationId: true, kindeUserId: true },
      });
      expect(prismaMock.comment.update).toHaveBeenCalledWith({
        where: { id: mockCommentId },
        data: { deletedAt: null },
      });
    });

    it('should return error when comment is not found', async () => {
      // Arrange
      prismaMock.comment.findUnique.mockResolvedValue(null);

      // Act
      const result = (await restoreComment(mockCommentId, mockUser)) as CommentResponse;

      // Assert
      expect(result?.success).toBe(false);
      expect(result?.error).toBe('Comment not found');
      expect(prismaMock.comment.update).not.toHaveBeenCalled();
    });

    it('should return unauthorized error when user is not the comment owner', async () => {
      // Arrange
      const differentUser = {
        ...mockUser,
        id: 'different-user-id',
      };

      // Act
      const result = (await restoreComment(mockCommentId, differentUser)) as CommentResponse;

      // Assert
      expect(result?.success).toBe(false);
      expect(result?.error).toBe('Unauthorized');
      expect(prismaMock.comment.update).not.toHaveBeenCalled();
    });

    it('should handle database errors properly', async () => {
      // Arrange
      prismaMock.comment.update.mockRejectedValue(new Error('Database error'));

      // Act
      const result = (await restoreComment(mockCommentId, mockUser)) as CommentResponse;

      // Assert
      expect(result?.success).toBe(false);
      expect(result?.error).toBe('Failed to restore comment. Please try again.');
    });
  });
});
