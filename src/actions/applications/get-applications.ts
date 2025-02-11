'use server';
import { db } from '@/lib/prisma';

export default async function getAllApplicationsForTableView() {
  try {
    const applications = await db.application.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return applications;
  } catch {
    throw new Error('Failed to fetch applications');
  }
}
