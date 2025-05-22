import { prismaMock } from '../../../../singleton';
import { changePublishStatus } from '@/actions/tasks/change-publish-status';
import { revalidatePath } from 'next/cache';
import triggerRevalidate from '@/actions/tasks/trigger-revalidate';

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

describe('changePublishStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update the publish status and revalidate paths', async () => {
    prismaMock.task.update.mockResolvedValue({
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
    });

    const result = await changePublishStatus(1, true);

    expect(prismaMock.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { published: true },
    });
    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
    // Optionally check revalidation calls
    expect(revalidatePath).toHaveBeenCalledWith('/oppgaver');
    expect(triggerRevalidate).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    prismaMock.task.update.mockRejectedValue(new Error('DB error'));

    const result = await changePublishStatus(2, false);

    expect(prismaMock.task.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { published: false },
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to change publish status. Please try again.');
  });
});
