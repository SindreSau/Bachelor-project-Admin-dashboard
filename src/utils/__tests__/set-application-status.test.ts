import { prismaMock } from '../../../singleton';

jest.mock('../../lib/prisma', () => ({
  db: prismaMock,
}));

import setApplicationStatus from '@/utils/applications/set-application-status';
describe('setApplicationStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update the application status', async () => {
    // Mock the update method to resolve successfully
    (prismaMock.application.update as jest.Mock).mockResolvedValue({
      id: 1,
      status: 'Tilbud sendt',
    });

    // Call the function to test
    await setApplicationStatus(1, 'Tilbud sendt');

    // Verify that update was called with the correct parameters
    expect(prismaMock.application.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: 'Tilbud sendt' },
    });
  });

  it('should throw an error when the database update fails', async () => {
    // Mock the update method to reject with an error
    const errorMessage = 'Database error';

    (prismaMock.application.update as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Call the function and expect it to throw
    await expect(setApplicationStatus(999, 'Tilbud sendt')).rejects.toThrow();

    // Verify that update was called with the correct parameters
    expect(prismaMock.application.update).toHaveBeenCalledWith({
      where: { id: 999 },
      data: { status: 'Tilbud sendt' },
    });
  });
});
