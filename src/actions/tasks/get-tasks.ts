'use server';
import { db } from '@/lib/prisma';

export const getTasks = async () => {
  try {
    const tasks = await db.task
      .findMany({
        include: {
          _count: {
            select: { applications: true },
          },
        },
        where: { deletedAt: null },
        orderBy: {
          createdAt: 'desc',
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
