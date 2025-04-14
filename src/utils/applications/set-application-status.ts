'use server';

import { db } from '@/lib/prisma';

const setApplicationStatus = async (applicationId: number, status: string) => {
  await db.application.update({
    where: { id: applicationId },
    data: { status },
  });
};

export default setApplicationStatus;
