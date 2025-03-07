'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import triggerRevalidation from './trigger-revalidate';

export async function deleteTask(id: number) {
  await db.task.delete({
    where: {
      id,
    },
  });

  // Trigger revalidation of the /prosjekter page in the application-app
  await triggerRevalidation();
  revalidatePath('/prosjekter');
}
