import CreateTaskForm from "@/components/tasks/create-task-form";
import TaskCard from "@/components/tasks/task-card";
import TaskList from "@/components/tasks/task-list";

const Page = () => {
  return (
    <div>
      <TaskList />
      <CreateTaskForm />
    </div>
  )
}

export default Page;