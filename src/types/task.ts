import { Application } from '@prisma/client';

export type Task = {
  id: number;
  taskName: string;
  taskDescription: string | null;
  deadline?: Date;
  published: boolean;
  minStudents: number;
  maxStudents: number;
  createdAt: Date;
  updatedAt: Date;
  applications: Application[];
};

export type TaskListProps = {
  tasks: Task[];
};
