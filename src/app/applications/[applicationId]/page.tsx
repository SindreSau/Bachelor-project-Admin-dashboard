import { db } from '@/lib/prisma';
import ApplicationView from './application-view';

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const parsedApplicationId = parseInt(applicationId, 10);

  const applicationData = await db.application.findUnique({
    where: { id: parsedApplicationId },
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
    },
  });

  if (!applicationData) {
    return <div className='text-lg font-bold'>No application found.</div>;
  }

  return <ApplicationView application={applicationData} />;
}
