'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface TaskInput {
  taskName: string;
  taskDescription: string;
  deadline: string | null;
  published?: boolean;
}

export async function createTask({ taskName, taskDescription, deadline }: TaskInput) {
  if (!taskName || !taskDescription) {
    throw new Error('Task name and description are required.');
  }

  await db.task.create({
    data: {
      taskName,
      taskDescription,
      deadline: deadline ? new Date(deadline) : null,
    },
  });

  revalidatePath('/prosjekter');
}
