// import { TaskListProps } from '@/types/task';
import TaskCard from './task-card';
import { db } from '@/lib/prisma';

const TaskList = async () => {
  const tasks = await db.task.findMany({
    include: {
      applications: true,
    },
  });

  return (
    <div className='my-6 rounded-lg border bg-card px-6 py-6 text-card-foreground shadow-sm'>
      <h2 className='mb-4 text-xl font-bold'>Oppgaveliste</h2>
      <div className='sflex-wrap flex gap-4'>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className='min-w-[250px] flex-1'>
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
