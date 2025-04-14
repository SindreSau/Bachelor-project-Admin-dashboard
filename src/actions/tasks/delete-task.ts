'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteTask(id: number) {
  try {
    const task = await db.task.findUnique({
      where: { id: id },
    });

    if (!task) {
      return { success: false, error: 'Task not found' };
    }

    const updatedTask = await db.task.update({
      where: { id: id },
      data: { deletedAt: new Date(), published: false },
    });

    if (!updatedTask.deletedAt) {
      return { success: false, error: 'Failed to delete task' };
    }

    revalidatePath(`/oppgaver`);

    return { success: true };
  } catch (error) {
    console.error('Failed to delete task:', error);
    return {
      success: false,
      error: 'Failed to delete task. Please try again.',
    };
  }
}
