import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { useState } from 'react';
import { changePublishStatus } from '@/actions/tasks/change-publish-status';
import Spinner from '../common/spinner';
import { TaskWithApplicationCount } from './task-card';
import { cn } from '@/lib/utils';

export default function ConfirmPublishModal({ task }: { task: TaskWithApplicationCount }) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePublishStatus = async () => {
    setIsPublishing(true);
    try {
      await changePublishStatus(task.id, !task.published);
      setDialogOpen(false);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <span>
          <Button
            variant={task.published ? 'outline' : 'default'}
            size='sm'
            disabled={isPublishing}
            className={cn(
              'bg shrink-0',
              task.published
                ? 'bg-info/80 hover:bg-info/70 disabled:bg-info/40 text-primary-foreground hover:text-primary-foreground'
                : 'bg-confirm/80 hover:bg-confirm/50 disabled:bg-confirm/40'
            )}
          >
            {isPublishing ? (
              <span className='flex items-center gap-2'>
                <div className='h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent' />
                Laster...
              </span>
            ) : task.published ? (
              'Avpubliser'
            ) : (
              'Publiser'
            )}
          </Button>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task.published ? 'Avpubliser oppgave' : 'Publiser oppgave'}</DialogTitle>
          <DialogDescription>
            {task.published
              ? 'Dette vil skjule oppgaven fra søknadsportalen, men den vil fortsatt være tilgjengelig her. Vil du fortsette?'
              : 'Dette vil gjøre oppgaven synlig på søknadsportalen. Vil du fortsette?'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='sm:justify-start'>
          <Button
            onClick={handlePublishStatus}
            variant={task.published ? 'outline' : 'default'}
            size='sm'
            disabled={isPublishing}
            className={cn(
              'inline-flex items-center disabled:cursor-not-allowed',
              task.published
                ? 'bg-info/80 hover:bg-info/70 disabled:bg-info/40 text-primary-foreground hover:text-primary-foreground'
                : 'bg-confirm/70 hover:bg-confirm/50 disabled:bg-confirm/40'
            )}
          >
            {isPublishing ? (
              <>
                <Spinner size='xs' className='mr-2' />
                <span>{task.published ? 'Avpubliserer...' : 'Publiserer...'}</span>
              </>
            ) : task.published ? (
              'Avpubliser'
            ) : (
              'Publiser'
            )}
          </Button>
          <Button
            variant='ghost'
            className='hover:bg-muted/80 border'
            size='sm'
            onClick={() => setDialogOpen(false)}
          >
            Avbryt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
