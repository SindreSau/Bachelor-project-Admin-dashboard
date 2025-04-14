'use server';

import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function restoreTask(taskId: number) {
  try {
    const task = await db.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return { success: false, error: 'task not found' };
    }

    await db.task.update({
      where: { id: taskId },
      data: { deletedAt: null },
    });

    revalidatePath('/oppgaver');
    return { success: true };
  } catch (error) {
    console.error('Failed to restore task:', error);
    return {
      success: false,
      error: 'Failed to restore task. Please try again.',
    };
  }
}
