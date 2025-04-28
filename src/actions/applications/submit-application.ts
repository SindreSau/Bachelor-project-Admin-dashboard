'use server';
import { ApplicationData } from '@/app/api/applications/route';
import { DocumentType } from '@prisma/client';
import { withRequestLogger, RequestLogger, logger } from '@/lib/logger.server';
import { db } from '@/lib/prisma';
import { sendConfirmationEmail } from '../email/send-email';
import { deleteByUrl } from '@/utils/blobstorage/delete-files';

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
        // 1. Create the application record first
        const application = await tx.application.create({
          data: {
            coverLetterText: applicationData.coverLetter,
            school: applicationData.school,
            taskpriorityids: {
              set: applicationData.prioritizedTasks,
            },
            // Connect tasks to this application
            tasks: {
              connect: applicationData.prioritizedTasks.map((taskId) => ({ id: taskId })),
            },
          },
        });

        // 2. Process all students in the array and create new records for each
        const students = await Promise.all(
          applicationData.students.map(async (studentData) => {
            // Always create a new student record even if the email already exists
            const newStudent = await tx.student.create({
              data: {
                email: studentData.email,
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                // Connect this student to the application
                applicationId: application.id,
              },
            });

            // 3. Create file records for each student
            const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');

            // CV file
            await tx.file.create({
              data: {
                studentId: newStudent.id,
                documentType: DocumentType.CV,
                storageUrl: studentData.cv_blob,
                fileName: `${newStudent.firstName}_${newStudent.lastName}_CV_${timestamp}.pdf`,
              },
            });

            // Grades file
            await tx.file.create({
              data: {
                studentId: newStudent.id,
                documentType: DocumentType.GRADES,
                storageUrl: studentData.grades_blob,
                fileName: `${newStudent.firstName}_${newStudent.lastName}_Grades_${timestamp}.pdf`,
              },
            });

            return newStudent;
          })
        );

        // 4. Update the application with the student representative
        const groupLeader = students[applicationData.groupLeader];

        await tx.application.update({
          where: { id: application.id },
          data: {
            studentRepresentativeId: groupLeader.id,
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
        // Move the logger.info for confirmation email inside the if (!error) block
        const { data, error } = await sendConfirmationEmail(
          applicationData.students[0].email,
          applicationData.students[0].firstName
        );
        if (error) {
          throw new Error('Failed to send confirmation email');
        } else {
          logger.info(
            {
              details: {
                action: 'sendConfirmationEmail',
                data: data ?? {},
                email: applicationData.students[0].email,
                studentName: applicationData.students[0].firstName,
              },
            },
            'Confirmation email sent successfully'
          );
        }
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
        'Failed to submit application - deleting files'
      );

      // If an error occurs, delete the files that were created
      deleteFiles(
        applicationData.students
          .map((student) => ({
            cv_blob: student.cv_blob,
            grades_blob: student.grades_blob,
          }))
          .flat()
          .filter((blob) => blob.cv_blob || blob.grades_blob)
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

async function deleteFiles(blobs: { cv_blob?: string; grades_blob?: string }[]) {
  logger.warn(
    {
      action: 'deleteFiles',
      blobs,
    },
    'Deleting files'
  );

  for (const blob of blobs) {
    if (blob.cv_blob) {
      await deleteByUrl(blob.cv_blob);
    }
    if (blob.grades_blob) {
      await deleteByUrl(blob.grades_blob);
    }
  }
}
