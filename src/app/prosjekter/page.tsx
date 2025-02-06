import CreateTaskForm from "@/components/tasks/create-task-form";
import TaskList from "@/components/tasks/task-list";

const Page = () => {
  return (
    <div >
      <TaskList tasks={[]} />
      <CreateTaskForm />
    </div>
  )
}

export default Page;