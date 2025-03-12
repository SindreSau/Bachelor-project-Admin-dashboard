'use server';
import { ApplicationData } from '@/app/api/applications/route';
import { PrismaClient, DocumentType } from '@prisma/client';

const prisma = new PrismaClient();

export default async function submitApplication(
  applicationData: ApplicationData
): Promise<{ success: boolean; message: string }> {
  console.log('Submitting application:', applicationData);

  try {
    // Using a transaction to ensure all operations succeed or fail together
    await prisma.$transaction(async (tx) => {
      // 1. Process all students in the array (handles any number of students)
      const studentIds = await Promise.all(
        applicationData.students.map(async (studentData) => {
          // Check if student exists by email
          let student = await tx.student.findUnique({
            where: { email: studentData.email },
          });

          // If student doesn't exist, create a new one
          if (!student) {
            student = await tx.student.create({
              data: {
                email: studentData.email,
                firstName: studentData.firstName,
                lastName: studentData.lastName,
              },
            });
          }

          // 2. Create file records for each student
          const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');

          // CV file
          await tx.file.create({
            data: {
              studentId: student.id,
              documentType: DocumentType.CV,
              storageUrl: studentData.cv_blob,
              fileName: `${student.firstName}_${student.lastName}_CV_${timestamp}.pdf`,
            },
          });

          // Grades file
          await tx.file.create({
            data: {
              studentId: student.id,
              documentType: DocumentType.GRADES,
              storageUrl: studentData.grades_blob,
              fileName: `${student.firstName}_${student.lastName}_Grades_${timestamp}.pdf`,
            },
          });

          return student.id;
        })
      );

      // 3. Create the application record
      const application = await tx.application.create({
        data: {
          coverLetterText: applicationData.coverLetter,
          school: applicationData.school,
          // Connect all students to this application
          students: {
            connect: studentIds.map((id) => ({ id })),
          },
          // Set first student as representative (optional)
          studentRepresentativeId: studentIds[0],
          // Connect all prioritized tasks to this application
          tasks: {
            connect: applicationData.prioritizedTasks.map((taskId) => ({ id: taskId })),
          },
          taskpriorityids: {
            set: applicationData.prioritizedTasks,
          },
        },
      });

      console.log(`Application created with ID: ${application.id}`);
    });

    return { success: true, message: 'Application received successfully!' };
  } catch (error) {
    console.error('Error submitting application:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? `Failed to submit application: ${error.message}`
          : 'Failed to submit application due to an unknown error',
    };
  }
}
