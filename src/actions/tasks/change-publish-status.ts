'use server';

import { db } from '@/lib/prisma';
import { Task } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import triggerRevalidation from './trigger-revalidate';

export async function changePublishStatus(task: Task) {
  const { id, published } = task;

  await db.task.update({
    where: {
      id,
    },
    data: {
      published: !published,
    },
  });

  // Trigger revalidation of the /prosjekter page in the application-app
  await triggerRevalidation();
  revalidatePath('/prosjekter');
}
