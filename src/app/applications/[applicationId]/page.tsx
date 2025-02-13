import { db } from '@/lib/prisma';
import { concatGroupName } from '@/lib/utils';
import ApplicationDetailsCard from './components/application-details-card';
import ApplicationStudentsGrid from './components/application-students-grid';
import ApplicationCoverLetter from './components/application-cover-letter';
import ApplicationComments from './components/application-comments';

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const parsedApplicationId = parseInt(applicationId, 10);

  const application = await db.application.findUnique({
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

  if (!application) {
    return <div className='text-lg font-bold'>No application found.</div>;
  }

  return (
    <div className='flex h-full flex-1 flex-col gap-2'>
      {/* Application Details Card */}
      <ApplicationDetailsCard
        applicationId={application.id}
        groupName={concatGroupName(application.students)}
        school={application.school}
        createdAt={application.createdAt}
        updatedAt={application.updatedAt}
        applicationReviews={application.reviews}
      />
      <div className='flex h-full flex-col-reverse gap-2 xl:flex-row-reverse'>
        {/* Cover Letter Card */}
        <ApplicationComments />
        <ApplicationCoverLetter
          coverLetter={application.coverLetterText}
          tasks={application.tasks}
        />

        {/* Students Grid */}
      </div>
      <ApplicationStudentsGrid
        students={application.students}
        studentRepresentativeId={application.studentRepresentativeId}
      />
    </div>
  );
}
