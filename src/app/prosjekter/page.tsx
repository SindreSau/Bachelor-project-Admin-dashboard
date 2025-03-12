import CreateTaskForm from '@/components/tasks/create-task-form';
import TaskList from '@/components/tasks/task-list';
import UnpublishedTasks from '@/components/tasks/deleted-task-list';

export const dynamic = 'force-dynamic';

const Page = () => {
  return (
    <div className='space-y-6'>
      {/* Task lists side by side with responsive layout */}
      <TaskList />
      <UnpublishedTasks />

      {/* {/* Create task form below both lists */}
      <CreateTaskForm />
    </div>
  );
};

export default Page;
