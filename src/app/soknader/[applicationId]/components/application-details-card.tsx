'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Review } from '@prisma/client';
import getApplicationStatus from '@/utils/applications/get-application-status';
import setApplicationStatus from '@/utils/applications/set-application-status';
import ReviewControls from './review-controls';
import { Button } from '@/components/ui/button';
import { ArrowDown, Edit, Pencil } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface ApplicationDetailsCardProps {
  applicationId: number;
  groupName: string;
  school: string | null;
  createdAt: Date;
  updatedAt: Date;
  applicationReviews: Review[];
  applicationStatus: string;
}

const ApplicationDetailsCard = ({
  applicationId,
  groupName,
  school,
  createdAt,
  updatedAt,
  applicationReviews,
  applicationStatus: initialStatus,
}: ApplicationDetailsCardProps) => {
  const [applicationStatus, setApplicationStatusState] = useState(initialStatus);

  // Format date with a reusable function
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('nb-NO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await setApplicationStatus(applicationId, newStatus); // Update status in the database
      setApplicationStatusState(newStatus); // Update local state to reflect the change
      console.log(`Status updated to: ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Define info items to reduce JSX repetition
  const infoItems = [
    { id: 'group', label: 'Gruppenavn', value: groupName },
    { id: 'school', label: 'Skole', value: school || '-' },
    { id: 'created', label: 'Søknadsdato', value: formatDate(createdAt) },
    { id: 'updated', label: 'Sist Oppdatert', value: formatDate(updatedAt) },
    {
      id: 'status',
      label: 'Status',
      value: applicationStatus,
      onClick: () => console.log('clicked'),
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
                  {item.onClick ? (
                    <div className='flex items-center'>
                      <p className={`text-sm`}>{item.value}</p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='sm' className='h-8 w-8 cursor-pointer p-0'>
                            <Edit className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Endre status</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleStatusChange('Innkalt til intervju')}
                          >
                            Innkalt til intervju
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange('Intervju gjennomført')}
                          >
                            Intervju gjennomført
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange('Tilbud gitt')}>
                            Tilbud gitt
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange('Takket nei')}>
                            Takket nei
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange('Avslag sendt')}>
                            Avslag sendt
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <p className={`text-sm`}>{item.value}</p>
                  )}
                </div>
              ))}

              {/* Review Component */}
              <ReviewControls
                applicationId={applicationId}
                applicationReviews={applicationReviews}
                readOnly={false}
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
