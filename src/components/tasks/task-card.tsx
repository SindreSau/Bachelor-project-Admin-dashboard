'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Calendar, Pencil, Users, Globe, Hourglass, UserPlus, UserMinus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task } from '@prisma/client';
import ConfirmDeleteModal from './confirm-delete-modal';
import ConfirmPublishModal from './confirm-publish-modal';
import Link from 'next/link';

export type TaskWithApplicationCount = Task & {
  _count?: {
    applications: number;
  };
};

const TaskCard = ({ task }: { task: TaskWithApplicationCount }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('no-NO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Card
      className={`flex h-full w-full grow flex-col ${task.published ? 'border-primary border' : ''}`}
    >
      <CardHeader className='pb-4'>
        <div className='flex items-start justify-between gap-4'>
          <CardTitle className='text-xl'>{task.taskName}</CardTitle>
          <div className='flex shrink-0 gap-2'>
            <Link
              href={`/prosjekter/rediger/${task.id}`}
              className='border-input bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-ring inline-flex h-8 w-8 items-center justify-center rounded-md border p-0 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'
            >
              <Pencil className='h-4 w-4' />
            </Link>
            <ConfirmDeleteModal taskId={task.id} />
          </div>
        </div>
      </CardHeader>

      <CardContent className='grow'>
        <ScrollArea className=''>
          {task.taskDescription ? (
            <div
              className='text-muted-foreground prose prose-sm max-w-none space-y-4 text-sm'
              dangerouslySetInnerHTML={{ __html: task.taskDescription }}
            />
          ) : (
            <CardDescription className='text-sm'>Ingen beskrivelse</CardDescription>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className='mt-auto flex flex-wrap items-center justify-between gap-4 border-t pt-4'>
        <div className='text-muted-foreground flex flex-wrap gap-4 text-sm'>
          <div className='flex items-center gap-1 whitespace-nowrap'>
            <Calendar className='h-3 w-3' />
            <span>Sist endret: {formatDate(task.updatedAt)}</span>
          </div>
          <div className='flex items-center gap-1 whitespace-nowrap'>
            <Users className='h-3 w-3' />
            <span>Søknader: {task._count?.applications || 0}</span>
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
              Søknadsfrist: {task.deadline ? formatDate(new Date(task.deadline)) : 'Ingen frist'}
            </span>
          </div>
        </div>

        <ConfirmPublishModal task={task} />
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
