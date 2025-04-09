import CreateTaskForm from '@/components/tasks/create-task-form';
import TaskList from '@/components/tasks/task-list';
import { getTasks } from '@/actions/tasks/get-tasks';

export const dynamic = 'force-dynamic';

const Page = async () => {
  const tasks = await getTasks();
  const publishedTasks = tasks.filter((task) => task.published);
  const unpublishedTasks = tasks.filter((task) => task.published === false);

  return (
    <div className='space-y-6'>
      {/* Published tasks list */}
      <TaskList tasks={publishedTasks} isUnpublishedTasks={false} />

      {/* Unpublished tasks list */}
      <TaskList tasks={unpublishedTasks} isUnpublishedTasks={true} />

      {/* Create task form below both lists */}
      <CreateTaskForm />
    </div>
  );
};

export default Page;
