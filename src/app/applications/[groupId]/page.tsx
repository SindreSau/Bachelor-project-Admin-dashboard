'use client';

import { useParams } from 'next/navigation';

const ApplicationView = () => {
  const params = useParams();
  const groupId = params.groupId;
  return (
    <div>
      <h1 className='text-primary'>{groupId} Details:</h1>
    </div>
  );
};

export default ApplicationView;
