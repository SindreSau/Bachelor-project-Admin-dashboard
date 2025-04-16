import { prismaMock } from '../../../singleton';

jest.mock('../../lib/prisma', () => ({
  db: prismaMock,
}));

import getApplicationStatus from '@/utils/applications/get-application-status';
describe('getApplicationStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the application status when application exists', async () => {
    (prismaMock.application.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      status: 'Påbegynt',
    });

    const status = await getApplicationStatus(1);
    expect(status).toBe('Påbegynt');
    expect(prismaMock.application.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should return undefined when application does not exist', async () => {
    (prismaMock.application.findUnique as jest.Mock).mockResolvedValue(null);

    const status = await getApplicationStatus(999);
    expect(status).toBeUndefined();
    expect(prismaMock.application.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });
});
