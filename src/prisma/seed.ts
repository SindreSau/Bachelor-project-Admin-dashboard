import { BlobServiceClient } from '@azure/storage-blob';
import { PrismaClient, DocumentType } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { fakerNB_NO as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function uploadPdf(file: File) {
  if (!file || file.type !== 'application/pdf') {
    throw new Error('Please provide a valid PDF file');
  }

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  console.log('Connection string:', connectionString); // Debug connection string

  if (!connectionString) {
    throw new Error('No valid connection string provided');
  }

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    console.log('Successfully created blob service client'); // Debug client creation

    const containerName = 'pdf';
    const containerClient = blobServiceClient.getContainerClient(containerName);
    console.log('Got container client'); // Debug container client

    await containerClient.createIfNotExists();
    console.log('Container exists or was created'); // Debug container creation

    const blobName = `${Date.now()}-${file.name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    console.log('Created block blob client'); // Debug blob client

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await blockBlobClient.upload(buffer, buffer.length);
    console.log('Successfully uploaded blob'); // Debug upload

    return blockBlobClient.url;
  } catch (error) {
    console.error('Detailed error in uploadPdf:', error);
    throw error;
  }
}

async function uploadFileFromPublic(fileName: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'cv-kar', fileName);
    const fileBuffer = await fs.readFile(filePath);
    // Always use the example.pdf which you uploaded
    const file = new File([fileBuffer], fileName, { type: 'application/pdf' });
    return await uploadPdf(file);
  } catch (error) {
    console.error(`Failed to upload ${fileName}:`, error);
    throw error;
  }
}

async function main() {
  // Create first task (fixed)
  const task1 = await prisma.task.upsert({
    where: { id: 1 },
    update: {},
    create: {
      taskName: 'Bachelor application management system',
      taskDescription:
        'Build a system for managing applications for bachelor programs for Accenture. The system should allow students to apply for a program, and for the student representative to manage the applications. The system should also allow the student representative to review and approve applications.',
    },
  });
  console.log('Upserted task 1.');

  // Create one more task with realistic content using faker
  const task2 = await prisma.task.create({
    data: {
      taskName: faker.company.catchPhrase(),
      taskDescription: faker.lorem.paragraphs(2),
    },
  });
  console.log('Created task 2.');

  // Create fixed students (they will only be used in the first application)
  const fixedStudents = await Promise.all([
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
  console.log('Upserted fixed students.');

  // Create additional students using faker (create 50 so that we can partition them uniquely)
  const additionalStudentsPromises = [];
  for (let i = 0; i < 50; i++) {
    additionalStudentsPromises.push(
      prisma.student.create({
        data: {
          email: faker.internet.email(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
        },
      })
    );
  }
  const additionalStudents = await Promise.all(additionalStudentsPromises);
  console.log('Created additional students.');

  // First application remains as is with fixed students
  await prisma.application.upsert({
    where: { id: 1 },
    update: {},
    create: {
      school: 'OsloMet',
      coverLetterText: 'We are applying for the position because we are a great fit.',
      students: {
        connect: fixedStudents.map((student) => ({ id: student.id })),
      },
      studentRepresentative: {
        connect: { id: fixedStudents[0].id },
      },
      tasks: {
        connect: [{ id: task1.id }],
      },
    },
  });
  console.log('Upserted application 1.');

  // Partition additional students into 9 unique groups (each group gets 3 to 5 students)
  const additionalPool = [...additionalStudents];
  for (let i = 0; i < 9; i++) {
    const groupSize = faker.number.int({ min: 3, max: 5 });
    // Remove the first groupSize students from the pool; this ensures each student is used only once.
    const selectedStudents = additionalPool.splice(0, groupSize);
    if (selectedStudents.length === 0) break; // stop if we run out

    const studentRepresentative = selectedStudents[0];

    // 50/50 chance: either connect both tasks or only one randomly selected task.
    const applyBoth = faker.datatype.boolean();
    const connectedTasks = applyBoth
      ? [{ id: task1.id }, { id: task2.id }]
      : [{ id: faker.helpers.arrayElement([task1.id, task2.id]) }];

    await prisma.application.create({
      data: {
        school: faker.helpers.arrayElement(['OsloMet', 'Høyskolen Kristiania']),
        coverLetterText: faker.lorem.paragraphs(2),
        students: {
          connect: selectedStudents.map((student) => ({ id: student.id })),
        },
        studentRepresentative: {
          connect: { id: studentRepresentative.id },
        },
        tasks: {
          connect: connectedTasks,
        },
      },
    });
    console.log(
      `Created application ${i + 2} with ${selectedStudents.length} student(s), applying for ${
        connectedTasks.length === 2 ? 'both tasks' : 'one task'
      }.`
    );
  }

  // For each student (both fixed and additional), create file records if they don't exist.
  // Use "example.pdf" for both CV and Grades.
  const allStudents = [...fixedStudents, ...additionalStudents];
  for (const student of allStudents) {
    const cvFileName = `${student.firstName.toLowerCase()}-cv.pdf`;
    const gradesFileName = `${student.firstName.toLowerCase()}-kar.pdf`;

    const existingFiles = await prisma.file.findMany({
      where: {
        studentId: student.id,
        OR: [{ fileName: cvFileName }, { fileName: gradesFileName }],
      },
    });

    if (!existingFiles.some((file) => file.fileName === cvFileName)) {
      const cvUrl = await uploadFileFromPublic('example.pdf');
      await prisma.file.create({
        data: {
          studentId: student.id,
          documentType: DocumentType.CV,
          fileName: cvFileName,
          storageUrl: cvUrl,
        },
      });
      console.log(`Created CV file for ${student.firstName}`);
    } else {
      console.log(`CV already exists for ${student.firstName}`);
    }

    if (!existingFiles.some((file) => file.fileName === gradesFileName)) {
      const gradesUrl = await uploadFileFromPublic('example.pdf');
      await prisma.file.create({
        data: {
          studentId: student.id,
          documentType: DocumentType.GRADES,
          fileName: gradesFileName,
          storageUrl: gradesUrl,
        },
      });
      console.log(`Created Grades file for ${student.firstName}`);
    } else {
      console.log(`Grades already exists for ${student.firstName}`);
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
