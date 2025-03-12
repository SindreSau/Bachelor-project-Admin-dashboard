'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteTask(id: number) {
  try {
    // First get the comment to know which application to revalidate
    const task = await db.task.findUnique({
      where: { id: id },
    });

    if (!task) {
      return { success: false, error: 'Task not found' };
    }

    // Delete the comment
    const updatedTask = await db.task.update({
      where: { id: id },
      data: { deletedAt: new Date() },
    });

    // Verify update was successful
    if (!updatedTask.deletedAt) {
      return { success: false, error: 'Failed to delete task' };
    }

    // Revalidate the application path
    revalidatePath(`/prosjekter`);
    console.log('Task deleted');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete task:', error);
    return {
      success: false,
      error: 'Failed to delete task. Please try again.',
    };
  }
}
