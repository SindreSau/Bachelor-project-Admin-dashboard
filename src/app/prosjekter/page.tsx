import CreateTaskForm from '@/components/tasks/create-task-form';
import TaskList from '@/components/tasks/task-list';

export const dynamic = 'force-dynamic';

const Page = () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 gap-8 xl:grid-cols-2'>
        <TaskList />
        <CreateTaskForm />
      </div>
    </div>
  );
};

export default Page;
