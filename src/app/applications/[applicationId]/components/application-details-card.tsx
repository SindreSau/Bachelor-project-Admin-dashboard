'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Review, ReviewStatus } from '@prisma/client';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { submitReview } from '@/actions/applications/submit-review';
import getApplicationStatus from '@/utils/applications/get-application-status';

interface ApplicationDetailsCardProps {
  applicationId: number;
  groupName: string;
  school: string | null;
  createdAt: Date;
  updatedAt: Date;
  applicationReviews: Review[];
}

const ApplicationDetailsCard = ({
  applicationId,
  groupName,
  school,
  createdAt,
  updatedAt,
  applicationReviews,
}: ApplicationDetailsCardProps) => {
  // For now, we'll hardcode a userId (later this will come from auth)
  const currentUserId = 'user1';

  // Use state to track the current user's review
  const [currentUserStatus, setCurrentUserStatus] = useState<ReviewStatus | null>(
    applicationReviews.find((review) => review.userId === currentUserId)?.review || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update current user status when applicationReviews changes (from database)
  useEffect(() => {
    const userReview = applicationReviews.find((review) => review.userId === currentUserId);
    setCurrentUserStatus(userReview?.review || null);
  }, [applicationReviews, currentUserId]);

  const handleReviewClick = async (clickedReview: ReviewStatus) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // If clicking the already selected review, remove it
      const shouldRemove = currentUserStatus === clickedReview;

      // Call your backend
      const result = await submitReview(
        applicationId,
        shouldRemove ? null : clickedReview,
        currentUserId
      );

      if (result.success) {
        // Update local state based on action
        setCurrentUserStatus(shouldRemove ? null : clickedReview);
      } else {
        console.error('Failed to update review:', result.error);
      }
    } catch (error) {
      console.error('Error updating review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // We're keeping the original reviews for all data except the current user's review
  // which we'll override with our local state
  const computedReviews = applicationReviews.filter((review) => review.userId !== currentUserId);

  // Add current user's review to the computed reviews if it exists
  if (currentUserStatus) {
    computedReviews.push({
      userId: currentUserId,
      applicationId,
      review: currentUserStatus,
    } as Review);
  }

  const applicationStatus = getApplicationStatus(computedReviews);

  return (
    <Card>
      <CardContent>
        <ScrollArea>
          <div className='grid gap-4 pt-6 sm:gap-6'>
            {/* Info Section - 2 columns on mobile, 3 on larger screens */}
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Gruppenavn</p>
                <p className='text-sm'>{groupName}</p>
              </div>

              <div>
                <p className='text-sm font-medium text-muted-foreground'>Skole</p>
                <p className='text-sm'>{school}</p>
              </div>

              <div>
                <p className='text-sm font-medium text-muted-foreground'>Søknadsdato</p>
                <p className='text-sm'>
                  {createdAt?.toLocaleDateString('nb-NO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div>
                <p className='text-sm font-medium text-muted-foreground'>Sist Oppdatert</p>
                <p className='text-sm'>
                  {updatedAt?.toLocaleDateString('nb-NO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div>
                <p className='text-sm font-medium text-muted-foreground'>Status</p>
                <p className={`text-sm font-medium ${applicationStatus.className}`}>
                  {applicationStatus.text}
                </p>
              </div>

              {/* Review Controls */}
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Vurdering</p>
                <div className='flex gap-2'>
                  {[
                    { value: 'THUMBS_DOWN', icon: ThumbsDown },
                    { value: 'THUMBS_UP', icon: ThumbsUp },
                    { value: 'STAR', icon: Star },
                  ].map(({ value, icon: Icon }) => {
                    const reviewValue = value as ReviewStatus;

                    return (
                      <Button
                        key={value}
                        size='sm'
                        variant={currentUserStatus === reviewValue ? 'default' : 'outline'}
                        onClick={() => handleReviewClick(reviewValue)}
                        disabled={isSubmitting}
                        className='h-8 w-8 p-0 disabled:cursor-not-allowed'
                      >
                        <Icon className='h-4 w-4' />
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ApplicationDetailsCard;
