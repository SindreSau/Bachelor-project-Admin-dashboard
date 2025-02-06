'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const taskName = formData.get('taskName') as string;
  const taskDescription = formData.get('taskDescription') as string;

  if (!taskName || !taskDescription) {
    throw new Error('Task name and description are required.');
  }

  await prisma.task.create({
    data: {
      taskName,
      taskDescription,
    },
  });

  revalidatePath('/prosjekter');
} 