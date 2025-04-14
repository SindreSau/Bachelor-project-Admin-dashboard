import getApplicationStatus from '@/utils/applications/get-application-status';
import { db } from '@/lib/prisma';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        application: {
          findUnique: jest.fn(),
        },
      };
    }),
  };
});

jest.mock(
  '@/lib/prisma',
  () => {
    return {
      db: {
        application: {
          findUnique: jest.fn(),
        },
      },
    };
  },
  { virtual: true }
);

describe('getApplicationStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the application status when application exists', async () => {
    (db.application.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      status: 'Påbegynt',
    });

    const status = await getApplicationStatus(1);
    expect(status).toBe('Påbegynt');
    expect(db.application.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should return undefined when application does not exist', async () => {
    (db.application.findUnique as jest.Mock).mockResolvedValue(null);

    const status = await getApplicationStatus(999);
    expect(status).toBeUndefined();
    expect(db.application.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });
});
