'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Application, Task } from '@prisma/client';
import { Button } from '../ui/button';
import { Calendar, Pencil, Trash2, Users, Globe } from 'lucide-react';
import { deleteTask } from '@/actions/tasks/delete-task';
import { useRouter } from 'next/navigation';
import { changePublishStatus } from '@/actions/tasks/change-publish-status';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

type TaskWithApplications = Task & { applications: Application[]; deadline?: Date };

const TaskCard = ({ task }: { task: TaskWithApplications }) => {
  const handleDelete = async (id: number) => {
    await deleteTask(id);
  };

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
    <Card className='relative h-full'>
      <div className='absolute right-2 top-2 flex space-x-2'>
        <Button
          onClick={() => handleEditClick(task.id)}
          className='bg-action px-2 py-1 hover:bg-action-hover'
        >
          <Pencil />
        </Button>
        <Button
          onClick={() => handleDelete(task.id)}
          className='bg-danger px-2 py-1 hover:bg-danger-hover'
        >
          <Trash2 />
        </Button>
      </div>
      <CardHeader>
        <CardTitle>{task.taskName}</CardTitle>
    <Card className='relative flex h-full flex-col'>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between gap-4'>
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
            <Button
              onClick={() => handleDelete(task.id)}
              variant='destructive'
              size='sm'
              className='h-8 w-8 p-0'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className='max-h-10 flex-grow overflow-y-scroll'>
        <ScrollArea>
          <CardDescription className='whitespace-pre-wrap text-sm'>
            {task.taskDescription}
          </CardDescription>
        </ScrollArea>
      </CardContent>
      <CardFooter className='flex flex-col items-start space-y-2'>
        <p className='text-muted-foreground'>
          Opprettet:{' '}
          {task.createdAt.toLocaleDateString('no-NO', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <p className='text-muted-foreground'>
          Oppdatert:{' '}
          {task.updatedAt.toLocaleDateString('no-NO', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </p>
        <p className='text-muted-foreground'>
          Søknadsfrist:{' '}
          {task.deadline
            ? task.deadline.toLocaleDateString('no-NO', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })
            : 'Ingen frist'}
        </p>
        <p className='text-muted-foreground'>Antall søknader: {task.applications.length}</p>
        <p className='text-muted-foreground'>Publisert: {task.published ? 'Ja' : 'Nei'}</p>
        <div className='flex w-full justify-end'>
          <Button onClick={() => changePublishStatus(task)} className=''>
            {task.published ? 'Avpubliser' : 'Publiser'}
          </Button>

      <CardFooter className='mt-auto flex items-center justify-between gap-4 border-t pt-4'>
        <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
          <div className='flex items-center gap-1 whitespace-nowrap'>
            <Calendar className='h-3 w-3' />
            <span>Opprettet: {formatDate(task.createdAt)}</span>
          </div>
          <div className='flex items-center gap-1 whitespace-nowrap'>
            <Calendar className='h-3 w-3' />
            <span>Oppdatert: {formatDate(task.updatedAt)}</span>
          </div>
          <div className='flex items-center gap-1 whitespace-nowrap'>
            <Users className='h-3 w-3' />
            <span>Søknader: {task.applications.length}</span>
          </div>
          <div className='flex items-center gap-1 whitespace-nowrap'>
            <Globe className='h-3 w-3' />
            <span>Status: {task.published ? 'Publisert' : 'Upublisert'}</span>
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
