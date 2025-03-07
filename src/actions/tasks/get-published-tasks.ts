'use server';
import { db } from '@/lib/prisma';

export const getPublishedTasks = async () => {
  try {
    const tasks = await db.task
      .findMany({
        where: {
          published: true,
        },
        omit: {
          updatedAt: true,
          createdAt: true,
          published: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      })
      .catch((err) => {
        console.error('Database query failed:', err);
        return [];
      });

    return tasks;
  } catch (error) {
    console.error('Database error:', error);
    // Return empty array instead of failing
    return [];
  }
};
