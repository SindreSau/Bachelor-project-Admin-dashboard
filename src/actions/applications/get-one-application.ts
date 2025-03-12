'use server';
import { db } from '@/lib/prisma';

export async function getOneApplication(applicationId: number) {
  const applicationWithUnsortedTasks = await db.application.findUnique({
    where: { id: applicationId },
    include: {
      students: {
        include: {
          files: true,
        },
      },
      studentRepresentative: true,
      reviews: true,
      tasks: true,
      comments: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  const taskPriorityIds = applicationWithUnsortedTasks?.taskpriorityids;
  const sortedTasks = applicationWithUnsortedTasks?.tasks.sort((a, b) => {
    if (!taskPriorityIds) return 0;
    return taskPriorityIds.indexOf(a.id) - taskPriorityIds.indexOf(b.id);
  });

  const applicationWithSortedTasks = {
    ...applicationWithUnsortedTasks,
    tasks: sortedTasks,
  };

  return applicationWithSortedTasks;
}
