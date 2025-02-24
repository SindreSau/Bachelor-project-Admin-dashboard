'use server';
import { db } from '@/lib/prisma';

export default async function getAllApplications() {
  try {
    const applications = await db.application.findMany({
      include: {
        students: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return applications;
  } catch {
    throw new Error('Failed to fetch applications');
  }
}
