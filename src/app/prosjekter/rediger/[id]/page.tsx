import EditTaskForm from '@/components/tasks/edit-task-form';
import React from 'react';
import { getTask } from '@/actions/tasks/get-task';

export default async function Page({ params }: { params: { id: string } }) {
  console.log('params.taskId:', params.id); // Debugging output
  const taskId = Number(params.id);
  console.log('Converted taskId:', taskId); // Debugging output

  if (!taskId || isNaN(taskId)) {
    return <div>Invalid task ID</div>;
  }

  const task = await getTask(taskId);

  if (!task) {
    return <div>Task not found</div>;
  }

  return <EditTaskForm task={task} />;
}
