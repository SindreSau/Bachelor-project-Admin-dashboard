'use server';

import { db } from '@/lib/prisma';

const getApplicationStatus = async (applicationId: number) => {
  const application = await db.application.findUnique({
    where: { id: applicationId },
  });

  console.log(`Application ${applicationId} status is ${application?.status}`);
  return application?.status;
};

export default getApplicationStatus;
