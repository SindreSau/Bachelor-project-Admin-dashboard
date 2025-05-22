import ApplicationTable from '@/components/table/application-table';
import getAllApplications from '@/actions/applications/get-all-applications';
import { Suspense } from 'react';
import ApplicationTableSkeleton from '@/components/table/application-table-skeleton';
import getApplicationStatus from '@/utils/applications/get-application-status';
import { concatGroupName } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <Suspense fallback={<ApplicationTableSkeleton />}>
      <ApplicationTableContent />
    </Suspense>
  );
}

async function ApplicationTableContent() {
  // Fetch applications with caching options
  const applications = await getAllApplications();

  if (!applications || applications.length === 0) {
    return <p className='text-muted-foreground text-center'>Ingen søknader å vise.</p>;
  }

  // Process the data on the server instead of client
  const processedApplications = await Promise.all(
    applications.map(async (app) => {
      const status = await getApplicationStatus(app.id);
      return {
        ...app,
        groupName: concatGroupName(app.students),
        status: status ?? '',
      };
    })
  );

  return <ApplicationTable applications={processedApplications} />;
}
