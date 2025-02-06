import { uploadPdf } from '@/utils/blobstorage/file-upload';
import { PrismaClient, DocumentType } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function uploadFileFromPublic(fileName: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'cv-kar', fileName);
    const fileBuffer = await fs.readFile(filePath);
    const file = new File([fileBuffer], fileName, { type: 'application/pdf' });
    return await uploadPdf(file);
  } catch (error) {
    console.error(`Failed to upload ${fileName}:`, error);
    throw error;
  }
}

async function main() {
  // Create task first
  const task = await prisma.task.upsert({
    where: { id: 1 },
    update: {},
    create: {
      taskName: 'Bachelor application management system',
      taskDescription:
        'Build a system for managing applications for bachelor programs for Accenture. The system should allow students to apply for a program, and for the student representative to manage the applications. The system should also allow the student representative to review and approve applications.',
    },
  });

  // Create students
  const students = await Promise.all([
    prisma.student.upsert({
      where: { email: 'aadne@example.com' },
      update: {},
      create: {
        email: 'aadne@example.com',
        firstName: 'Ådne',
        lastName: 'Longva Nilsen',
      },
    }),
    prisma.student.upsert({
      where: { email: 'alex@example.com' },
      update: {},
      create: {
        email: 'alex@example.com',
        firstName: 'Alex',
        lastName: 'McCorkle',
      },
    }),
    prisma.student.upsert({
      where: { email: 'sindre@example.com' },
      update: {},
      create: {
        email: 'sindre@example.com',
        firstName: 'Sindre',
        lastName: 'Sauarlia',
      },
    }),
  ]);

  // Create application connected to task
  const application = await prisma.application.upsert({
    where: { id: 1 },
    update: {},
    create: {
      school: 'OsloMet',
      students: {
        connect: students.map((student) => ({ id: student.id })),
      },
      studentRepresentative: {
        connect: { id: students[0].id },
      },
      tasks: {
        connect: [{ id: task.id }],
      },
      coverLetterText: 'We are applying for the position because we are a great fit.',
    },
  });

  // Upload files for each student
  for (const student of students) {
    const cvFileName = `${student.firstName.toLowerCase()}-cv.pdf`;
    const gradesFileName = `${student.firstName.toLowerCase()}-kar.pdf`;

    const existingFiles = await prisma.file.findMany({
      where: { studentId: student.id },
    });

    if (!existingFiles.some((file) => file.fileName === cvFileName)) {
      const cvUrl = await uploadFileFromPublic(cvFileName);
      await prisma.file.create({
        data: {
          studentId: student.id,
          documentType: DocumentType.CV,
          fileName: cvFileName,
          storageUrl: cvUrl,
        },
      });
    }

    if (!existingFiles.some((file) => file.fileName === gradesFileName)) {
      const gradesUrl = await uploadFileFromPublic(gradesFileName);
      await prisma.file.create({
        data: {
          studentId: student.id,
          documentType: DocumentType.GRADES,
          fileName: gradesFileName,
          storageUrl: gradesUrl,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
