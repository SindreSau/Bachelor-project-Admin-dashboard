'use server';

import { db } from '@/lib/prisma';

const setApplicationStatus = async (applicationId: number, status: string) => {
  await db.application.update({
    where: { id: applicationId },
    data: { status },
  });
  console.log(`Application ${applicationId} status updated to ${status}`);
};

export default setApplicationStatus;
