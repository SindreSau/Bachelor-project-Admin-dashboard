import CreateTaskForm from '@/components/tasks/create-task-form';
import TaskList from '@/components/tasks/task-list';

export const dynamic = 'force-dynamic';

const Page = () => {
  return (
    <div>
      <TaskList />
      <CreateTaskForm />
    </div>
  );
};

export default Page;
