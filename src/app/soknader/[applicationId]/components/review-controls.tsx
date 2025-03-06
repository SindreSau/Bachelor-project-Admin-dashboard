'use client';

import { Button } from '@/components/ui/button';
import { Review, ReviewStatus } from '@prisma/client';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useTransition } from 'react';
import CustomAvatar from '@/components/common/custom-avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { submitReview } from '@/actions/applications/submit-review';

interface ReviewControlsProps {
  applicationId: number;
  applicationReviews: Review[];
  onReviewUpdate?: () => void;
}

const ReviewControls = ({
  applicationId,
  applicationReviews,
  onReviewUpdate,
}: ReviewControlsProps) => {
  const { user, isLoading } = useKindeBrowserClient();
  const [isPending, startTransition] = useTransition();
  const [currentUserStatus, setCurrentUserStatus] = useState<ReviewStatus | null>(null);
  const [localReviews, setLocalReviews] = useState<Review[]>(applicationReviews);
  // Flag to indicate when an optimistic update is in flight.
  const [isOptimistic, setIsOptimistic] = useState(false);

  // Update local state from props only when we are not in an optimistic update.
  useEffect(() => {
    if (!isOptimistic) {
      setLocalReviews(applicationReviews);
      if (user?.id) {
        const userReview = applicationReviews.find((review) => review.kindeUserId === user.id);
        setCurrentUserStatus(userReview?.review || null);
      }
    }
  }, [applicationReviews, user?.id, isOptimistic]);

  const handleReviewClick = (clickedReview: ReviewStatus) => {
    if (!user?.id || isPending) return;

    // Determine whether to remove or add a review.
    const shouldRemove = currentUserStatus === clickedReview;
    const newStatus = shouldRemove ? null : clickedReview;

    // Start optimistic update: lock local state updates from props.
    setIsOptimistic(true);
    updateLocalReviews(user.id, newStatus, user.given_name || '');
    setCurrentUserStatus(newStatus);

    // Perform the server update inside a transition.
    startTransition(async () => {
      try {
        const result = await submitReview(applicationId, newStatus, user.id, user.given_name || '');
        if (result.success) {
          if (onReviewUpdate) {
            onReviewUpdate();
          }
        } else {
          console.error('Failed to update review:', result.error);
          revertChanges();
        }
      } catch (error) {
        console.error('Error updating review:', error);
        revertChanges();
      } finally {
        // Unlock the optimistic flag so that prop updates can now sync state.
        setIsOptimistic(false);
      }
    });
  };

  // Revert local state if the server call fails.
  const revertChanges = () => {
    if (user?.id) {
      const originalReview = applicationReviews.find((r) => r.kindeUserId === user.id);
      setCurrentUserStatus(originalReview?.review || null);
      setLocalReviews(applicationReviews);
    }
  };

  // Update the local reviews array for optimistic UI feedback.
  const updateLocalReviews = (userId: string, newStatus: ReviewStatus | null, userName: string) => {
    const reviewsCopy = [...localReviews];

    // Remove any existing review for the current user.
    const userReviewIndex = reviewsCopy.findIndex((r) => r.kindeUserId === userId);
    if (userReviewIndex !== -1) {
      reviewsCopy.splice(userReviewIndex, 1);
    }

    // Add the new review if provided.
    if (newStatus !== null) {
      const newReview = {
        id: Date.now(), // Temporary ID (consider using a UUID if needed)
        applicationId,
        kindeUserId: userId,
        kindeGivenName: userName,
        review: newStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Review;
      reviewsCopy.push(newReview);
    }

    setLocalReviews(reviewsCopy);
  };

  // Calculate counts for each review type.
  const reviewCounts = {
    THUMBS_DOWN: localReviews.filter((review) => review.review === 'THUMBS_DOWN').length,
    THUMBS_UP: localReviews.filter((review) => review.review === 'THUMBS_UP').length,
    STAR: localReviews.filter((review) => review.review === 'STAR').length,
  };

  // Check if the current user has voted for a given review type.
  const hasUserVoted = (reviewType: ReviewStatus) => {
    return user?.id && currentUserStatus === reviewType;
  };

  // Get the list of users who submitted a particular review.
  const getUsersForReviewType = (reviewType: ReviewStatus) => {
    return localReviews.filter((review) => review.review === reviewType);
  };

  return (
    <div>
      <p className='text-sm font-medium text-muted-foreground'>Vurdering</p>
      <div className='flex gap-2'>
        <TooltipProvider>
          {[
            { value: 'THUMBS_DOWN', icon: ThumbsDown },
            { value: 'THUMBS_UP', icon: ThumbsUp },
            { value: 'STAR', icon: Star },
          ].map(({ value, icon: Icon }) => {
            const reviewValue = value as ReviewStatus;
            const count = reviewCounts[reviewValue];
            const isSelected = hasUserVoted(reviewValue);
            const usersWithThisReview = getUsersForReviewType(reviewValue);
            const shouldShowTooltip = usersWithThisReview.length > 0;

            return (
              <Tooltip key={value} delayDuration={500}>
                <TooltipTrigger asChild>
                  <Button
                    size='sm'
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() => handleReviewClick(reviewValue)}
                    disabled={isPending || isLoading}
                    className='relative h-8 w-16 p-0 disabled:cursor-not-allowed'
                  >
                    <Icon className='h-4 w-4' />
                    {count > 0 && (
                      <span
                        className={`absolute -right-2 -top-2 ${
                          isSelected ? 'bg-white text-primary' : 'bg-primary text-white'
                        } flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold`}
                      >
                        {count}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                {shouldShowTooltip && (
                  <TooltipContent side='bottom' className='max-w-none p-2'>
                    <div className='flex flex-col space-y-2'>
                      {usersWithThisReview.map((review) => (
                        <div key={review.kindeUserId} className='flex items-center gap-2'>
                          <CustomAvatar
                            size='sm'
                            user={{
                              id: review.kindeUserId,
                              given_name: review.kindeGivenName,
                              family_name: '',
                              picture: '',
                            }}
                          />
                          <span className='whitespace-nowrap text-sm'>
                            {review.kindeGivenName || 'User'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ReviewControls;
