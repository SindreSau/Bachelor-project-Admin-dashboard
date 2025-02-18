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

export default function ConfirmDeleteModal({ taskId }: { taskId: number }) {
  const handleDelete = async (taskId: number) => {
    await deleteTask(taskId);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant='destructive' size='sm' className='h-8 w-8 p-0'>
          <Trash2 className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Er du sikker?</DialogTitle>
          <DialogDescription>
            Dette vil slette oppgaven permanent. Denne handlingen kan ikke angres.
          </DialogDescription>
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
