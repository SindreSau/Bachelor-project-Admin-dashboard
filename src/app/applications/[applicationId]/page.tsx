import { db } from '@/lib/prisma';
import ApplicationView from './application-view';

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  // Await the params
  const resolvedParams = await params;
  const applicationId = parseInt(resolvedParams.applicationId, 10);

  // Fetch data on the server
  const applicationData = await db.application.findUnique({
    where: { id: applicationId },
    include: {
      students: {
        include: {
          files: true,
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
