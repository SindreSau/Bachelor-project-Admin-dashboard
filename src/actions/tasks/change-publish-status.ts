'use server';

import { db } from '@/lib/prisma';
import { Task } from '@prisma/client';
import { revalidatePath } from 'next/cache';

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

  revalidatePath('/prosjekter');
}
