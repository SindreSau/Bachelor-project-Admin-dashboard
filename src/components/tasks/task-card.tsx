'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Calendar,
  Pencil,
  Users,
  Globe,
  Hourglass,
  UserPlus,
  UserMinus,
  Trash2,
  ArchiveRestore,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task } from '@prisma/client';
import ConfirmActionModal from './confirm-action-modal';
import Link from 'next/link';
import { toast } from 'sonner';
import { deleteTask } from '@/actions/tasks/delete-task';
import { restoreTask } from '@/actions/tasks/restore-task';
import { changePublishStatus } from '@/actions/tasks/change-publish-status';
import { Button } from '../ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

export type TaskWithApplicationCount = Task & {
  _count?: {
    applications: number;
  };
};

const taskCardVariants = cva('flex h-full w-full grow flex-col', {
  variants: {
    variant: {
      default: '',
      bin: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface TaskCardProps {
  task: TaskWithApplicationCount;
  variant?: 'default' | 'bin';
}

const TaskCard = ({ task, variant = 'default' }: TaskCardProps) => {
  const [isPublishing, setIsPublishing] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('no-NO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const hasApplications = (task._count?.applications || 0) > 0;

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

  const handleDelete = async () => {
    try {
      const result = await deleteTask(task.id);
      if (result.success) {
        toast('Oppgave slettet', {
          duration: 10000,
          action: {
            label: 'Angre',
            onClick: () => {
              // Call the handler instead of directly calling the server action
              handleRestore(task.id);
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
    }
  };

  const handlePublishTask = async () => {
    try {
      setIsPublishing(true);
      const result = await changePublishStatus(task.id, !task.published);
      if (result.success) {
        toast.success(`Oppgave ${task.published ? 'avpublisert' : 'publisert'}`);
      } else {
        toast.error('Kunne ikke endre publiseringsstatus');
        console.error(result.error);
      }
    } catch (err) {
      toast.error('Kunne ikke endre publiseringsstatus');
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Card
      className={cn(
        taskCardVariants({ variant }),
        variant === 'default' && task.published && 'border-confirm/50 border'
      )}
    >
      <CardHeader className='pb-4'>
        <div className='flex items-start justify-between gap-4'>
          <CardTitle className='text-xl'>{task.taskName}</CardTitle>
          <div className='flex shrink-0 gap-2'>
            {variant === 'bin' ? (
              <Button
                variant='default'
                size='sm'
                className='cursor-pointer'
                onClick={() => handleRestore(task.id)}
                title='Gjenopprett'
                aria-label='Gjenopprett oppgave'
              >
                Gjenopprett
                <ArchiveRestore className='ml-2 h-4 w-4' />
              </Button>
            ) : (
              <>
                <Link
                  href={`/oppgaver/rediger/${task.id}`}
                  className='border-input bg-muted hover:bg-muted/80 focus:ring-ring inline-flex h-8 w-8 items-center justify-center rounded-md border p-0 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
                >
                  <Pencil className='text-muted-foreground h-4 w-4' />
                </Link>
                <ConfirmActionModal
                  onAction={handleDelete}
                  description='Er du sikker på at du vil slette oppgaven?'
                  title='Slett oppgave'
                  confirmText='Slett'
                  cancelText='Avbryt'
                  trigger={
                    <Button
                      variant='destructive'
                      size='sm'
                      className='border-destructive bg-destructive/80 hover:bg-destructive/60 disabled:bg-destructive/20 h-8 w-8 border'
                    >
                      <Trash2 className='text-destructive-foreground' />
                    </Button>
                  }
                  warning={
                    hasApplications && (
                      <div className='border-destructive text-foreground bg-destructive/10 my-3 border p-2 text-sm'>
                        Dette vil slette oppgaven og alle tilknyttede søknader. Dette kan ikke
                        angres.
                      </div>
                    )
                  }
                  actionButtonClassName='bg-destructive/80 hover:bg-destructive/60 disabled:bg-destructive/20 inline-flex items-center disabled:cursor-not-allowed'
                />
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className='grow'>
        <ScrollArea className=''>
          {task.taskDescription ? (
            <div
              className='prose text-sm whitespace-pre-wrap'
              dangerouslySetInnerHTML={{ __html: task.taskDescription }}
            />
          ) : (
            <CardDescription className='text-sm'>Ingen beskrivelse</CardDescription>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className='mt-auto flex flex-wrap items-center justify-between gap-4 border-t pt-4'>
        <div className='text-muted-foreground flex flex-wrap gap-4 text-sm'>
          {variant === 'bin' ? (
            <>
              <div className='flex items-center gap-1 whitespace-nowrap'>
                <Calendar className='h-3 w-3' />
                <span>Opprettet: {formatDate(task.createdAt)}</span>
              </div>
              <div className='flex items-center gap-1 whitespace-nowrap'>
                <Globe className='h-3 w-3' />
                <span>
                  Slettet på: {task.deletedAt ? formatDate(task.deletedAt) : 'Ingen dato'}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className='flex items-center gap-1 whitespace-nowrap'>
                <Calendar className='h-3 w-3' />
                <span>Sist endret: {formatDate(task.updatedAt)}</span>
              </div>
              <div className='flex flex-wrap gap-4'>
                <div className='flex items-center gap-1 whitespace-nowrap'>
                  <UserMinus className='h-3 w-3' />
                  <span>Min. studenter: {task.minStudents || 3}</span>
                </div>
                <div className='flex items-center gap-1 whitespace-nowrap'>
                  <UserPlus className='h-3 w-3' />
                  <span>Maks studenter: {task.maxStudents || 5}</span>
                </div>
              </div>
              <div className='flex items-center gap-1 whitespace-nowrap'>
                <Globe className='h-3 w-3' />
                <span>Status: {task.published ? 'Publisert' : 'Upublisert'}</span>
              </div>
              <div className='flex items-center gap-1 whitespace-nowrap'>
                <Hourglass className='h-3 w-3' />
                <span>
                  Søknadsfrist:{' '}
                  {task.deadline ? formatDate(new Date(task.deadline)) : 'Ingen frist'}
                </span>
              </div>
            </>
          )}
          <div className='flex items-center gap-1 whitespace-nowrap'>
            <Users className='h-3 w-3' />
            <span>Søknader: {task._count?.applications || 0}</span>
          </div>
        </div>

        {variant === 'default' && (
          <ConfirmActionModal
            onAction={handlePublishTask}
            trigger={
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
            }
            title={task.published ? 'Avpubliser oppgave' : 'Publiser oppgave'}
            description={
              task.published
                ? 'Dette vil skjule oppgaven fra søknadsportalen'
                : 'Dette vil gjøre oppgaven synlig på søknadsportalen. Vil du fortsette?'
            }
            confirmText={task.published ? 'Avpubliser' : 'Publiser'}
            cancelText='Avbryt'
            actionButtonClassName={
              task.published
                ? 'bg-info/80 hover:bg-info/70 disabled:bg-info/40 text-primary-foreground hover:text-primary-foreground inline-flex items-center disabled:cursor-not-allowed'
                : 'bg-confirm/70 hover:bg-confirm/50 disabled:bg-confirm/40 inline-flex items-center disabled:cursor-not-allowed'
            }
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
