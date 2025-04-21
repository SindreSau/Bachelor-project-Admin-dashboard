import { prismaMock } from '../../../../singleton';
import { restoreTask } from '@/actions/tasks/restore-task';
import { revalidatePath } from 'next/cache';

jest.mock('../../../lib/prisma', () => ({
  db: prismaMock,
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('restoreTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('restores a deleted task and revalidates paths', async () => {
    const mockTask = {
      id: 1,
      taskName: 'Deleted Task',
      taskDescription: 'Desc',
      deadline: new Date(),
      published: false,
      minStudents: 1,
      maxStudents: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };

    prismaMock.task.findUnique.mockResolvedValue(mockTask);
    prismaMock.task.update.mockResolvedValue({ ...mockTask, deletedAt: null });

    const result = await restoreTask(1);

    expect(prismaMock.task.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prismaMock.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { deletedAt: null },
    });
    expect(revalidatePath).toHaveBeenCalledWith('/oppgaver');
    expect(result).toEqual({ success: true });
  });

  it('returns error if task not found', async () => {
    prismaMock.task.findUnique.mockResolvedValue(null);

    const result = await restoreTask(2);

    expect(prismaMock.task.findUnique).toHaveBeenCalledWith({ where: { id: 2 } });
    expect(result.success).toBe(false);
    expect(result.error).toBe('task not found');
    expect(prismaMock.task.update).not.toHaveBeenCalled();
  });

  it('handles database errors gracefully', async () => {
    prismaMock.task.findUnique.mockRejectedValue(new Error('DB error'));

    const result = await restoreTask(3);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to restore task. Please try again.');
  });
});
