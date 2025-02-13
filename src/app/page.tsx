import getAllApplicationsForTableView from '@/actions/applications/get-applications';
import ApplicationTable from '@/components/table/application-table';

export default async function Home() {
  const applications = await getAllApplicationsForTableView();
  return (
    <>
      <ApplicationTable applications={applications} />
    </>
  );
}
