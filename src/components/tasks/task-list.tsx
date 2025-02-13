import TaskCard from './task-card';
import { db } from '@/lib/prisma';

const TaskList = async () => {
  const tasks = await db.task.findMany({
    include: {
      applications: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className='rounded-lg border bg-card p-6 shadow-sm'>
      <h2 className='mb-6 text-2xl font-semibold'>Oppgaveliste</h2>
      <div className='grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1'>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className='w-full'>
              <TaskCard task={task} />
            </div>
          ))
        ) : (
          <p className='py-4 text-center text-muted-foreground'>Ingen oppgaver å vise.</p>
        )}
      </div>
    </div>
  );
};

export default TaskList;
