import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Student } from '@prisma/client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const concatGroupName = (students: Student[] | undefined): string => {
  if (!students || students.length === 0) return 'No Students';

  const names = students.map((student) => student.firstName);

  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} og ${names[1]}`; // Feks: "Alex og Sindre"
  return `${names.slice(0, -1).join(', ')}, og ${names.slice(-1)}`; // Feks: "Alex, Sindre, og Ådne"
  // If we want to skip the , and 'og' we can do it like this instead:
  // return names.join('');
};
