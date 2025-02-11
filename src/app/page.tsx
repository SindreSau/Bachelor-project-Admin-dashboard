import getAllApplicationsForTableView from '@/actions/applications/get-applications';
import ApplicationTable from '@/components/table/application-table';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const applications = await getAllApplicationsForTableView();

  // TODO: import function concatinateNames from '@/utils/strings/concatinate-names';

  return (
    <>
      <ApplicationTable applications={applications} />
    </>
  );
}
