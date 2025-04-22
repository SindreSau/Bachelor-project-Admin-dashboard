import { prismaMock } from '@/../singleton';
import {
  deleteApplication,
  DeleteApplicationResult,
} from '@/actions/applications/delete-application';
import { deleteByUrl } from '@/utils/blobstorage/delete-files';
import type { DocumentType } from '@prisma/client';

// Mock dependencies
jest.mock('../../../lib/prisma', () => ({
  db: prismaMock,
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('@/utils/blobstorage/delete-files', () => ({
  deleteByUrl: jest.fn(),
}));

describe('deleteApplication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully delete an application and its associated files', async () => {
    // Arrange
    const applicationId = 1;

    // Mock files to be deleted with all required properties
    const mockFiles: Array<{
      id: number;
      studentId: number;
      documentType: DocumentType;
      storageUrl: string;
      fileName: string;
      uploadedAt: Date;
    }> = [
      {
        id: 1,
        studentId: 101,
        documentType: 'CV' as DocumentType,
        storageUrl: 'https://storage.com/file1.pdf',
        fileName: 'resume.pdf',
        uploadedAt: new Date(),
      },
      {
        id: 2,
        studentId: 102,
        documentType: 'COVER_LETTER' as DocumentType,
        storageUrl: 'https://storage.com/file2.pdf',
        fileName: 'cover-letter.pdf',
        uploadedAt: new Date(),
      },
    ];

    // Mock the application to be deleted
    const mockApplication = {
      id: applicationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      coverLetterText: 'Sample cover letter',
      school: 'Test School',
      taskpriorityids: [1, 2, 3],
      studentRepresentativeId: 42,
      status: 'Påbegynt',
    };

    // Set up necessary mocks
    prismaMock.file.findMany.mockResolvedValue(mockFiles);
    prismaMock.application.findUnique.mockResolvedValue(mockApplication);
    prismaMock.application.delete.mockResolvedValue(mockApplication);
    (deleteByUrl as jest.Mock).mockResolvedValue(undefined);

    // Configure transaction mock
    prismaMock.$transaction.mockImplementation(async (callback) => {
      return await callback(prismaMock);
    });

    // Act
    const result = (await deleteApplication(applicationId)) as DeleteApplicationResult;

    // Assert
    expect(result.success).toBe(true);

    // Verify file query happened
    expect(prismaMock.file.findMany).toHaveBeenCalledWith({
      where: {
        student: {
          applicationId: applicationId,
        },
      },
      select: {
        storageUrl: true,
      },
    });

    // Verify application was checked
    expect(prismaMock.application.findUnique).toHaveBeenCalledWith({
      where: { id: applicationId },
    });

    // Verify the delete was called with correct parameters
    expect(prismaMock.application.delete).toHaveBeenCalledWith({
      where: { id: applicationId },
    });

    // Verify blob deletion was called for each file
    expect(deleteByUrl).toHaveBeenCalledTimes(2);
    expect(deleteByUrl).toHaveBeenCalledWith('https://storage.com/file1.pdf');
    expect(deleteByUrl).toHaveBeenCalledWith('https://storage.com/file2.pdf');
  });

  it('should handle non-existent application gracefully', async () => {
    // Arrange
    const applicationId = 999;

    // Mock files (none found)
    prismaMock.file.findMany.mockResolvedValue([]);

    // Mock application not found
    prismaMock.application.findUnique.mockResolvedValue(null);

    // Setup transaction to return null when application is not found
    prismaMock.$transaction.mockImplementation(async (callback) => {
      return await callback(prismaMock);
    });

    // Act
    const result = (await deleteApplication(applicationId)) as DeleteApplicationResult;

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe('Application not found');

    // Verify application was checked
    expect(prismaMock.application.findUnique).toHaveBeenCalledWith({
      where: { id: applicationId },
    });

    // Verify delete was not called
    expect(prismaMock.application.delete).not.toHaveBeenCalled();

    // Verify blob deletion was not attempted
    expect(deleteByUrl).not.toHaveBeenCalled();
  });

  it('should handle errors during file deletion but still succeed overall', async () => {
    // Arrange
    const applicationId = 1;

    // Mock files to be deleted with all required properties
    const mockFiles: Array<{
      id: number;
      studentId: number;
      documentType: DocumentType;
      storageUrl: string;
      fileName: string;
      uploadedAt: Date;
    }> = [
      {
        id: 1,
        studentId: 101,
        documentType: 'CV' as DocumentType,
        storageUrl: 'https://storage.com/file1.pdf',
        fileName: 'resume.pdf',
        uploadedAt: new Date(),
      },
      {
        id: 2,
        studentId: 102,
        documentType: 'COVER_LETTER' as DocumentType,
        storageUrl: 'https://storage.com/file2.pdf',
        fileName: 'cover-letter.pdf',
        uploadedAt: new Date(),
      },
    ];

    // Mock the application to be deleted
    const mockApplication = {
      id: applicationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      coverLetterText: 'Sample cover letter',
      school: 'Test School',
      taskpriorityids: [1, 2, 3],
      studentRepresentativeId: 42,
      status: 'Påbegynt',
    };

    // Set up necessary mocks
    prismaMock.file.findMany.mockResolvedValue(mockFiles);
    prismaMock.application.findUnique.mockResolvedValue(mockApplication);
    prismaMock.application.delete.mockResolvedValue(mockApplication);

    // Make the first file deletion fail
    (deleteByUrl as jest.Mock).mockImplementation((url) => {
      if (url === 'https://storage.com/file1.pdf') {
        return Promise.reject(new Error('Failed to delete blob'));
      }
      return Promise.resolve();
    });

    // Configure transaction mock
    prismaMock.$transaction.mockImplementation(async (callback) => {
      return await callback(prismaMock);
    });

    // Act
    const result = (await deleteApplication(applicationId)) as DeleteApplicationResult;

    // Assert
    expect(result.success).toBe(true);

    // Verify delete was called despite file deletion error
    expect(prismaMock.application.delete).toHaveBeenCalledWith({
      where: { id: applicationId },
    });

    // Verify both blob deletions were attempted
    expect(deleteByUrl).toHaveBeenCalledTimes(2);
  });

  it('should handle database errors properly', async () => {
    // Arrange
    const applicationId = 1;

    // Mock files query
    prismaMock.file.findMany.mockResolvedValue([
      {
        id: 1,
        studentId: 101,
        documentType: 'CV',
        storageUrl: 'https://storage.com/file1.pdf',
        fileName: 'resume.pdf',
        uploadedAt: new Date(),
      },
    ]);

    // Mock a database error during transaction
    const dbError = new Error('Database connection error');
    prismaMock.$transaction.mockRejectedValue(dbError);

    // Act
    const result = (await deleteApplication(applicationId)) as DeleteApplicationResult;

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe('Database connection error');

    // Verify blob deletion was not called as transaction failed
    expect(deleteByUrl).not.toHaveBeenCalled();
  });
});
