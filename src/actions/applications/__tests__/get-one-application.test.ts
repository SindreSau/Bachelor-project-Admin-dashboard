import { prismaMock } from '../../../../singleton';
import { RequestLogger } from '../../../lib/logger.server';
import { Application, Student, Review, Task, Comment, File } from '@prisma/client';

// First mock the modules BEFORE importing the function that uses them
jest.mock('../../../lib/prisma', () => ({
  db: prismaMock,
}));

// Mock the auth wrapper
jest.mock('../../../lib/auth-and-log-wrapper', () => {
  const mockWithAuthAndLog = jest.fn((fn) => {
    // Store the inner function for testing
    (
      mockWithAuthAndLog as jest.Mock & {
        innerFn?: (logger: RequestLogger, ...args: unknown[]) => Promise<unknown>;
      }
    ).innerFn = fn;

    // Return a function that would normally handle auth
    return jest.fn(async (applicationId: number) => {
      // Simulate calling the inner function with a mock logger
      const mockLogger = {
        info: jest.fn(),
        error: jest.fn(),
      } as unknown as RequestLogger;
      return fn(mockLogger, applicationId);
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
import { getOneApplication } from '../../applications/get-one-application';
import { withAuthAndLog } from '../../../lib/auth-and-log-wrapper';

describe('getOneApplication', () => {
  // Get access to the inner function (the one that actually does the work)
  const innerFunction = (
    withAuthAndLog as unknown as {
      innerFn: (logger: RequestLogger, applicationId: number) => Promise<unknown>;
    }
  ).innerFn;

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear all mock implementations
    prismaMock.application.findUnique.mockReset();
  });

  test('should return application with related data when found', async () => {
    // Arrange: Set up our mock data
    const mockTasks = [
      {
        id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        taskName: 'Task 2',
        taskDescription: 'Description for Task 2',
        deadline: new Date(),
        published: true,
        minStudents: 1,
        maxStudents: 5,
        deletedAt: null,
      },
      {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        taskName: 'Task 1',
        taskDescription: 'Description for Task 1',
        deadline: new Date(),
        published: true,
        minStudents: 1,
        maxStudents: 5,
        deletedAt: null,
      },
      {
        id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        taskName: 'Task 3',
        taskDescription: 'Description for Task 3',
        deadline: new Date(),
        published: true,
        minStudents: 1,
        maxStudents: 5,
        deletedAt: null,
      },
    ] as Task[];

    const mockFiles = [
      {
        id: 1,
        studentId: 1,
        documentType: 'CV', // Replace with an appropriate value from $Enums.DocumentType
        storageUrl: 'https://example.com/file1',
        fileName: 'File 1',
        uploadedAt: new Date(),
      },
    ] as File[];

    const mockStudents = [
      {
        id: 1,
        firstName: 'Student 1',
        lastName: 'Test',
        email: 'student1@example.com',
        applicationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        files: mockFiles,
      },
    ] as (Student & { files: File[] })[];

    const mockReviews = [
      {
        id: 1,
        applicationId: 1,
        review: 'THUMBS_UP',
        kindeUserId: 'user-1',
        kindeGivenName: 'John',
        kindeFamilyName: 'Doe',
        kindeUserImage: 'image-url',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as Review[];

    const mockComments = [
      {
        id: 1,
        createdAt: new Date(),
        applicationId: 1,
        kindeUserId: 'user-1',
        kindeGivenName: 'John',
        kindeFamilyName: 'Doe',
        kindeUserImage: 'image-url',
        commentText: 'Comment 1',
        deletedAt: null,
      },
    ] as Comment[];

    const taskPriorityIds = [1, 2, 3]; // Order: Task 1, Task 2, Task 3

    const mockApplication = {
      id: 1,
      coverLetterText: 'Cover letter text',
      school: 'OsloMet',
      status: 'Påbegynt',
      taskpriorityids: taskPriorityIds,
      studentRepresentativeId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      students: mockStudents,
      studentRepresentative: mockStudents[0],
      reviews: mockReviews,
      tasks: mockTasks,
      comments: mockComments,
    } as Application & {
      students: (Student & { files: File[] })[];
      studentRepresentative: Student | null;
      reviews: Review[];
      tasks: Task[];
      comments: Comment[];
    };

    // Configure the prismaMock to return our test data
    prismaMock.application.findUnique.mockResolvedValue(mockApplication);

    // Act: Call the inner function directly with our mock logger and application ID
    const result = await innerFunction(mockLogger, 1);

    // Assert: Verify the results match what we expect
    expect(result).toBeDefined();

    // Check that the tasks are sorted correctly according to taskPriorityIds
    const sortedResult = result as typeof mockApplication;
    expect(sortedResult.tasks[0].id).toBe(1); // First task should be 1
    expect(sortedResult.tasks[1].id).toBe(2); // Second task should be 2
    expect(sortedResult.tasks[2].id).toBe(3); // Third task should be 3

    // Verify the database was called with the right parameters
    expect(prismaMock.application.findUnique).toHaveBeenCalledWith({
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

    // Verify logging occurred
    expect(mockLogger.info).toHaveBeenCalledWith(
      {
        details: {
          action: 'getOneApplication',
          applicationId: 1,
          studentsCount: mockApplication.students.length,
          tasksCount: mockApplication.tasks.length,
          commentsCount: mockApplication.comments.length,
          reviewsCount: mockApplication.reviews.length,
        },
      },
      'Successfully fetched application with relations'
    );
  });

  test('should return null when application is not found', async () => {
    // Configure the prismaMock to return null (application not found)
    prismaMock.application.findUnique.mockResolvedValue(null);

    // Act: Call the inner function directly with our mock logger and application ID
    const result = await innerFunction(mockLogger, 999);

    // Assert: Verify the result is null
    expect(result).toBeNull();

    // Verify logging occurred
    expect(mockLogger.info).toHaveBeenCalledWith(
      { action: 'getOneApplication', applicationId: 999 },
      'Application not found'
    );
  });

  test('should throw error when database query fails', async () => {
    // Arrange: Configure the mock to throw an error
    const mockError = new Error('Database connection failed');
    prismaMock.application.findUnique.mockRejectedValue(mockError);

    // Act & Assert: The function should throw the error
    await expect(innerFunction(mockLogger, 1)).rejects.toThrow('Database connection failed');

    // Verify error logging occurred
    expect(mockLogger.error).toHaveBeenCalledWith(
      {
        action: 'getOneApplication',
        applicationId: 1,
        error: expect.objectContaining({
          message: 'Database connection failed',
        }),
      },
      'Failed to fetch application'
    );
  });

  test('wrapped function should be properly exported', () => {
    // Verify that the exported function exists and is a function
    expect(getOneApplication).toBeDefined();
    expect(typeof getOneApplication).toBe('function');
  });
});
