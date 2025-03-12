import { concatGroupName } from '@/lib/utils';
import ApplicationDetailsCard from './components/application-details-card';
import ApplicationStudentsGrid from './components/application-students-grid';
import ApplicationCoverLetter from './components/application-cover-letter';
import { getOneApplication } from '@/actions/applications/get-one-application';
import ApplicationComments from './components/comments/application-comments-card';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const parsedApplicationId = parseInt(applicationId, 10);

  // Get user session on the server
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const application = await getOneApplication(parsedApplicationId);

  if (!application) {
    return <div className='text-lg font-bold'>No application found.</div>;
  }

  return (
    <div className='flex h-full flex-col gap-2'>
      {/* Application Details Card */}
      <ApplicationDetailsCard
        applicationId={application.id || 0}
        groupName={concatGroupName(application.students)}
        school={application.school || null}
        createdAt={application.createdAt || new Date()}
        updatedAt={application.updatedAt || new Date()}
        applicationReviews={application.reviews || []}
      />

      {/* Main content area with ResizablePanelGroup for larger screens */}
      <div className='flex h-full w-full'>
        {/* Mobile view - stacked layout */}
        <div className='flex w-full flex-col gap-2 xl:hidden'>
          <ApplicationCoverLetter
            coverLetter={application.coverLetterText || ''}
            tasks={application.tasks || []}
          />
          <ApplicationComments
            applicationId={application.id || 0}
            comments={application.comments || []}
            currentUser={
              user
                ? {
                    id: user.id,
                    given_name: user.given_name || '',
                    family_name: user.family_name || '',
                    picture: user.picture || '',
                  }
                : undefined
            }
          />
        </div>

        {/* Desktop view - resizable panels */}
        <div className='hidden grow xl:flex'>
          <ResizablePanelGroup direction='horizontal'>
            {/* Cover Letter Panel - 66% default */}
            <ResizablePanel defaultSize={66} minSize={35}>
              <div className='h-full pr-1'>
                <ApplicationCoverLetter
                  coverLetter={application.coverLetterText || ''}
                  tasks={application.tasks || []}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Comments Panel - 33% default */}
            <ResizablePanel defaultSize={34} minSize={22}>
              <div className='h-full pl-1'>
                <ApplicationComments
                  applicationId={application.id || 0}
                  comments={application.comments || []}
                  currentUser={
                    user
                      ? {
                          id: user.id,
                          given_name: user.given_name || '',
                          family_name: user.family_name || '',
                          picture: user.picture || '',
                        }
                      : undefined
                  }
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {/* Students Grid */}
      <ApplicationStudentsGrid
        students={application.students || []}
        studentRepresentativeId={application.studentRepresentativeId || null}
      />
    </div>
  );
}
