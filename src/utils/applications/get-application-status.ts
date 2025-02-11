import { Review } from '@prisma/client';

const getApplicationStatus = (reviews: Review[]) => {
  const reviewCount = reviews.length;

  if (reviewCount === 0) {
    return {
      text: 'Ikke begynt',
      className: 'text-red-500',
    };
  }
  if (reviewCount >= 3) {
    return {
      text: 'Ferdig',
      className: 'text-green-500',
    };
  }
  return {
    text: 'Påbegynt',
    className: 'text-yellow-500',
  };
};

export default getApplicationStatus;
