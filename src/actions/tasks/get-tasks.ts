'use server';
import { db } from '@/lib/prisma';

// Get all published tasks
export const getTasks = async () => {
  try {
    const tasks = await db.task
      .findMany({
        include: {
          _count: {
            select: { applications: true },
          },
        },
        where: { deletedAt: null, published: true },
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

export const getUnpublishedTasks = async () => {
  try {
    const tasks = await db.task
      .findMany({
        include: {
          _count: {
            select: { applications: true },
          },
        },
        where: { deletedAt: null, published: false },
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

export const getDeletedTasks = async () => {
  try {
    const tasks = await db.task
      .findMany({
        include: {
          _count: {
            select: { applications: true },
          },
        },
        where: { deletedAt: { not: null } },
        orderBy: {
          createdAt: 'desc',
        },
      })
      .catch((err) => {
        console.error('Database query failed:', err);
        return [];
      });

    return tasks.length ? tasks : [];
  } catch (error) {
    console.error('Database error:', error);
    // Return empty array instead of failing
    return [];
  }
};
