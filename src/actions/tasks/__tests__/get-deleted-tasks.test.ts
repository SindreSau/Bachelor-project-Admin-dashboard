import { prismaMock } from '../../../../singleton';
import { getDeletedTasks } from '@/actions/tasks/get-deleted-tasks';

jest.mock('../../../lib/prisma', () => ({
  db: prismaMock,
}));

describe('getDeletedTasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all deleted tasks with application counts', async () => {
    const mockTasks = [
      {
        id: 1,
        taskName: 'Deleted Task 1',
        taskDescription: 'Desc 1',
        deadline: new Date(),
        published: false,
        minStudents: 1,
        maxStudents: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        _count: { applications: 2 },
      },
      {
        id: 2,
        taskName: 'Deleted Task 2',
        taskDescription: 'Desc 2',
        deadline: new Date(),
        published: false,
        minStudents: 2,
        maxStudents: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        _count: { applications: 0 },
      },
      {
        id: 3,
        taskName: 'Not Deleted Task',
        taskDescription: 'Desc 3',
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

    const result = await getDeletedTasks();

    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      include: {
        _count: {
          select: { applications: true },
        },
      },
      where: { deletedAt: { not: null } },
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual(mockTasks);
  });

  it('returns empty array if no deleted tasks', async () => {
    prismaMock.task.findMany.mockResolvedValue([]);

    const result = await getDeletedTasks();

    expect(result).toEqual([]);
  });

  it('returns empty array if database throws', async () => {
    prismaMock.task.findMany.mockRejectedValue(new Error('DB error'));

    const result = await getDeletedTasks();

    expect(result).toEqual([]);
  });
});
