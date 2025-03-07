'use client';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

const HelloName = () => {
  const { user, isLoading } = useKindeBrowserClient();

  if (isLoading) {
    return <div></div>;
  }

  return (
    <span className='text-muted-foreground pr-3 text-sm font-semibold'>
      {user?.given_name} {user?.family_name}
    </span>
  );
};

export default HelloName;
