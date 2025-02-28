import getAllApplications from '@/actions/applications/get-all-applications';
import ApplicationTable from '@/components/table/application-table';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const applications = await getAllApplications();
  console.log(applications);

  if (applications.length === 0) {
    return <p className='text-center text-muted-foreground'>Ingen søknader å vise.</p>;
  }

  return <ApplicationTable applications={applications} />;
}
