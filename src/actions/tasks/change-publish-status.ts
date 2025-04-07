'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import triggerRevalidation from './trigger-revalidate';

// Changed to accept separate primitive values instead of a complex object
export async function changePublishStatus(taskId: number, newPublishedState: boolean) {
  await db.task.update({
    where: {
      id: taskId,
    },
    data: {
      published: newPublishedState,
    },
  });

  // Trigger revalidation of the /prosjekter page in the application-app
  await triggerRevalidation();
  revalidatePath('/prosjekter');
}
