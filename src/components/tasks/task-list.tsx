import { TaskListProps } from "@/types/task";
import TaskCard from "./task-card";

const TaskList = ({ tasks = [] }: TaskListProps) => {
  return (
    <div className="rounded-lg border bg-card my-6 px-6 py-6 text-card-foreground shadow-sm">
      <h2 className="text-xl font-bold mb-4">Oppgaveliste</h2>
      {tasks.length > 0 ? (
        tasks.map((task) => <TaskCard task={task} />)
      ) : (
        <p className="text-muted-foreground">Ingen oppgaver å vise.</p>
      )}
    </div>
  );
};

export default TaskList;
