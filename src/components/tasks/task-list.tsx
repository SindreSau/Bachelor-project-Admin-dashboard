import { getTasks } from '@/actions/tasks/get-tasks';
import TaskCard from './task-card';

const TaskList = async () => {
  const tasks = await getTasks();

  return (
    <div className='flex flex-col rounded-lg border bg-card px-6 py-6'>
      <h2 className='mb-4 text-xl font-bold'>Oppgaveliste</h2>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-flow-row'>
        {tasks.length > 0 ? (
          tasks.map((task) => <TaskCard task={task} key={task.id} />)
        ) : (
          <div className='col-span-full text-muted-foreground/70'>Ingen oppgaver tilgjengelig</div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
