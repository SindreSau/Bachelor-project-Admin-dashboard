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
import { Calendar, Pencil, Users, Globe, Hourglass } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { changePublishStatus } from '@/actions/tasks/change-publish-status';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { Task } from '@prisma/client';
import ConfirmDeleteModal from './confirm-delete-modal';

type TaskWithApplicationCount = Task & {
  _count?: {
    applications: number;
  };
};

const TaskCard = ({ task }: { task: TaskWithApplicationCount }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();

  const handleEditClick = (id: number) => {
    router.push(`/prosjekter/rediger/${id}`);
  };

  const handlePublishStatus = async (task: Task) => {
    setIsPublishing(true);
    try {
      await changePublishStatus(task);
    } finally {
      setIsPublishing(false);
    }
  };

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
            <Button
              onClick={() => handleEditClick(task.id)}
              variant='secondary'
              size='sm'
              className='h-8 w-8 p-0'
            >
              <Pencil className='h-4 w-4' />
            </Button>
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
          <div className='flex items-center gap-1 whitespace-nowrap'>
            <Globe className='h-3 w-3' />
            <span>Status: {task.published ? 'Publisert' : 'Upublisert'}</span>
          </div>
          <div className='flex items-center gap-1 whitespace-nowrap'>
            <Hourglass className='h-3 w-3' />
            <span>Søknadsfrist: {task.deadline ? formatDate(task.deadline) : 'Ingen frist'}</span>
          </div>
        </div>

        <Button
          onClick={() => handlePublishStatus(task)}
          variant={task.published ? 'outline' : 'default'}
          size='sm'
          disabled={isPublishing}
          className='shrink-0'
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
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
