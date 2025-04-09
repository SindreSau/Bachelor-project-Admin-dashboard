// ===== GLOBAL VARIABLES ===== //

export const MAX_STUDENTS = 5;
export const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB

export const STATUS_OPTIONS = {
  NOT_STARTED: { value: 'Ikke påbegynt', order: 1 },
  IN_PROGRESS: { value: 'Påbegynt', order: 2 },
  REVIEWED: { value: 'Vurdert av alle', order: 3 },
  INVITED_TO_INTERVIEW: { value: 'Kalles inn til intervju', order: 4 },
  INTERVIEW_SCHEDULED: { value: 'Intervju satt opp', order: 5 },
  INTERVIEW_COMPLETED: { value: 'Intervju gjennomført', order: 6 },
  OFFER_SENT: { value: 'Tilbud sendt', order: 7 },
  OFFER_ACCEPTED: { value: 'Tilbud akseptert', order: 8 },
  REJECTED: { value: 'Avslag', order: 9 },
};
