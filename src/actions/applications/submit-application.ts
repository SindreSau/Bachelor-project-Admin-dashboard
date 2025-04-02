'use server';
import { ApplicationData } from '@/app/api/applications/route';
import { DocumentType } from '@prisma/client';
import { withRequestLogger, RequestLogger } from '@/lib/logger.server';
import { db } from '@/lib/prisma';
import { sendConfirmationEmail } from '../email/send-email';

const submitApplication = withRequestLogger<
  { success: boolean; message: string },
  [ApplicationData]
>(
  async (
    logger: RequestLogger,
    applicationData: ApplicationData
  ): Promise<{ success: boolean; message: string }> => {
    try {
      // Using a transaction to ensure all operations succeed or fail together
      await db.$transaction(async (tx) => {
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

        const groupLeaderbyStudentId = (groupLeader: number) => {
          for (let i = 0; i < studentIds.length; i++) {
            if (i === groupLeader) {
              return studentIds[i];
            }
          }
        };

        // 3. Create the application record
        const application = await tx.application.create({
          data: {
            coverLetterText: applicationData.coverLetter,
            school: applicationData.school,
            // Connect all students to this application
            students: {
              connect: studentIds.map((id) => ({ id })),
            },
            // Set student representative to the group leader
            studentRepresentativeId: groupLeaderbyStudentId(applicationData.groupLeader),
            // Connect all prioritized tasks to this application
            tasks: {
              connect: applicationData.prioritizedTasks.map((taskId) => ({ id: taskId })),
            },
            taskpriorityids: {
              set: applicationData.prioritizedTasks,
            },
          },
        });

        // Log success with useful metrics
        logger.info(
          {
            details: {
              action: 'submitApplication',
              applicationId: application.id,
              school: applicationData.school,
              students: applicationData.students.map((student) => student.email),
              tasks: applicationData.prioritizedTasks,
            },
          },
          'Application submitted successfully'
        );

        // Send confirmation email
        const { data, error } = await sendConfirmationEmail(
          applicationData.students[0].email,
          applicationData.students[0].firstName
        );
        if (error) {
          throw new Error('Failed to send confirmation email');
        }
        logger.info(
          {
            details: {
              action: 'sendConfirmationEmail',
              data: data,
              email: applicationData.students[0].email,
              studentName: applicationData.students[0].firstName,
            },
          },
          'Confirmation email sent successfully'
        );
      });

      return { success: true, message: 'Application received successfully!' };
    } catch (error) {
      const errorObject = {
        message: error instanceof Error ? error.message : String(error),
        code: (error as { code?: string })?.code,
        stack:
          process.env.NODE_ENV !== 'production' && error instanceof Error ? error.stack : undefined,
      };

      logger.error(
        {
          action: 'submitApplication',
          error: errorObject,
        },
        'Failed to submit application'
      );

      return {
        success: false,
        message:
          error instanceof Error
            ? `Failed to submit application: ${error.message}`
            : 'Failed to submit application due to an unknown error',
      };
    }
  }
);

export default submitApplication;
