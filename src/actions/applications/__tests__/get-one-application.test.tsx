// src/app/actions/applications/getOneApplication.test.ts
import { getOneApplication } from '@/actions/applications/get-one-application';
import { prismaMock } from '@/../singleton';

// Mock dependencies
jest.mock('../../../lib/prisma', () => ({
  db: prismaMock,
}));

describe('getOneApplication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch an application without requiring authentication in test environment', async () => {
    // Arrange
    const mockApplication = {
      id: 1,
      name: 'Test Application',
      taskpriorityids: [3, 1, 2],
      students: [{ id: 1, name: 'Test Student', files: [] }],
      studentRepresentative: { id: 1, name: 'Test Representative' },
      reviews: [],
      tasks: [
        { id: 1, name: 'Task 1' },
        { id: 2, name: 'Task 2' },
        { id: 3, name: 'Task 3' },
      ],
      comments: [],
    };

    // Mock the Prisma findUnique method to return our test data
    const mockFindUnique = prismaMock.application.findUnique as jest.Mock;
    mockFindUnique.mockResolvedValue(mockApplication);

    // Act
    const result = await getOneApplication(1);

    // Assert
    // 1. Verify the database was called with correct parameters
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        students: {
          include: {
            files: true,
          },
        },
        studentRepresentative: true,
        reviews: true,
        tasks: true,
        comments: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    // 2. Verify the authentication was bypassed (function executed successfully)
    expect(result).not.toBeNull();

    // 3. Verify tasks were sorted properly
    expect(result?.tasks[0].id).toBe(3); // First in priority list
    expect(result?.tasks[1].id).toBe(1); // Second in priority list
    expect(result?.tasks[2].id).toBe(2); // Third in priority list
  });

  it('should return null for non-existent application', async () => {
    // Arrange
    const mockFindUnique = prismaMock.application.findUnique as jest.Mock;
    mockFindUnique.mockResolvedValue(null);

    // Act
    const result = await getOneApplication(999);

    // Assert
    expect(result).toBeNull();
  });

  it('should handle errors properly', async () => {
    // Arrange
    const mockError = new Error('Database error');
    const mockFindUnique = prismaMock.application.findUnique as jest.Mock;
    mockFindUnique.mockRejectedValue(mockError);

    // Act & Assert
    await expect(getOneApplication(1)).rejects.toThrow('Database error');
  });
});
