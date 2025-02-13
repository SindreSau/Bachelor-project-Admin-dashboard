'use server';
import { db } from '@/lib/prisma';

export const getTasks = async () => {
  return await db.task.findMany({
    include: {
      applications: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};
