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
      Review: true,
    },
  });

  if (!applicationData) {
    return <div className='text-lg font-bold'>No application found.</div>;
  }

  // For now, we'll hardcode a userId (later this will come from auth)
  const currentUserId = 'user1';

  // Find the current user's review if it exists
  const currentUserReview = applicationData.Review.find(
    (review) => review.userId === currentUserId
  );

  return (
    <ApplicationView
      application={applicationData}
      currentUserId={currentUserId}
      currentUserReview={currentUserReview || null}
    />
  );
}
