import { prismaMock } from '@/../singleton';
import {
  deleteAllApplications,
  DeleteAllApplicationsResult,
} from '@/actions/applications/delete-all-applications';
import { deleteAll } from '@/utils/blobstorage/delete-files';

jest.mock('../../../lib/prisma', () => ({
  db: prismaMock,
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('@/utils/blobstorage/delete-files', () => ({
  deleteAll: jest.fn(),
}));

describe('deleteAllApplications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully delete all applications and blobs', async () => {
    // Arrange
    prismaMock.application.deleteMany.mockResolvedValue({ count: 5 });
    (deleteAll as jest.Mock).mockResolvedValue(undefined);
    prismaMock.$transaction.mockImplementation(async (callback) => {
      return await callback(prismaMock);
    });

    // Act
    const result = (await deleteAllApplications()) as DeleteAllApplicationsResult;

    // Assert
    expect(result.success).toBe(true);
    expect(prismaMock.application.deleteMany).toHaveBeenCalledWith({});
    expect(deleteAll).toHaveBeenCalled();
  });

  it('should handle DB errors gracefully', async () => {
    // Arrange
    prismaMock.$transaction.mockRejectedValue(new Error('DB error'));

    // Act
    const result = (await deleteAllApplications()) as DeleteAllApplicationsResult;

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to delete all applications');
    expect(deleteAll).not.toHaveBeenCalled();
  });

  it('should handle errors from deleteAll (blob deletion)', async () => {
    // Arrange
    prismaMock.application.deleteMany.mockResolvedValue({ count: 5 });
    (deleteAll as jest.Mock).mockRejectedValue(new Error('Blob error'));
    prismaMock.$transaction.mockImplementation(async (callback) => {
      return await callback(prismaMock);
    });

    // Act
    const result = (await deleteAllApplications()) as DeleteAllApplicationsResult;

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe('Blob error');
    expect(prismaMock.application.deleteMany).toHaveBeenCalled();
    expect(deleteAll).toHaveBeenCalled();
  });
});
