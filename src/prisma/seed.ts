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

  const connectionString = process.env.AZURITE_CONNECTION_STRING || '';
  console.log('using connectionString: ' + connectionString);

  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

  const containerName = 'pdf';
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  const blobName = `${Date.now()}-${file.name}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await blockBlobClient.upload(buffer, buffer.length);

  // Instead of returning blockBlobClient.url, construct the URL:
  const baseUrl = process.env.BLOB_BASE_URL || 'http://127.0.0.1:10000';
  return `${baseUrl}/devstoreaccount1/${containerName}/${blobName}`;
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

// Function to generate school-based email
function generateSchoolEmail(firstName: string, lastName: string, school: string): string {
  // Normalize to lowercase and remove special characters
  const normalizedFirstName = firstName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const normalizedLastName = lastName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/\s+/)
    .join('-');

  // Create the email address based on school
  const domain = school === 'OsloMet' ? 'oslomet.no' : 'kristiania.no';
  return `${normalizedFirstName}-${normalizedLastName}@${domain}`;
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
      published: true,
      deadline: new Date('2025-10-25'),
    },
  });
  console.log('Upserted task 1.');

  // Create one more task with realistic content using faker
  const task2 = await prisma.task.create({
    data: {
      taskName: 'Automated Library Management System',
      taskDescription:
        'Build a system for managing a library. The system should allow librarians to manage books, patrons, and loans. The system should also allow patrons to search for books, check out books, and return books. The system should also allow librarians to generate reports on books, patrons, and loans.',
      published: true,
      deadline: new Date('2025-10-25'),
    },
  });
  console.log('Created task 2.');

  // The first application is from OsloMet (as set in the original code)
  const schoolForFixedStudents = 'OsloMet';

  // Create fixed students with emails based on school
  const fixedStudents = await Promise.all([
    prisma.student.upsert({
      where: { email: 'aadne-longva-nilsen@oslomet.no' },
      update: {},
      create: {
        email: generateSchoolEmail('Ådne', 'Longva Nilsen', schoolForFixedStudents),
        firstName: 'Ådne',
        lastName: 'Longva Nilsen',
      },
    }),
    prisma.student.upsert({
      where: { email: 'alex-mccorkle@oslomet.no' },
      update: {},
      create: {
        email: generateSchoolEmail('Alex', 'McCorkle', schoolForFixedStudents),
        firstName: 'Alex',
        lastName: 'McCorkle',
      },
    }),
    prisma.student.upsert({
      where: { email: 'sindre-sauarlia@oslomet.no' },
      update: {},
      create: {
        email: generateSchoolEmail('Sindre', 'Sauarlia', schoolForFixedStudents),
        firstName: 'Sindre',
        lastName: 'Sauarlia',
      },
    }),
  ]);
  console.log('Upserted fixed students.');

  // Create additional students but don't assign emails yet since we don't know their school
  const additionalStudentsData = [];
  for (let i = 0; i < 50; i++) {
    additionalStudentsData.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    });
  }
  console.log('Prepared additional student data.');

  // First application remains as is with fixed students
  await prisma.application.upsert({
    where: { id: 1 },
    update: {},
    create: {
      school: schoolForFixedStudents,
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
      taskpriorityids: [task1.id],
    },
  });
  console.log('Upserted application 1.');

  // Partition additional students into 9 unique groups and create them with school-based emails
  const additionalStudents = [];
  let studentIndex = 0;

  for (let i = 0; i < 9; i++) {
    const groupSize = faker.number.int({ min: 3, max: 5 });
    if (studentIndex + groupSize > additionalStudentsData.length) break; // stop if we run out

    // Select the school for this application
    const school = faker.helpers.arrayElement(['OsloMet', 'Høyskolen Kristiania']);

    // Create the students with school-based emails
    const studentsInGroup = [];
    for (let j = 0; j < groupSize; j++) {
      const studentData = additionalStudentsData[studentIndex++];
      const email = generateSchoolEmail(studentData.firstName, studentData.lastName, school);

      const student = await prisma.student.create({
        data: {
          email: email,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
        },
      });

      studentsInGroup.push(student);
      additionalStudents.push(student);
    }

    const studentRepresentative = studentsInGroup[0];

    // 50/50 chance: either connect both tasks or only one randomly selected task.
    const applyBoth = faker.datatype.boolean();
    const connectedTasks = applyBoth
      ? [{ id: task1.id }, { id: task2.id }]
      : [{ id: faker.helpers.arrayElement([task1.id, task2.id]) }];

    await prisma.application.create({
      data: {
        school: school,
        coverLetterText: faker.lorem.words(faker.number.int({ min: 150, max: 400 })),
        students: {
          connect: studentsInGroup.map((student) => ({ id: student.id })),
        },
        studentRepresentative: {
          connect: { id: studentRepresentative.id },
        },
        tasks: {
          connect: connectedTasks,
        },
        taskpriorityids: faker.helpers.shuffle(connectedTasks.map((task) => task.id)),
      },
    });
    console.log(
      `Created application ${i + 2} with ${studentsInGroup.length} student(s) from ${school}, applying for ${
        connectedTasks.length === 2 ? 'both tasks' : 'one task'
      }.`
    );
  }

  // For each student (both fixed and additional), create file records if they don't exist.
  // Use "example.pdf" for both CV and Grades.
  const allStudents = [...fixedStudents, ...additionalStudents];
  const fileSamples = ['example-1.pdf', 'example-2.pdf', 'example-3.pdf'];
  for (const student of allStudents) {
    const cvFileName = `${student.firstName.toLowerCase()}-cv.pdf`;
    const gradesFileName = `${student.firstName.toLowerCase()}-kar.pdf`;

    // Randomly choose a sample for CV and a different one for Grades
    const cvSample = faker.helpers.arrayElement(fileSamples);
    const remainingSamples = fileSamples.filter((sample) => sample !== cvSample);
    const gradesSample = faker.helpers.arrayElement(remainingSamples);

    const existingFiles = await prisma.file.findMany({
      where: {
        studentId: student.id,
        OR: [{ fileName: cvFileName }, { fileName: gradesFileName }],
      },
    });

    if (!existingFiles.some((file) => file.fileName === cvFileName)) {
      const cvUrl = await uploadFileFromPublic(cvSample);
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
      const gradesUrl = await uploadFileFromPublic(gradesSample);
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
