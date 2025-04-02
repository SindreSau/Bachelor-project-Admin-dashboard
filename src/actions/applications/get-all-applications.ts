'use server';

import { db } from '@/lib/prisma';
import { RequestLogger } from '@/lib/logger.server';
import { withAuthAndLog } from '@/lib/auth-and-log-wrapper';
import { Application, Student, Review } from '@prisma/client';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';

// Define return type for the function
type ApplicationWithRelations = Application & {
  students: Student[];
  reviews: Review[];
};

const getAllApplications = withAuthAndLog<ApplicationWithRelations[], []>(
  async (
    logger: RequestLogger,
    user: KindeUser<Record<string, unknown>>
  ): Promise<ApplicationWithRelations[]> => {
    try {
      const applications = await db.application.findMany({
        include: {
          students: true,
          reviews: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      logger.info(
        {
          userId: user.id,
          details: {
            count: applications.length,
            includes: ['students', 'reviews'],
          },
        },
        'Fetched all applications'
      );

      return applications;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error({ error: err }, 'Failed to fetch all applications');

      // Return empty array instead of failing
      return [];
    }
  }
);

export default getAllApplications;
