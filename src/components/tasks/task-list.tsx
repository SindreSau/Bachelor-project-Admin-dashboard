import { getTasks } from '@/actions/tasks/get-tasks';
import TaskCard from './task-card';
import Link from 'next/link';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TaskList = async () => {
  const tasks = await getTasks();

  return (
    <div className='bg-card rounded-lg border p-6 shadow-xs'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-bold'>Publiserte oppgaver</h2>
        <Button asChild variant='outline' size='sm'>
          <Link href='/prosjekter/bin'>
            <Trash className='h-4 w-4' />
            Søppel
          </Link>
        </Button>
      </div>
      <div className='grid gap-4 sm:grid-cols-1 lg:grid-cols-1'>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className='w-full'>
              <TaskCard task={task} />
            </div>
          ))
        ) : (
          <p className='text-muted-foreground py-4 text-center'>Ingen oppgaver å vise.</p>
        )}
      </div>
    </div>
  );
};

export default TaskList;
