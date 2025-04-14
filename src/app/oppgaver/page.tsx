import TaskForm from '@/components/tasks/task-form';
import TaskList from '@/components/tasks/task-list';
import { getTasks } from '@/actions/tasks/get-tasks';

export const dynamic = 'force-dynamic';

const Page = async () => {
  const tasks = await getTasks();
  const publishedTasks = tasks.filter((task) => task.published);
  const unpublishedTasks = tasks.filter((task) => task.published === false);

  return (
    <div className='space-y-6'>
      <TaskList tasks={publishedTasks} isUnpublishedTasks={false} />

      <TaskList tasks={unpublishedTasks} isUnpublishedTasks={true} />

      <TaskForm />
    </div>
  );
};

export default Page;
