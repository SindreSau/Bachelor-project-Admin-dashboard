'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Review, ReviewStatus } from '@prisma/client';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';
import { submitReview } from '@/actions/applications/submit-review';
import getApplicationStatus from '@/utils/applications/get-application-status';
// import { cn } from '@/lib/utils';

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

  // Find the current user's review if it exists
  const currentUserReview = applicationReviews.find((review) => review.userId === currentUserId);

  const [selectedReview, setSelectedReview] = useState<ReviewStatus | null>(
    currentUserReview?.review || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReviewClick = async (review: ReviewStatus) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await submitReview(applicationId, review, currentUserId);
      if (result.success) {
        setSelectedReview(review);
      } else {
        console.error('Failed to submit review:', result.error);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <p
                  className={`text-sm font-medium ${getApplicationStatus(applicationReviews).className}`}
                >
                  {getApplicationStatus(applicationReviews).text}
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
                  ].map(({ value, icon: Icon }) => (
                    <Button
                      key={value}
                      size='sm'
                      variant={selectedReview === value ? 'default' : 'outline'}
                      onClick={() => handleReviewClick(value as ReviewStatus)}
                      disabled={isSubmitting}
                      className='h-8 w-8 p-0'
                    >
                      <Icon className='h-4 w-4' />
                    </Button>
                  ))}
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
