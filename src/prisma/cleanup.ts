import { db } from '@/lib/prisma';

interface PrismaError extends Error {
  code?: string;
}

async function cleanup() {
  try {
    // Delete all files
    await db.file.deleteMany({});
  } catch (error: unknown) {
    const err = error as PrismaError;
    // If the error code indicates the table doesn't exist, log and continue.
    if (err.code === 'P2021') {
    } else {
      console.error('Error during cleanup:', error);
      process.exit(1);
    }
  } finally {
    await db.$disconnect();
  }
}

cleanup();
