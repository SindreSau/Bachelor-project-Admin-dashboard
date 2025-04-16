import { prismaMock } from '../../../../singleton';
// import { Application, Student, Review } from '@prisma/client';
import getAllApplications from '@/actions/applications/get-all-applications';

// First mock the modules before importing the function that uses them
jest.mock('../../../lib/prisma', () => ({
  db: prismaMock, // Use the prismaMock from singleton here!
}));

// IMPORTANT: Import the function after mocking its dependencies!
describe('getAllApplications', () => {
  // Get access to the inner function (the one that actually does the work)

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return applications with related data when DB query succeeds', async () => {
    // Arrange: Set up our mock data
    const mockApplications = [
      {
        id: 1,
        coverLetterText: 'Cover letter text',
        school: 'OsloMet',
        createdAt: new Date(),
        updatedAt: new Date(),
        taskpriorityids: [] as number[],
        studentRepresentativeId: 1,
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
        ] as Student[],
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
        ] as Review[],
      },
    ] as (Application & { students: Student[]; reviews: Review[] })[];

    // Configure the prismaMock to return our test data
    prismaMock.application.findMany.mockResolvedValue(mockApplications);

    // Act: Call the inner function directly with our mock logger
    const result = await getAllApplications();
    console.log('result', result);

    // Assert: Verify the results match what we expect
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
  });

  test('should return empty array when DB query fails', async () => {
    // Arrange: Configure the mock to throw an error
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
    console.log('result', result);

    // Assert: Verify error handling converts non-Error to Error
    expect(result).toEqual([]);
  });
});
