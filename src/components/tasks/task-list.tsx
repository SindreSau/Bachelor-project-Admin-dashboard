import { TaskListProps } from "@/types/task";
import TaskCard from "./task-card";
import { prisma } from "@/lib/prisma";

const TaskList = async () => {

  const tasks = await prisma.task.findMany();

  return (
    <div className="rounded-lg border bg-card my-6 px-6 py-6 text-card-foreground shadow-sm">
      <h2 className="text-xl font-bold mb-4">Oppgaveliste</h2>
      <div className="flex space-x-4 overflow-x-auto">
        {tasks.length > 0 ? (
          tasks.map((task) => <TaskCard task={task} />)
        ) : (
          <p className="text-muted-foreground">Ingen oppgaver å vise.</p>
        )}
      </div>
    </div>
  );
};

export default TaskList;
