import { Review } from '@prisma/client';

const getApplicationStatus = (reviews: Review[]) => {
  const reviewCount = reviews.length;

  if (reviewCount === 0) {
    return {
      text: 'Ikke begynt',
      className: 'text-danger',
    };
  }
  if (reviewCount >= 3) {
    return {
      text: 'Ferdig',
      className: 'text-confirm',
    };
  }
  return {
    text: 'Påbegynt',
    className: 'text-warning',
  };
};

export default getApplicationStatus;
