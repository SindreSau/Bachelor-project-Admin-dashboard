'use server';

import { db } from '@/lib/prisma';

export async function getTask(id: number) {
  return await db.task.findUnique({
    where: { id },
    include: { applications: true },
  });
}
