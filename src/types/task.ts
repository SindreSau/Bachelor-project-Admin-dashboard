export type Task = {
  taskName: string;
  taskDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskListProps = {
  tasks: Task[];
};