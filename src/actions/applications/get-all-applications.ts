'use server';

import { db } from '@/lib/prisma';
import { withRequestLogger, RequestLogger } from '@/lib/logger.server';
import { Application, Student, Review } from '@prisma/client';

// Define return type for the function
type ApplicationWithRelations = Application & {
  students: Student[];
  reviews: Review[];
};

// Wrap the function with our logger middleware
const getAllApplications = withRequestLogger<ApplicationWithRelations[], []>(
  async (logger: RequestLogger): Promise<ApplicationWithRelations[]> => {
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

      const applicationsDetails = { count: applications.length };
      logger.info(applicationsDetails, 'Fetched all applications');
      return applications;
    } catch (error) {
      const errorObject: {
        message: string;
        code?: string;
        stack?: string;
      } = {
        message: error instanceof Error ? error.message : String(error),
        code: (error as { code?: string })?.code,
        stack:
          process.env.NODE_ENV !== 'production' && error instanceof Error ? error.stack : undefined,
      };

      logger.error({ error: errorObject }, 'Failed to fetch applications');

      // Return empty array instead of failing
      return [];
    }
  }
);

export default getAllApplications;
