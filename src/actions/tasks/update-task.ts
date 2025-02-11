'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateTask(id: number, data: { taskName: string; taskDescription: string }) {
  const { taskName, taskDescription } = data;

  await db.task.update({
    where: {
      id,
    },
    data: {
      taskName: taskName,
      taskDescription: taskDescription,
    },
  });

  revalidatePath('/prosjekter');
}
