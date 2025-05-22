'use client';
import TaskCard from './task-card';
import Link from 'next/link';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskWithApplicationCount } from './task-card';
import autoAnimate from '@formkit/auto-animate';
import { useEffect, useRef } from 'react';

interface TaskListProps {
  tasks: TaskWithApplicationCount[];
  isUnpublishedTasks?: boolean;
}

const TaskList = ({ tasks, isUnpublishedTasks = false }: TaskListProps) => {
  // Use autoAnimate for smooth animations
  const tasksContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tasksContainerRef.current) {
      autoAnimate(tasksContainerRef.current);
    }
  }, []);

  const title = isUnpublishedTasks ? 'Upubliserte oppgaver' : 'Publiserte oppgaver';

  return (
    <div className='bg-card rounded-lg border p-6 shadow-xs'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-bold'>{title}</h2>
        {!isUnpublishedTasks && (
          <Button asChild variant='outline' size='sm'>
            <Link href='/oppgaver/bin'>
              <Trash className='mr-2 h-4 w-4' />
              Søppel
            </Link>
          </Button>
        )}
      </div>
      {/* Apply the ref to the container that directly contains the changing elements */}
      <div ref={tasksContainerRef} className='grid gap-4 sm:grid-cols-1 lg:grid-cols-1'>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className='w-full'>
              <TaskCard task={task} />
            </div>
          ))
        ) : (
          <p className='text-muted-foreground py-4 text-center'>
            {isUnpublishedTasks ? 'Ingen upubliserte oppgaver å vise.' : 'Ingen oppgaver å vise.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskList;
