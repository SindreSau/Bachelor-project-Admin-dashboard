import { prismaMock } from '../../../../singleton';
import { getAllTasks } from '@/actions/tasks/get-all-tasks';

jest.mock('../../../lib/prisma', () => ({
  db: prismaMock,
}));

describe('getAllTasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all tasks with application counts', async () => {
    const mockTasks = [
      {
        id: 1,
        taskName: 'Task 1',
        taskDescription: 'Desc 1',
        deadline: new Date(),
        published: true,
        minStudents: 1,
        maxStudents: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        _count: { applications: 2 },
      },
      {
        id: 2,
        taskName: 'Task 2',
        taskDescription: 'Desc 2',
        deadline: new Date(),
        published: false,
        minStudents: 2,
        maxStudents: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        _count: { applications: 0 },
      },
    ];
    prismaMock.task.findMany.mockResolvedValue(mockTasks);

    const result = await getAllTasks();

    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      include: {
        _count: {
          select: { applications: true },
        },
      },
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual(mockTasks);
  });

  it('returns empty array if database throws', async () => {
    prismaMock.task.findMany.mockRejectedValue(new Error('DB error'));

    const result = await getAllTasks();

    expect(result).toEqual([]);
  });
});
