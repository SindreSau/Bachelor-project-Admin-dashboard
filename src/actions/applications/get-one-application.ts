import { db } from '@/lib/prisma';

export async function getOneApplication(applicationId: number) {
  return await db.application.findUnique({
    where: { id: applicationId },
    include: {
      students: {
        include: {
          files: true,
        },
        orderBy: {
          firstName: 'asc',
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
}
