import { prismaMock } from '../../../../singleton';
import { updateTask } from '@/actions/tasks/update-task';
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

describe('updateTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates a task and revalidates paths', async () => {
    const existingTask = {
      id: 1,
      taskName: 'Old Task',
      taskDescription: 'Old description',
      deadline: new Date(),
      published: true,
      minStudents: 1,
      maxStudents: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    const updatedTask = {
      id: 1,
      taskName: 'New Task',
      taskDescription: 'New description',
      deadline: new Date(),
      published: true,
      minStudents: 2,
      maxStudents: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    prismaMock.task.findUnique.mockResolvedValue(existingTask);
    prismaMock.task.update.mockResolvedValue(updatedTask);

    const result = await updateTask(1, {
      taskName: 'New Task',
      taskDescription: 'New description',
      deadline: updatedTask.deadline.toISOString(),
      minStudents: 2,
      maxStudents: 6,
    });

    expect(prismaMock.task.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: {
        taskName: true,
        taskDescription: true,
        deadline: true,
        minStudents: true,
        maxStudents: true,
      },
    });
    expect(prismaMock.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        taskName: 'New Task',
        taskDescription: 'New description',
        deadline: expect.any(Date),
        minStudents: 2,
        maxStudents: 6,
      },
    });
    expect(triggerRevalidation).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/oppgaver');
    expect(result).toEqual({ success: true, data: updatedTask });
  });

  it('returns error if task not found', async () => {
    prismaMock.task.findUnique.mockResolvedValue(null);

    const result = await updateTask(2, {
      taskName: 'Does not matter',
      taskDescription: 'Does not matter',
      deadline: null,
      minStudents: 1,
      maxStudents: 1,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Task not found');
    expect(prismaMock.task.update).not.toHaveBeenCalled();
  });

  it('returns error if update fails', async () => {
    const existingTask = {
      id: 1,
      taskName: 'Old Task',
      taskDescription: 'Old description',
      deadline: new Date(),
      published: true,
      minStudents: 1,
      maxStudents: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    prismaMock.task.findUnique.mockResolvedValue(existingTask);
    prismaMock.task.update.mockRejectedValue(new Error('DB error'));

    const result = await updateTask(3, {
      taskName: 'New Task',
      taskDescription: 'New description',
      deadline: null,
      minStudents: 2,
      maxStudents: 6,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to update task');
  });
});
