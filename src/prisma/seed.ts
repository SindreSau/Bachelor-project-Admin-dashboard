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
  // Clear existing data to avoid conflicts
  await prisma.file.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.task.deleteMany({});

  console.log('Cleared existing data');

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

  // Create first application
  const application1 = await prisma.application.create({
    data: {
      school: schoolForFixedStudents,
      coverLetterText: 'We are applying for the position because we are a great fit.',
      tasks: {
        connect: [{ id: task1.id }],
      },
      taskpriorityids: [task1.id],
    },
  });
  console.log('Created application 1.');

  // Create fixed students with emails based on school and associated with application
  const fixedStudentData = [
    { firstName: 'Ådne', lastName: 'Longva Nilsen' },
    { firstName: 'Alex', lastName: 'McCorkle' },
    { firstName: 'Sindre', lastName: 'Sauarlia' },
  ];

  const fixedStudents = [];
  for (const studentData of fixedStudentData) {
    const email = generateSchoolEmail(
      studentData.firstName,
      studentData.lastName,
      schoolForFixedStudents
    );

    const student = await prisma.student.create({
      data: {
        email,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        applicationId: application1.id, // Directly associate with application
      },
    });

    fixedStudents.push(student);
  }
  console.log('Created fixed students.');

  // Set student representative for first application
  await prisma.application.update({
    where: { id: application1.id },
    data: {
      studentRepresentativeId: fixedStudents[0].id,
    },
  });
  console.log('Updated application 1 with student representative.');

  // Generate additional applications with their students
  const additionalStudentsData = [];
  for (let i = 0; i < 50; i++) {
    additionalStudentsData.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    });
  }
  console.log('Prepared additional student data.');

  // Create 9 more applications with new students
  let studentIndex = 0;
  for (let i = 0; i < 9; i++) {
    const groupSize = faker.number.int({ min: 3, max: 5 });
    if (studentIndex + groupSize > additionalStudentsData.length) break; // stop if we run out

    // Select the school for this application
    const school = faker.helpers.arrayElement(['OsloMet', 'Høyskolen Kristiania']);

    // 50/50 chance: either connect both tasks or only one randomly selected task.
    const applyBoth = faker.datatype.boolean();
    const connectedTasks = applyBoth
      ? [{ id: task1.id }, { id: task2.id }]
      : [{ id: faker.helpers.arrayElement([task1.id, task2.id]) }];

    const taskIds = connectedTasks.map((task) => task.id);

    // Create the application first
    const application = await prisma.application.create({
      data: {
        school: school,
        coverLetterText: faker.lorem.words(faker.number.int({ min: 150, max: 400 })),
        tasks: {
          connect: connectedTasks,
        },
        taskpriorityids: faker.helpers.shuffle(taskIds),
      },
    });

    // Create the students with school-based emails and associate with application
    const studentsInGroup = [];
    for (let j = 0; j < groupSize; j++) {
      const studentData = additionalStudentsData[studentIndex++];
      const email = generateSchoolEmail(studentData.firstName, studentData.lastName, school);

      const student = await prisma.student.create({
        data: {
          email: email,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          applicationId: application.id, // Directly associate with application
        },
      });

      studentsInGroup.push(student);
    }

    // Set the student representative
    const studentRepresentative = studentsInGroup[0];
    await prisma.application.update({
      where: { id: application.id },
      data: {
        studentRepresentativeId: studentRepresentative.id,
      },
    });

    console.log(
      `Created application ${i + 2} with ${studentsInGroup.length} student(s) from ${school}, applying for ${
        connectedTasks.length === 2 ? 'both tasks' : 'one task'
      }.`
    );
  }

  // For each student, create file records
  const allStudents = await prisma.student.findMany();
  const fileSamples = ['example-1.pdf', 'example-2.pdf', 'example-3.pdf'];

  for (const student of allStudents) {
    const cvFileName = `${student.firstName.toLowerCase()}-cv.pdf`;
    const gradesFileName = `${student.firstName.toLowerCase()}-kar.pdf`;

    // Randomly choose a sample for CV and a different one for Grades
    const cvSample = faker.helpers.arrayElement(fileSamples);
    const remainingSamples = fileSamples.filter((sample) => sample !== cvSample);
    const gradesSample = faker.helpers.arrayElement(remainingSamples);

    // Create CV file
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

    // Create Grades file
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
