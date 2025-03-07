import { getTasks } from '@/actions/tasks/get-tasks';
import TaskCard from './task-card';

const TaskList = async () => {
  const tasks = await getTasks();

  return (
    <div className='bg-card rounded-lg border p-6 shadow-xs'>
      <h2 className='mb-4 text-xl font-bold'>Oppgaveliste</h2>
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
