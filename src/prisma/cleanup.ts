import { db } from '@/lib/prisma';

async function cleanup() {
  try {
    // Delete all files
    const deletedFiles = await db.file.deleteMany({});
    console.log(`Successfully deleted ${deletedFiles.count} files`);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

cleanup();
