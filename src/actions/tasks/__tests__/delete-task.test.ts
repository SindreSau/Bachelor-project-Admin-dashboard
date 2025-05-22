import { prismaMock } from '../../../../singleton';
import { deleteTask } from '@/actions/tasks/delete-task';
import { revalidatePath } from 'next/cache';

jest.mock('../../../lib/prisma', () => ({
  db: prismaMock,
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('deleteTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('soft deletes a task and revalidates paths', async () => {
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
    const updatedTask = { ...mockTask, published: false, deletedAt: new Date() };

    prismaMock.task.findUnique.mockResolvedValue(mockTask);
    prismaMock.task.update.mockResolvedValue(updatedTask);

    const result = await deleteTask(1);

    expect(prismaMock.task.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prismaMock.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { deletedAt: expect.any(Date), published: false },
    });
    expect(revalidatePath).toHaveBeenCalledWith('/oppgaver');
    expect(result).toEqual({ success: true });
  });

  it('returns error if task not found', async () => {
    prismaMock.task.findUnique.mockResolvedValue(null);

    const result = await deleteTask(2);

    expect(prismaMock.task.findUnique).toHaveBeenCalledWith({ where: { id: 2 } });
    expect(result.success).toBe(false);
    expect(result.error).toBe('Task not found');
    expect(prismaMock.task.update).not.toHaveBeenCalled();
  });

  it('returns error if update fails (deletedAt not set)', async () => {
    const mockTask = {
      id: 3,
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
    const updatedTask = { ...mockTask, published: false, deletedAt: null };

    prismaMock.task.findUnique.mockResolvedValue(mockTask);
    prismaMock.task.update.mockResolvedValue(updatedTask);

    const result = await deleteTask(3);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to delete task');
  });

  it('handles database errors gracefully', async () => {
    prismaMock.task.findUnique.mockRejectedValue(new Error('DB error'));

    const result = await deleteTask(4);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to delete task. Please try again.');
  });
});
