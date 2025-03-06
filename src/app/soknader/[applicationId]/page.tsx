import { concatGroupName } from '@/lib/utils';
import ApplicationDetailsCard from './components/application-details-card';
import ApplicationStudentsGrid from './components/application-students-grid';
import ApplicationCoverLetter from './components/application-cover-letter';
// import ApplicationComments from './components/comments/application-comments-card';
import { getOneApplication } from '@/actions/applications/get-one-application';

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const parsedApplicationId = parseInt(applicationId, 10);

  const application = await getOneApplication(parsedApplicationId);

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
        {/* <ApplicationComments
          applicationId={application.id}
          comments={application.comments}
          currentUserName={currentUserName}
        /> */}
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
