import ApplicationTable from '@/components/table/application-table';
import getAllApplications from '@/actions/applications/get-all-applications';
import { Suspense } from 'react';
import ApplicationTableSkeleton from '@/components/table/application-table-skeleton';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <Suspense fallback={<ApplicationTableSkeleton />}>
      <ApplicationTableContent />
    </Suspense>
  );
}

async function ApplicationTableContent() {
  const applications = await getAllApplications();

  if (!applications || applications.length === 0) {
    return <p className='text-muted-foreground text-center'>Ingen søknader å vise.</p>;
  }

  return <ApplicationTable applications={applications} />;
}
