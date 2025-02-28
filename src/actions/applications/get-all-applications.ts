// actions/applications/get-all-applications.ts
'use server';
import { db } from '@/lib/prisma';

export default async function getAllApplications() {
  try {
    const applications = await db.application
      .findMany({
        include: {
          students: true,
          reviews: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      .catch((err) => {
        console.error('Database query failed:', err);
        return [];
      });

    return applications;
  } catch (error) {
    console.error('Database error:', error);
    // Return empty array instead of failing
    return [];
  }
}
