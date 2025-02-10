'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Task } from '@/types/task';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { deleteTask } from '@/actions/tasks/delete-task';

const TaskCard = ({ task }: { task: Task }) => {
  const handleDelete = async (id: number) => {
    await deleteTask(id);
  };

  return (
    <Card className='relative h-full'>
      <Button
        onClick={() => handleDelete(task.id)}
        className='absolute right-2 top-2 bg-red-600 px-2 py-1 hover:bg-red-700'
      >
        <Trash2 />
      </Button>
      <CardHeader>
        <CardTitle>{task.taskName}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className='whitespace-pre-wrap'>{task.taskDescription}</CardDescription>
      </CardContent>
      <CardFooter className='flex flex-col items-start space-y-2'>
        <p className='text-muted-foreground'>Opprettet: {task.createdAt.toLocaleDateString()}</p>
        <p className='text-muted-foreground'>Oppdatert: {task.updatedAt.toLocaleDateString()}</p>
        <p className='text-muted-foreground'>Antall søknader: {task.applications.length}</p>
        <p className='text-muted-foreground'>Publisert: {task.published ? 'Ja' : 'Nei'}</p>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
