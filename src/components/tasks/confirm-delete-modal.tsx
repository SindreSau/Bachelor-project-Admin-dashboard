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
import { useEffect, useState } from 'react';
import { getTask } from '@/actions/tasks/get-task';

export default function ConfirmDeleteModal({ taskId }: { taskId: number }) {
  const [hasApplications, setHasApplications] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      const task = await getTask(taskId);
      const result = (task?.applications?.length ?? 0) > 0;
      setHasApplications(result);
    };

    fetchTask();
  }, [taskId]);

  const handleDelete = async (taskId: number) => {
    await deleteTask(taskId);
  };

  return (
    <Dialog>
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
          <Button onClick={() => handleDelete(taskId)} variant='destructive' size='sm'>
            Slett
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
