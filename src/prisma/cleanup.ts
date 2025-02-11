import { db } from '@/lib/prisma';

interface PrismaError extends Error {
  code?: string;
}

async function cleanup() {
  try {
    // Delete all files
    const deletedFiles = await db.file.deleteMany({});
    console.log(`Successfully deleted ${deletedFiles.count} files`);
  } catch (error: unknown) {
    const err = error as PrismaError;
    // If the error code indicates the table doesn't exist, log and continue.
    if (err.code === 'P2021') {
      console.log("Table 'File' does not exist. Skipping file cleanup.");
    } else {
      console.error('Error during cleanup:', error);
      process.exit(1);
    }
  } finally {
    await db.$disconnect();
  }
}

cleanup();
