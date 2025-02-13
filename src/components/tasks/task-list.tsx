import { getTasks } from '@/actions/tasks/get-tasks';
import TaskCard from './task-card';

const TaskList = async () => {
  const tasks = await getTasks();

  return (
    <div className='flex flex-col rounded-lg border px-6 py-6'>
      <h2 className='mb-4 text-xl font-bold'>Oppgaveliste</h2>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className='flex-1'>
              <TaskCard task={task} />
            </div>
          ))
        ) : (
          <div className='flex flex-1 items-center justify-center'>
            <p className='text-center text-muted-foreground'>Ingen oppgaver å vise.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
