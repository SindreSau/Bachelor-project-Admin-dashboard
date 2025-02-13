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
    <div className='my-6 rounded-lg border bg-card px-6 py-6 text-card-foreground shadow-sm'>
      <h2 className='mb-4 text-xl font-bold'>Oppgaveliste</h2>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className='flex w-full'>
              <TaskCard task={task} />
            </div>
          ))
        ) : (
          <p className='text-muted-foreground'>Ingen oppgaver å vise.</p>
        )}
      </div>
    </div>
  );
};

export default TaskList;
