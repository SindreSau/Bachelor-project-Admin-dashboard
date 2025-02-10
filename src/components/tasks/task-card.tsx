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
import { Pencil, Trash2 } from 'lucide-react';
import { deleteTask } from '@/actions/tasks/delete-task';
import { useRouter } from 'next/navigation';
import { changePublishStatus } from '@/actions/tasks/change-publish-status';

type TaskWithApplications = Task & { applications: Application[] };

const TaskCard = ({ task }: { task: TaskWithApplications }) => {
  const handleDelete = async (id: number) => {
    await deleteTask(id);
  };

  const router = useRouter();

  const handleEditClick = (id: number) => {
    router.push(`/prosjekter/rediger/${id}`);
  };

  return (
    <Card className='relative h-full'>
      <div className='absolute right-2 top-2 flex space-x-2'>
        <Button
          onClick={() => handleEditClick(task.id)}
          className='bg-blue-600 px-2 py-1 hover:bg-blue-700'
        >
          <Pencil />
        </Button>
        <Button
          onClick={() => handleDelete(task.id)}
          className='bg-red-600 px-2 py-1 hover:bg-red-700'
        >
          <Trash2 />
        </Button>
      </div>
      <CardHeader>
        <CardTitle>{task.taskName}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className='whitespace-pre-wrap'>{task.taskDescription}</CardDescription>
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
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
