import { getStatusOrder } from '../get-status-order';

jest.mock(
  '@/lib/constants',
  () => ({
    STATUS_OPTIONS: {
      NOT_STARTED: { value: 'Ikke påbegynt', order: 1 },
      IN_PROGRESS: { value: 'Påbegynt', order: 2 },
      REVIEWED: { value: 'Vurdert av alle', order: 3 },
      INVITED_TO_INTERVIEW: { value: 'Kalles inn til intervju', order: 4 },
      INTERVIEW_SCHEDULED: { value: 'Intervju satt opp', order: 5 },
      INTERVIEW_COMPLETED: { value: 'Intervju gjennomført', order: 6 },
      OFFER_SENT: { value: 'Tilbud sendt', order: 7 },
      OFFER_ACCEPTED: { value: 'Tilbud akseptert', order: 8 },
      REJECTED: { value: 'Avslag', order: 9 },
    },
  }),
  { virtual: true }
);

describe('getStatusOrder', () => {
  it('should return the correct order for valid status values', () => {
    expect(getStatusOrder('Ikke påbegynt')).toBe(1);
    expect(getStatusOrder('Påbegynt')).toBe(2);
    expect(getStatusOrder('Vurdert av alle')).toBe(3);
    expect(getStatusOrder('Kalles inn til intervju')).toBe(4);
    expect(getStatusOrder('Intervju satt opp')).toBe(5);
    expect(getStatusOrder('Intervju gjennomført')).toBe(6);
    expect(getStatusOrder('Tilbud sendt')).toBe(7);
    expect(getStatusOrder('Tilbud akseptert')).toBe(8);
    expect(getStatusOrder('Avslag')).toBe(9);
  });

  it('should return a high number for unknown status values', () => {
    expect(getStatusOrder('Unknown Status')).toBe(999);
  });
});
