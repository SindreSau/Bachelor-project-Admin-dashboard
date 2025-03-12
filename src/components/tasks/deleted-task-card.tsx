'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import { Calendar, Users, Globe, ArchiveRestore } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task } from '@prisma/client';
import { restoreTask } from '@/actions/tasks/restore-task';

type TaskWithApplicationCount = Task & {
  _count?: {
    applications: number;
  };
};

const DeletedTaskCard = ({ task }: { task: TaskWithApplicationCount }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('no-NO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Card className={`flex h-full w-full grow flex-col`}>
      <CardHeader className='pb-4'>
        <div className='flex items-start justify-between gap-4'>
          <CardTitle className='text-xl'>{task.taskName}</CardTitle>
          <div className='flex shrink-0 gap-2'>
            <Button
              variant='default'
              size='sm'
              className='cursor-pointer'
              onClick={() => restoreTask(task.id)}
              title='Gjenopprett'
              aria-label='Gjenopprett oppgave'
            >
              Gjenopprett
              <ArchiveRestore className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className='grow'>
        <ScrollArea className=''>
          <CardDescription className='text-sm whitespace-pre-wrap'>
            {task.taskDescription}
          </CardDescription>
        </ScrollArea>
      </CardContent>

      <CardFooter className='mt-auto flex flex-wrap items-center justify-between gap-4 border-t pt-4'>
        <div className='text-muted-foreground flex flex-wrap gap-4 text-sm'>
          <div className='flex items-center gap-1 whitespace-nowrap'>
            <Calendar className='h-3 w-3' />
            <span>Opprettet: {formatDate(task.createdAt)}</span>
          </div>
          <div className='flex items-center gap-1 whitespace-nowrap'>
            <Globe className='h-3 w-3' />
            <span>Slettet på: {task.deletedAt ? formatDate(task.deletedAt) : 'Ingen dato'} </span>
          </div>
          <div className='flex items-center gap-1 whitespace-nowrap'>
            <Users className='h-3 w-3' />
            <span>Søknader: {task._count?.applications || 0}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DeletedTaskCard;
