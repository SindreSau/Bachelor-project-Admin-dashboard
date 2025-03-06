'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Review } from '@prisma/client';
import { useState } from 'react';
import getApplicationStatus from '@/utils/applications/get-application-status';
import ReviewControls from './review-controls'; // Adjust path as needed

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
  applicationReviews: initialReviews,
}: ApplicationDetailsCardProps) => {
  // State to manage reviews and allow for local updates
  const [applicationReviews, setApplicationReviews] = useState(initialReviews);

  // Optional callback to refresh reviews (e.g., fetch from server)
  // If you have a way to fetch updated reviews, you could implement it here
  const handleReviewUpdate = () => {
    // This is a simple approach that relies on the local state
    // In a real app, you might want to fetch fresh data from the server
    setApplicationReviews([...applicationReviews]);
  };

  const applicationStatus = getApplicationStatus(applicationReviews);

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

              {/* Review Controls Component */}
              <ReviewControls
                applicationId={applicationId}
                applicationReviews={applicationReviews}
                onReviewUpdate={handleReviewUpdate}
              />
            </div>
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ApplicationDetailsCard;
