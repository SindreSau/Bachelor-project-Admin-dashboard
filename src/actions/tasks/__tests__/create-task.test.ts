import { prismaMock } from '../../../../singleton';
import { createTask } from '@/actions/tasks/create-task';
import { revalidatePath } from 'next/cache';
import triggerRevalidation from '@/actions/tasks/trigger-revalidate';

jest.mock('../../../lib/prisma', () => ({
  db: prismaMock,
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('@/actions/tasks/trigger-revalidate', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('createTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new task and revalidates paths', async () => {
    const mockTask = {
      id: 1,
      taskName: 'Test Task',
      taskDescription: 'A test task',
      deadline: new Date(),
      published: true,
      minStudents: 1,
      maxStudents: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    prismaMock.task.create.mockResolvedValue(mockTask);

    const input = {
      taskName: 'Test Task',
      taskDescription: 'A test task',
      deadline: new Date().toISOString(),
      published: true,
    };

    const result = await createTask(input);

    expect(prismaMock.task.create).toHaveBeenCalledWith({
      data: {
        taskName: input.taskName,
        taskDescription: input.taskDescription,
        deadline: expect.any(Date),
        published: input.published,
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith('/oppgaver');
    expect(triggerRevalidation).toHaveBeenCalled();
    expect(result).toEqual({ success: true, task: mockTask });
  });

  it('returns error if required fields are missing', async () => {
    const input = {
      taskName: '',
      taskDescription: '',
      deadline: null,
      published: false,
    };

    const result = await createTask(input);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to create task. Please try again.');
    expect(prismaMock.task.create).not.toHaveBeenCalled();
  });

  it('handles database errors gracefully', async () => {
    prismaMock.task.create.mockRejectedValue(new Error('DB error'));

    const input = {
      taskName: 'Test Task',
      taskDescription: 'A test task',
      deadline: null,
      published: false,
    };

    const result = await createTask(input);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to create task. Please try again.');
  });
});
