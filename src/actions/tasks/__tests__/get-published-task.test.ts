import { prismaMock } from '../../../../singleton';
import { getPublishedTasks } from '@/actions/tasks/get-published-tasks';

jest.mock('../../../lib/prisma', () => ({
  db: prismaMock,
}));

describe('getPublishedTasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns published tasks', async () => {
    const mockTasks = [
      {
        id: 1,
        taskName: 'Task 1',
        taskDescription: 'Desc 1',
        deadline: new Date(),
        minStudents: 1,
        maxStudents: 5,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null,
        published: true,
      },
      {
        id: 2,
        taskName: 'Task 2',
        taskDescription: 'Desc 2',
        deadline: new Date(),
        minStudents: 2,
        maxStudents: 6,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null,
        published: true,
      },
    ];
    prismaMock.task.findMany.mockResolvedValue(mockTasks);

    const result = await getPublishedTasks();

    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      where: { published: true },
      omit: { updatedAt: true, createdAt: true, published: true },
      orderBy: { createdAt: 'asc' },
    });
    expect(result).toEqual(mockTasks);
  });

  it('returns empty array if database throws', async () => {
    prismaMock.task.findMany.mockRejectedValue(new Error('DB error'));

    const result = await getPublishedTasks();

    expect(result).toEqual([]);
  });
});
