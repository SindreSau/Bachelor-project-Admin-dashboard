import { prismaMock } from '@/../singleton';
import { submitReview } from '@/actions/applications/submit-review';
import { ReviewStatus } from '@prisma/client';

// Mock dependencies
jest.mock('../../../lib/prisma', () => ({
  db: prismaMock,
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

const applicationId = 1;
const kindeUserId = 'user-123';
const review = ReviewStatus.STAR;
const kindeGivenName = 'John';
const kindeFamilyName = 'Doe';
const kindeUserImage = 'img.png';

describe('submitReview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new review if none exists', async () => {
    (prismaMock.review.findUnique as jest.Mock).mockResolvedValue(null);
    (prismaMock.review.upsert as jest.Mock).mockResolvedValue({ review });

    const result = await submitReview(
      applicationId,
      review,
      kindeUserId,
      kindeGivenName,
      kindeFamilyName,
      kindeUserImage
    );

    expect(prismaMock.review.findUnique).toHaveBeenCalled();
    expect(prismaMock.review.upsert).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.data?.review).toBe(review);
  });

  it('updates an existing review', async () => {
    (prismaMock.review.findUnique as jest.Mock).mockResolvedValue({
      review: ReviewStatus.THUMBS_UP,
    });
    (prismaMock.review.upsert as jest.Mock).mockResolvedValue({ review });

    const result = await submitReview(
      applicationId,
      review,
      kindeUserId,
      kindeGivenName,
      kindeFamilyName,
      kindeUserImage
    );

    expect(prismaMock.review.findUnique).toHaveBeenCalled();
    expect(prismaMock.review.upsert).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.data?.review).toBe(review);
  });

  it('deletes a review if review is null', async () => {
    (prismaMock.review.findUnique as jest.Mock).mockResolvedValue({
      review: ReviewStatus.THUMBS_DOWN,
    });
    (prismaMock.review.delete as jest.Mock).mockResolvedValue({ review: ReviewStatus.THUMBS_DOWN });

    const result = await submitReview(
      applicationId,
      null,
      kindeUserId,
      kindeGivenName,
      kindeFamilyName,
      kindeUserImage
    );

    expect(prismaMock.review.findUnique).toHaveBeenCalled();
    expect(prismaMock.review.delete).toHaveBeenCalled();
    expect(result.success).toBe(true);
  });

  it('handles delete when no review exists gracefully', async () => {
    (prismaMock.review.findUnique as jest.Mock).mockResolvedValue(null);
    (prismaMock.review.delete as jest.Mock).mockRejectedValue(new Error('No record'));

    const result = await submitReview(
      applicationId,
      null,
      kindeUserId,
      kindeGivenName,
      kindeFamilyName,
      kindeUserImage
    );

    expect(prismaMock.review.findUnique).toHaveBeenCalled();
    expect(prismaMock.review.delete).toHaveBeenCalled();
    expect(result.success).toBe(true);
  });

  it('handles errors', async () => {
    (prismaMock.review.findUnique as jest.Mock).mockRejectedValue(new Error('prismaMock error'));

    const result = await submitReview(
      applicationId,
      review,
      kindeUserId,
      kindeGivenName,
      kindeFamilyName,
      kindeUserImage
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to submit review');
  });
});
