'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Review } from '@prisma/client';
import setApplicationStatus from '@/utils/applications/set-application-status';
import ReviewControls from './review-controls';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import StatusBadge from '@/components/table/status-badge';
import { STATUS_OPTIONS } from '@/lib/constants';
import { MoreHorizontal } from 'lucide-react';
import ConfirmActionModal from '@/components/tasks/confirm-action-modal';
import { deleteApplication } from '@/actions/applications/delete-application';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ApplicationDetailsCardProps {
  applicationId: number;
  groupName: string;
  school: string | null;
  createdAt: Date;
  updatedAt: Date;
  applicationReviews: Review[];
  applicationStatus: string;
  onApplicationDeleted?: () => void;
}

const ApplicationDetailsCard = ({
  applicationId,
  groupName,
  school,
  createdAt,
  updatedAt,
  applicationReviews,
  applicationStatus: initialStatus,
  onApplicationDeleted,
}: ApplicationDetailsCardProps) => {
  const [applicationStatus, setApplicationStatusState] = useState(initialStatus);
  const [isOpen, setIsOpen] = useState(false);
  const [, setIsDeleteDialogOpen] = useState(false);
  const [, setIsDeleting] = useState(false);
  const router = useRouter();

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
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteApplication(applicationId);
      if (result.success) {
        toast.success('Søknad slettet', {
          description: `Søknaden til ${groupName} er slettet.`,
        });

        if (onApplicationDeleted) {
          onApplicationDeleted();
        }

        // Redirect to the applications page
        router.push('/');
      } else {
        throw new Error(result.error) || 'Failed to delete application';
      }
    } catch (error) {
      console.error('Failed to delete application:', error);
      toast.error('Noe gikk galt.', {
        description: 'Kunne ikke slette søknaden. Prøv igjen senere.',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
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
      onClick: () => {},
    },
  ];

  return (
    <>
      <Card>
        <CardContent>
          {/* Info Section - 2 columns on mobile, 3 on larger screens */}
          <div className='flex flex-row items-center justify-between pt-6'>
            <div className='grid flex-grow grid-cols-2 items-center gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6'>
              {infoItems.map((item) => (
                <div key={item.id}>
                  <p className='text-muted-foreground text-sm font-medium'>{item.label}</p>
                  {item.onClick ? (
                    <div className='flex items-center'>
                      <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
                        <DropdownMenuTrigger asChild>
                          <div className='cursor-pointer'>
                            <StatusBadge status={item.value} icon={isOpen ? 'close' : 'open'} />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Endre status</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {Object.entries(STATUS_OPTIONS).map(([key, status]) => (
                            <DropdownMenuItem
                              key={key}
                              onClick={() => handleStatusChange(status.value)}
                            >
                              {status.value}
                            </DropdownMenuItem>
                          ))}
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
                applicationStatus={applicationStatus}
                readOnly={false}
                onStatusChange={(newStatus) => {
                  setApplicationStatusState(newStatus);
                }}
              />
            </div>

            {/* Delete Application Button */}
            <div className='flex justify-end'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className='hover:text-primary cursor-pointer rounded-full p-2'>
                    <MoreHorizontal className='h-5 w-5' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Handlinger</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <ConfirmActionModal
                    onAction={handleDeleteConfirm}
                    title='Slett søknad'
                    description={`Er du helt sikker på at du vil slette søknaden til ${groupName}? No backsies!`}
                    confirmText='Slett'
                    cancelText='Avbryt'
                    actionButtonClassName='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    trigger={
                      <DropdownMenuItem
                        className='text-destructive-foreground hover:text-destructive-foreground bg-destructive/20 focus:text-destructive-foreground cursor-pointer'
                        onSelect={(e) => e.preventDefault()}
                      >
                        Slett søknad
                      </DropdownMenuItem>
                    }
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ApplicationDetailsCard;
