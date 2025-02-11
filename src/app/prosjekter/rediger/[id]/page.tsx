import EditTaskForm from '@/components/tasks/edit-task-form';
import React from 'react';
import { getTask } from '@/actions/tasks/get-task';
import { notFound } from 'next/navigation';

// Use the correct type from Next.js
type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const taskId = Number(id);

  if (isNaN(taskId)) {
    notFound();
  }
  const task = await getTask(taskId);

  if (!task) {
    notFound();
  }

  return <EditTaskForm task={task} />;
}
