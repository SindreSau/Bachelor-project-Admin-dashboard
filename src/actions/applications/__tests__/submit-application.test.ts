import { prismaMock } from '@/../singleton';
import submitApplication from '@/actions/applications/submit-application';
import { sendConfirmationEmail } from '@/actions/email/send-email';
import { DocumentType } from '@prisma/client';
import { ApplicationData } from '@/app/api/applications/route';

// Mock dependencies
jest.mock('../../../lib/prisma', () => ({
  db: prismaMock,
}));

jest.mock('@/actions/email/send-email', () => ({
  sendConfirmationEmail: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// Mock sample data
const mockApplicationData: ApplicationData = {
  school: 'Test University',
  coverLetter: 'This is a cover letter for testing purposes',
  prioritizedTasks: [1, 2, 3],
  students: [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      cv_blob: 'https://storage.com/cv1.pdf',
      grades_blob: 'https://storage.com/grades1.pdf',
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      cv_blob: 'https://storage.com/cv2.pdf',
      grades_blob: 'https://storage.com/grades2.pdf',
    },
  ],
  groupLeader: 0, // First student is the group leader
};

describe('submitApplication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully submit an application', async () => {
    // Arrange
    const mockApplication = {
      id: 123,
      coverLetterText: mockApplicationData.coverLetter,
      school: mockApplicationData.school,
      taskpriorityids: mockApplicationData.prioritizedTasks,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'Påbegynt',
      studentRepresentativeId: null,
    };

    const mockStudents = [
      {
        id: 101,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        applicationId: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 102,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        applicationId: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Setup Prisma mocks
    prismaMock.application.create.mockResolvedValue(mockApplication);
    prismaMock.student.create
      .mockResolvedValueOnce(mockStudents[0])
      .mockResolvedValueOnce(mockStudents[1]);
    prismaMock.file.create.mockResolvedValue({
      id: 1,
      fileName: 'cv1.pdf',
      storageUrl: 'https://storage.com/file.pdf',
      documentType: DocumentType.CV,
      studentId: 101,
      uploadedAt: new Date(),
    });
    prismaMock.application.update.mockResolvedValue({
      ...mockApplication,
      studentRepresentativeId: mockStudents[0].id,
    });

    // Mock email sending success
    (sendConfirmationEmail as jest.Mock).mockResolvedValue({
      data: { id: 'email-123' },
      error: null,
    });

    // Configure transaction mock
    prismaMock.$transaction.mockImplementation(async (callback) => {
      return await callback(prismaMock);
    });

    // Act
    const result = await submitApplication(mockApplicationData);

    // Assert
    expect(result.success).toBe(true);
    expect(result.message).toBe('Application received successfully!');

    // Verify application was created with correct data
    expect(prismaMock.application.create).toHaveBeenCalledWith({
      data: {
        coverLetterText: mockApplicationData.coverLetter,
        school: mockApplicationData.school,
        taskpriorityids: {
          set: mockApplicationData.prioritizedTasks,
        },
        tasks: {
          connect: mockApplicationData.prioritizedTasks.map((taskId) => ({ id: taskId })),
        },
      },
    });

    // Verify student records were created
    expect(prismaMock.student.create).toHaveBeenCalledTimes(2);

    // Verify confirmation email was sent
    expect(sendConfirmationEmail).toHaveBeenCalledWith(
      mockApplicationData.students[0].email,
      mockApplicationData.students[0].firstName
    );
  });

  it('should handle database errors during application creation', async () => {
    // Arrange
    const dbError = new Error('Database connection error');

    // Mock transaction to throw an error
    prismaMock.$transaction.mockRejectedValue(dbError);

    // Act
    const result = await submitApplication(mockApplicationData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toContain('Failed to submit application');
    expect(result.message).toContain('Database connection error');
  });

  it('should handle errors during email sending', async () => {
    // Arrange
    const mockApplication = {
      id: 123,
      coverLetterText: mockApplicationData.coverLetter,
      school: mockApplicationData.school,
      taskpriorityids: mockApplicationData.prioritizedTasks,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'Påbegynt',
      studentRepresentativeId: null,
    };

    const mockStudents = [
      {
        id: 101,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        applicationId: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 102,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        applicationId: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    prismaMock.application.create.mockResolvedValue(mockApplication);
    prismaMock.student.create
      .mockResolvedValueOnce(mockStudents[0])
      .mockResolvedValueOnce(mockStudents[1]);
    prismaMock.file.create.mockResolvedValue({
      id: 1,
      fileName: 'cv1.pdf',
      storageUrl: 'https://storage.com/file.pdf',
      documentType: DocumentType.CV,
      studentId: 101,
      uploadedAt: new Date(),
    });
    prismaMock.application.update.mockResolvedValue({
      ...mockApplication,
      studentRepresentativeId: mockStudents[0].id,
    });

    // Mock email sending failure
    (sendConfirmationEmail as jest.Mock).mockResolvedValue({
      data: null,
      error: 'Failed to send email',
    });

    // Configure transaction to throw when email fails
    prismaMock.$transaction.mockImplementation(async (callback) => {
      try {
        await callback(prismaMock);
      } catch (error) {
        throw error;
      }
    });

    // Act
    const result = await submitApplication(mockApplicationData);

    // Assert
    expect(result.success).toBe(false);
    expect(result.message).toContain('Failed to send confirmation email');
  });
});
