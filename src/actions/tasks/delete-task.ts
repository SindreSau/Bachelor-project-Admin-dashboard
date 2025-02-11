'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteTask(id: number) {
  await db.task.delete({
    where: {
      id,
    },
  });

  revalidatePath('/prosjekter');
}
