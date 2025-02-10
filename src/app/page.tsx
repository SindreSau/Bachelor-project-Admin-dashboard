import ApplicationTable from '@/components/table/application-table';
import { db } from '@/lib/prisma';
import { Application } from '@prisma/client';

async function getApplications(): Promise<Application[]> {
  try {
    const applications = await db.application.findMany();
    return applications;
  } catch (error) {
    console.error('Error finding apps', error);
    return [];
  }
}
export default async function Home() {
  const applications = await getApplications();
  return (
    <>
      <ApplicationTable applications={applications} />
    </>
  );
}
