import { prismaMock } from '../../../../singleton';
import { RequestLogger } from '@/lib/logger.server';
import { Application, Student, Review } from '@prisma/client';

// First mock the modules before importing the function that uses them
jest.mock('../../../lib/prisma', () => ({
  db: prismaMock, // Use the prismaMock from singleton here!
}));

// Mock the auth wrapper
jest.mock('../../../lib/auth-and-log-wrapper', () => {
  const mockWithAuthAndLog = jest.fn((fn) => {
    // Store the inner function for testing
    (
      mockWithAuthAndLog as jest.Mock & { innerFn?: (logger: RequestLogger) => Promise<unknown> }
    ).innerFn = fn;

    // Return a function that would normally handle auth
    return jest.fn(async () => {
      // Simulate calling the inner function with a mock logger
      const mockLogger = {
        info: jest.fn(),
        error: jest.fn(),
      } as unknown as RequestLogger;
      return fn(mockLogger);
    });
  });

  return { withAuthAndLog: mockWithAuthAndLog };
});

// Mock logger to avoid actual logging during tests
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as RequestLogger;

// IMPORTANT: Import the function after mocking its dependencies!
import getAllApplications from '@/actions/applications/get-all-applications';
import { withAuthAndLog } from '@/lib/auth-and-log-wrapper';

describe('getAllApplications', () => {
  // Get access to the inner function (the one that actually does the work)
  const innerFunction = (
    withAuthAndLog as unknown as { innerFn: (logger: RequestLogger) => Promise<unknown> }
  ).innerFn;

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear all mock implementations
    prismaMock.application.findMany.mockReset();
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
    console.log('Mocked applications:', mockApplications);

    // Act: Call the inner function directly with our mock logger
    const result = await innerFunction(mockLogger);

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
    expect(mockLogger.info).toHaveBeenCalledWith(
      {
        details: {
          count: mockApplications.length,
          includes: ['students', 'reviews'],
        },
      },
      'Fetched all applications'
    );
  });

  test('should return empty array when DB query fails', async () => {
    // Arrange: Configure the mock to throw an error
    const mockError = new Error('Database connection failed');
    prismaMock.application.findMany.mockRejectedValue(mockError);

    // Act: Call the inner function directly with our mock logger
    const result = await innerFunction(mockLogger);

    // Assert: Verify error handling
    expect(result).toEqual([]);
    expect(mockLogger.error).toHaveBeenCalledWith(
      { error: mockError },
      'Failed to fetch all applications'
    );
  });

  test('should handle non-Error thrown objects', async () => {
    // Arrange: Configure the mock to throw a non-Error object
    prismaMock.application.findMany.mockRejectedValue('String error');

    // Act: Call the inner function directly with our mock logger
    const result = await innerFunction(mockLogger);

    // Assert: Verify error handling converts non-Error to Error
    expect(result).toEqual([]);
    expect(mockLogger.error).toHaveBeenCalledWith(
      { error: expect.any(Error) },
      'Failed to fetch all applications'
    );
  });

  test('wrapped function should be properly exported', () => {
    // Just verify that the exported function exists and is a function
    expect(getAllApplications).toBeDefined();
    expect(typeof getAllApplications).toBe('function');

    // Optionally verify it's the mock function we created
    // by checking if it has mock properties
    // Verify that the exported function exists and is callable
    expect(getAllApplications).toBeDefined();
    expect(typeof getAllApplications).toBe('function');
  });
});
