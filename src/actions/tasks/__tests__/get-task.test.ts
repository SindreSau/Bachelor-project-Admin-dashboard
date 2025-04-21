import { prismaMock } from '../../../../singleton';
import { getTask } from '@/actions/tasks/get-task';

jest.mock('../../../lib/prisma', () => ({
  db: prismaMock,
}));

describe('getTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the task with applications if found', async () => {
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
      applications: [{ id: 10 }, { id: 11 }],
    };
    prismaMock.task.findUnique.mockResolvedValue(mockTask);

    const result = await getTask(1);

    expect(prismaMock.task.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { applications: true },
    });
    expect(result).toEqual(mockTask);
  });

  it('returns null if task not found', async () => {
    prismaMock.task.findUnique.mockResolvedValue(null);

    const result = await getTask(2);

    expect(result).toBeNull();
  });

  it('returns null if database throws', async () => {
    prismaMock.task.findUnique.mockRejectedValue(new Error('DB error'));

    const result = await getTask(3);

    expect(result).toBeNull();
  });
});
