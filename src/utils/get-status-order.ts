import { STATUS_OPTIONS } from '@/lib/constants';

export const getStatusOrder = (status: string): number => {
  // Find the status key by matching the display value
  const statusKey = Object.keys(STATUS_OPTIONS).find(
    (key) => STATUS_OPTIONS[key as keyof typeof STATUS_OPTIONS].value === status
  );

  // Return the order if found, otherwise return a high number for unknown statuses
  return statusKey ? STATUS_OPTIONS[statusKey as keyof typeof STATUS_OPTIONS].order : 999;
};
