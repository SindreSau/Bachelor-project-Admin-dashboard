'use server';

import { db } from '@/lib/prisma';

const getApplicationStatus = async (applicationId: number) => {
  const application = await db.application.findUnique({
    where: { id: applicationId },
  });

  return application?.status;
};

export default getApplicationStatus;
