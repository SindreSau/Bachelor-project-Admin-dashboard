import getAllApplications from '@/actions/applications/get-all-applications';
import ApplicationTable from '@/components/table/application-table';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const applications = await getAllApplications();
  return (
    <>
      <ApplicationTable applications={applications} />
    </>
  );
}
