'use client';

import { nameToInitials } from '@/utils/name-to-initials';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '../ui/dropdown-menu';

import { LogoutLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { LogOut } from 'lucide-react';

interface CustomAvatarProps {
  clickable?: boolean;
  size?: 'xs' | 'sm' | 'default' | 'lg';
}

const sizeClasses = {
  xs: 'h-5 w-5',
  sm: 'h-6 w-6',
  default: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export default function CustomAvatar({ clickable = false, size = 'default' }: CustomAvatarProps) {
  const { user, isLoading } = useKindeBrowserClient();

  console.log('user', user);

  const initials = nameToInitials(user?.given_name || '', user?.family_name || '');

  let avatarImageUrl: string = user?.picture || '';
  if (avatarImageUrl.includes('gravatar')) {
    avatarImageUrl = '';
  }

  const avatarSizeClass = sizeClasses[size];

  const avatar = isLoading ? (
    <div className={`${avatarSizeClass}`}></div>
  ) : (
    <Avatar className={`${avatarSizeClass} border border-primary/30 dark:border-primary/50`}>
      <AvatarImage src={avatarImageUrl} alt={initials} width={35} height={35} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );

  if (!clickable) {
    return avatar;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{avatar}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* <DropdownMenuItem className='flex-col items-start p-0'>
          <Link href='/account' className='w-full'>
            <DropdownMenuLabel>Min konto</DropdownMenuLabel>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator /> */}

        <DropdownMenuItem className='flex items-center justify-between'>
          <LogoutLink>Logg ut</LogoutLink>
          <LogOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
