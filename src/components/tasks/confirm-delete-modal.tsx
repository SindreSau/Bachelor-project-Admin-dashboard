import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { deleteTask } from '@/actions/tasks/delete-task';
import { restoreTask } from '@/actions/tasks/restore-task';
import Spinner from '@/components/common/spinner';
import { toast } from 'sonner';

export default function ConfirmDeleteModal({
  taskId,
  hasApplications = false,
}: {
  taskId: number;
  hasApplications?: boolean;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Separated the restore functionality into its own handler
  const handleRestore = async (id: number) => {
    try {
      const result = await restoreTask(id);
      if (result.success) {
        toast.success('Oppgave gjenopprettet');
      } else {
        toast.error('Kunne ikke gjenopprette oppgave');
        console.error(result.error);
      }
    } catch (err) {
      toast.error('Kunne ikke gjenopprette oppgave');
      console.error(err);
    }
  };

  const handleDelete = async (taskId: number) => {
    setIsDeleting(true);
    try {
      const result = await deleteTask(taskId);
      if (result.success) {
        toast('Oppgave slettet', {
          duration: 10000,
          action: {
            label: 'Angre',
            onClick: () => {
              // Call the handler instead of directly calling the server action
              handleRestore(taskId);
              console.log('Angre slett oppgave');
            },
          },
        });
      } else {
        toast.error('Kunne ikke slette oppgave');
        console.error(result.error);
      }
    } catch (err) {
      toast.error('Kunne ikke slette oppgave');
      console.error(err);
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span>
          <Button variant='destructive' size='sm' className='h-8 w-8 p-0'>
            <Trash2 className='h-4 w-4' />
          </Button>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Er du sikker?</DialogTitle>
          <DialogDescription>Dette vil slette oppgaven permanent.</DialogDescription>
          {hasApplications && (
            <div className='mt-4 rounded border border-red-500 bg-red-100 p-2 text-sm text-red-700'>
              Advarsel: Denne oppgaven tilhører én eller flere søknader.
            </div>
          )}
        </DialogHeader>
        <DialogFooter className='sm:justify-start'>
          <Button
            onClick={() => handleDelete(taskId)}
            variant='destructive'
            size='sm'
            disabled={isDeleting}
            className='inline-flex items-center disabled:cursor-not-allowed'
          >
            {isDeleting ? (
              <>
                <Spinner size='xs' className='mr-2' />
                <span>Sletter...</span>
              </>
            ) : (
              'Slett'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
