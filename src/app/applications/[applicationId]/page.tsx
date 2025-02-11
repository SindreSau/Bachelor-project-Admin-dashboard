import { db } from '@/lib/prisma';
import ApplicationView from './application-view';

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  // Await the params
  const { applicationId } = await params;
  const parsedApplicationId = parseInt(applicationId, 10);

  // Fetch data on the server
  // TODO: Move this to server-actions
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
    },
  });

  if (!applicationData) {
    return <div className='text-lg font-bold'>No application found.</div>;
  }

  // Pass the data to the client component
  return <ApplicationView application={applicationData} />;
}
