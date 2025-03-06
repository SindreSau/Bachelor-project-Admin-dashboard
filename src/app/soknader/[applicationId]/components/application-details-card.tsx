'use client';

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Review } from '@prisma/client';
import getApplicationStatus from '@/utils/applications/get-application-status';
import ReviewControls from './review-controls';

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
  // Format date with a reusable function
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('nb-NO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Memoize application status to avoid recalculation
  const applicationStatus = useMemo(
    () => getApplicationStatus(applicationReviews),
    [applicationReviews]
  );

  // Define info items to reduce JSX repetition
  const infoItems = [
    { id: 'group', label: 'Gruppenavn', value: groupName },
    { id: 'school', label: 'Skole', value: school || '-' },
    { id: 'created', label: 'Søknadsdato', value: formatDate(createdAt) },
    { id: 'updated', label: 'Sist Oppdatert', value: formatDate(updatedAt) },
    {
      id: 'status',
      label: 'Status',
      value: applicationStatus.text,
      className: applicationStatus.className,
    },
  ];

  return (
    <Card>
      <CardContent>
        <ScrollArea>
          <div className='grid gap-4 pt-6 sm:gap-6'>
            {/* Info Section - 2 columns on mobile, 3 on larger screens */}
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
              {infoItems.map((item) => (
                <div key={item.id}>
                  <p className='text-muted-foreground text-sm font-medium'>{item.label}</p>
                  <p className={`text-sm ${item.className || ''}`}>{item.value}</p>
                </div>
              ))}

              {/* Review Component */}
              <ReviewControls
                applicationId={applicationId}
                applicationReviews={applicationReviews}
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
