import { prismaMock } from '../../../../singleton';
// import { db } from '@/lib/prisma';
// import { Application, Student, Review } from '@prisma/client';
import getAllApplications from '@/actions/applications/get-all-applications';

jest.mock('../../../lib/prisma', () => ({
  db: prismaMock,
}));

describe('getAllApplications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return applications with related data when DB query succeeds', async () => {
    // Arrange
    const mockApplications = {
      id: 1,
      coverLetterText: 'Cover letter text',
      school: 'OsloMet' as string | null,
      createdAt: new Date(),
      updatedAt: new Date(),
      taskpriorityids: [] as number[],
      studentRepresentativeId: 1 as number | null,
      status: 'Påbegynt',
      students: [
        {
          id: 1,
          firstName: 'Student 1',
          lastName: 'Test',
          createdAt: new Date(),
          updatedAt: new Date(),
          email: 'email@email.com',
          applicationId: 1,
        },
      ],
      reviews: [
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          applicationId: 1,
          review: null,
          kindeUserId: 'user-1',
          kindeGivenName: 'John',
          kindeFamilyName: 'Doe',
          kindeUserImage: 'image-url',
        },
      ],
    };

    prismaMock.application.findMany.mockResolvedValue([mockApplications]);

    // Act
    const result = await getAllApplications();

    // Assert
    expect(result).toEqual([mockApplications]);
    expect(prismaMock.application.findMany).toHaveBeenCalledWith({
      include: {
        students: true,
        reviews: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  test('should return empty array when DB query fails', async () => {
    // Arrange
    const mockError = new Error('Database connection failed');
    prismaMock.application.findMany.mockRejectedValue(mockError);

    // Act: Call the inner function directly with our mock logger
    const result = await getAllApplications();

    // Assert: Verify error handling
    expect(result).toEqual([]);
  });

  test('should handle non-Error thrown objects', async () => {
    // Arrange: Configure the mock to throw a non-Error object
    prismaMock.application.findMany.mockRejectedValue('String error');

    // Act: Call the inner function directly with our mock logger
    const result = await getAllApplications();

    // Assert: Verify error handling converts non-Error to Error
    expect(result).toEqual([]);
  });

  // TODO: Decide if this test is necessary
  test('should complete within a reasonable time frame', async () => {
    // Arrange
    const mockApplications = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      coverLetterText: `Cover letter text ${i + 1}`,
      school: 'OsloMet' as string | null,
      createdAt: new Date(),
      updatedAt: new Date(),
      taskpriorityids: [] as number[],
      studentRepresentativeId: (i + 1) as number | null,
      status: 'Påbegynt',
      students: [
        {
          id: i + 1,
          firstName: `Student ${i + 1}`,
          lastName: 'Test',
          createdAt: new Date(),
          updatedAt: new Date(),
          email: `email${i + 1}@email.com`,
          applicationId: i + 1,
        },
      ],
      reviews: [
        {
          id: i + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          applicationId: i + 1,
          review: null,
          kindeUserId: `user-${i + 1}`,
          kindeGivenName: `John ${i + 1}`,
          kindeFamilyName: `Doe ${i + 1}`,
          kindeUserImage: `image-url-${i + 1}`,
        },
      ],
    }));

    prismaMock.application.findMany.mockResolvedValue(mockApplications);

    // Act
    const startTime = performance.now();
    const result = await getAllApplications();
    const endTime = performance.now();

    // Assert
    expect(result).toEqual(mockApplications);
    expect(prismaMock.application.findMany).toHaveBeenCalledWith({
      include: {
        students: true,
        reviews: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const time = endTime - startTime;
    console.log(time);
    expect(time).toBeLessThan(100); // Ensure it completes within 100ms
  });
});
