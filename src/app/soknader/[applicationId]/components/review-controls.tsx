'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Review, ReviewStatus } from '@prisma/client';
import { submitReview } from '@/actions/applications/submit-review';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import CustomAvatar from '@/components/common/custom-avatar';
import setApplicationStatus from '@/utils/applications/set-application-status';

const REVIEW_TYPES = [
  { value: 'THUMBS_DOWN' as ReviewStatus, icon: ThumbsDown },
  { value: 'THUMBS_UP' as ReviewStatus, icon: ThumbsUp },
  { value: 'STAR' as ReviewStatus, icon: Star },
];

interface ReviewControlsProps {
  applicationId: number;
  applicationReviews: Review[];
  applicationStatus: string;
  readOnly: boolean;
  onStatusChange?: (newStatus: string) => void;
}

const ReviewControls = ({
  applicationId,
  applicationReviews,
  applicationStatus,
  readOnly,
  onStatusChange,
}: ReviewControlsProps) => {
  const { user, isLoading } = useKindeBrowserClient();
  const currentUserId = user?.id || '';
  const currentUserGivenName = user?.given_name || '';
  const currentUserFamilyName = user?.family_name || '';
  const currentUserImage = user?.picture || '';

  // Use state to track the current user's review
  const [currentUserStatus, setCurrentUserStatus] = useState<ReviewStatus | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Update current user status when applicationReviews or user changes
  useEffect(() => {
    if (!currentUserId) return;

    const userReview = applicationReviews.find((review) => review.kindeUserId === currentUserId);
    setCurrentUserStatus(userReview?.review || null);
  }, [applicationReviews, currentUserId]);

  // Memoize computed reviews to avoid recalculating on every render
  const computedReviews = useMemo(() => {
    // Filter out current user's review
    const filteredReviews = applicationReviews.filter(
      (review) => review.kindeUserId !== currentUserId
    );

    // Add current user's review to the computed reviews if it exists
    if (currentUserStatus && currentUserId) {
      filteredReviews.push({
        id: -1, // Temporary ID for the client-side representation
        applicationId,
        kindeUserId: currentUserId,
        kindeGivenName: currentUserGivenName,
        kindeFamilyName: currentUserFamilyName,
        kindeUserImage: currentUserImage,
        review: currentUserStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Review);
    }

    return filteredReviews;
  }, [
    applicationReviews,
    currentUserId,
    currentUserStatus,
    applicationId,
    currentUserGivenName,
    currentUserFamilyName,
    currentUserImage,
  ]);

  // Memoize review counts to avoid recalculating on every render
  const reviewCounts = useMemo(() => {
    const counts: Record<ReviewStatus, number> = {
      THUMBS_DOWN: 0,
      THUMBS_UP: 0,
      STAR: 0,
    };

    computedReviews.forEach((review) => {
      if (review.review) {
        counts[review.review]++;
      }
    });

    return counts;
  }, [computedReviews]);

  const handleReviewClick = async (clickedReview: ReviewStatus) => {
    if (isPending || isLoading || !currentUserId) return;
    setIsPending(true);

    try {
      // If clicking the already selected review, remove it
      const shouldRemove = currentUserStatus === clickedReview;

      // Call your backend
      const result = await submitReview(
        applicationId,
        shouldRemove ? null : clickedReview,
        currentUserId,
        currentUserGivenName,
        currentUserFamilyName,
        currentUserImage
      );

      if (result.success) {
        if (applicationStatus === 'Ikke påbegynt') {
          await setApplicationStatus(applicationId, 'Påbegynt');
          if (onStatusChange) {
            onStatusChange('Påbegynt');
          }
        }
        // Update local state based on action
        setCurrentUserStatus(shouldRemove ? null : clickedReview);
      } else {
        console.error('Failed to update review:', result.error);
      }
    } catch (error) {
      console.error('Error updating review:', error);
    } finally {
      setIsPending(false);
    }
  };

  // Helper functions for tooltips - memoize to avoid recreating on every render
  const getUsersForReviewType = useMemo(() => {
    return (reviewType: ReviewStatus) =>
      computedReviews.filter((review) => review.review === reviewType);
  }, [computedReviews]);

  return (
    <div>
      <p className='text-muted-foreground sr-only text-sm font-medium'>Vurdering</p>
      <div className='flex gap-2'>
        <TooltipProvider>
          {REVIEW_TYPES.map(({ value, icon: Icon }) => {
            const reviewValue = value as ReviewStatus;
            const count = reviewCounts[reviewValue];
            const isSelected = currentUserStatus === reviewValue;
            const usersWithThisReview = getUsersForReviewType(reviewValue);
            const shouldShowTooltip = usersWithThisReview.length > 0;

            return (
              <Tooltip key={value} delayDuration={500}>
                <TooltipTrigger asChild>
                  {!readOnly ? (
                    <Button
                      size='sm'
                      variant={isSelected ? 'default' : 'outline'}
                      onClick={() => handleReviewClick(reviewValue)}
                      disabled={isPending || isLoading}
                      className='relative h-8 w-8 cursor-pointer p-0 disabled:cursor-not-allowed'
                      aria-label={`Vote ${value.toLowerCase().replace('_', ' ')}`}
                    >
                      <Icon className='h-4 w-4' />
                      {count > 0 && (
                        <span
                          className={`absolute -top-2 -right-2 border ${
                            isSelected
                              ? 'text-primary border-border bg-white'
                              : 'bg-primary border-primary text-white'
                          } flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold`}
                        >
                          {count}
                        </span>
                      )}
                    </Button>
                  ) : (
                    <div className='text-muted-foreground hover:text-muted-foreground/80 relative flex h-6 w-6 cursor-default items-center justify-center rounded-md bg-transparent p-0'>
                      <Icon className='h-4 w-4' />
                      {count > 0 && (
                        <span className='bg-primary absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white'>
                          {count}
                        </span>
                      )}
                    </div>
                  )}
                </TooltipTrigger>
                {shouldShowTooltip && (
                  <TooltipContent side='bottom' className='max-w-none p-2'>
                    <div className='flex flex-col space-y-2'>
                      {usersWithThisReview.map((review) => (
                        <div key={review.kindeUserId} className='flex items-center gap-2'>
                          <CustomAvatar
                            size='sm'
                            userData={{
                              id: review.kindeUserId,
                              given_name: review.kindeGivenName,
                              family_name: review.kindeFamilyName || '',
                              picture: review.kindeUserImage,
                            }}
                          />
                          <span className='text-sm whitespace-nowrap'>
                            {review.kindeGivenName} {review.kindeFamilyName}
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
