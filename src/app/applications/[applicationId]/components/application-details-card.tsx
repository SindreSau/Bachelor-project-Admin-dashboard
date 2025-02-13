'use client';

import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Review, ReviewStatus } from '@prisma/client';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';
import { submitReview } from '@/actions/applications/submit-review';
import getApplicationStatus from '@/utils/applications/get-application-status';
import { cn } from '@/lib/utils';

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
      <CardHeader className='grid grid-cols-1 pb-2'>
        <CardTitle>Søknadsdetaljer</CardTitle>
      </CardHeader>
      <CardContent className='py-2'>
        <ScrollArea>
          <div className='grid grid-cols-6 gap-2'>
            <div className='space-y-0.5'>
              <p className='text-sm font-medium text-muted-foreground'>Gruppenavn</p>
              <p className='text-sm'>{groupName}</p>
            </div>
            <div className='space-y-0.5'>
              <p className='text-sm font-medium text-muted-foreground'>Skole</p>
              <p className='text-sm'>{school}</p>
            </div>
            <div className='space-y-0.5'>
              <p className='text-sm font-medium text-muted-foreground'>Søknadsdato</p>
              <p className='text-sm'>
                {createdAt?.toLocaleDateString('nb-NO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className='space-y-0.5'>
              <p className='text-sm font-medium text-muted-foreground'>Sist Oppdatert</p>
              <p className='text-sm'>
                {updatedAt?.toLocaleDateString('nb-NO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className='space-y-0.5'>
              <p className='text-sm font-medium text-muted-foreground'>Status</p>
              <p
                className={cn(
                  'text-sm font-medium ' + getApplicationStatus(applicationReviews).className
                )}
              >
                {getApplicationStatus(applicationReviews).text}
              </p>
            </div>
            <div className='space-y-0.5'>
              <p className='text-sm font-medium text-muted-foreground'>Vurdering</p>
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  variant={selectedReview === 'THUMBS_DOWN' ? 'default' : 'outline'}
                  onClick={() => handleReviewClick('THUMBS_DOWN')}
                  disabled={isSubmitting}
                  className='h-8 px-2'
                >
                  <ThumbsDown className='h-4 w-4' />
                </Button>
                <Button
                  size='sm'
                  variant={selectedReview === 'THUMBS_UP' ? 'default' : 'outline'}
                  onClick={() => handleReviewClick('THUMBS_UP')}
                  disabled={isSubmitting}
                  className='h-8 px-2'
                >
                  <ThumbsUp className='h-4 w-4' />
                </Button>
                <Button
                  size='sm'
                  variant={selectedReview === 'STAR' ? 'default' : 'outline'}
                  onClick={() => handleReviewClick('STAR')}
                  disabled={isSubmitting}
                  className='h-8 px-2'
                >
                  <Star className='h-4 w-4' />
                </Button>
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
