import { prismaMock } from '../../../../singleton';
import { getUnpublishedTasks } from '@/actions/tasks/get-unpublished-tasks';

jest.mock('../../../lib/prisma', () => ({
  db: prismaMock,
}));

describe('getUnpublishedTasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all unpublished tasks with application counts', async () => {
    const mockTasks = [
      {
        id: 1,
        taskName: 'Unpublished Task 1',
        taskDescription: 'Desc 1',
        deadline: new Date(),
        published: false,
        minStudents: 1,
        maxStudents: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        _count: { applications: 2 },
      },
      {
        id: 2,
        taskName: 'Unpublished Task 2',
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
      // This task is published and should not be included in the result
      {
        id: 3,
        taskName: 'Published Task for testing',
        taskDescription: 'Desc 2',
        deadline: new Date(),
        published: true,
        minStudents: 2,
        maxStudents: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        _count: { applications: 0 },
      },
    ];
    prismaMock.task.findMany.mockResolvedValue(mockTasks);

    const result = await getUnpublishedTasks();

    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      include: {
        _count: {
          select: { applications: true },
        },
      },
      where: { deletedAt: null, published: false },
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual(mockTasks);
  });

  it('returns empty array if database throws', async () => {
    prismaMock.task.findMany.mockRejectedValue(new Error('DB error'));

    const result = await getUnpublishedTasks();

    expect(result).toEqual([]);
  });
});
