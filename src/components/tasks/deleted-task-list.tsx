import { getUnpublishedTasks } from '@/actions/tasks/get-tasks';
import TaskCard from './task-card';

const UnpublishedTasks = async () => {
  const tasks = await getUnpublishedTasks();

  // Filter for only unpublished tasks
  const unpublishedTasks = tasks.filter((task) => !task.published);

  return (
    <div className='bg-card rounded-lg border p-6 shadow-xs'>
      <h2 className='mb-4 text-xl font-bold'>Upubliserte Oppgaver</h2>
      <div className='grid gap-4 sm:grid-cols-1 lg:grid-cols-1'>
        {unpublishedTasks.length > 0 ? (
          unpublishedTasks.map((task) => (
            <div key={task.id} className='w-full'>
              <TaskCard task={task} />
            </div>
          ))
        ) : (
          <p className='text-muted-foreground py-4 text-center'>
            Ingen upubliserte oppgaver å vise.
          </p>
        )}
      </div>
    </div>
  );
};

export default UnpublishedTasks;
