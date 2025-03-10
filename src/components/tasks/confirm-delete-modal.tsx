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
import { useEffect } from 'react';
import { getTask } from '@/actions/tasks/get-task';
import Spinner from '@/components/common/spinner';

export default function ConfirmDeleteModal({ taskId }: { taskId: number }) {
  const [hasApplications, setHasApplications] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      if (isOpen) {
        const task = await getTask(taskId);
        const result = (task?.applications?.length ?? 0) > 0;
        setHasApplications(result);
      }
    };

    fetchTask();
  }, [taskId, isOpen]);

  const handleDelete = async (taskId: number) => {
    setIsDeleting(true);

    try {
      await deleteTask(taskId);
      setIsOpen(false);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
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
          <DialogDescription>
            Dette vil slette oppgaven permanent. Denne handlingen kan ikke angres.
          </DialogDescription>
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
