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
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';

interface CustomAvatarProps {
  clickable?: boolean;
  size?: 'xs' | 'sm' | 'default' | 'lg';
  user?: KindeUser<Record<string, unknown>>;
}

const sizeClasses = {
  xs: 'h-5 w-5 text-xs',
  sm: 'h-6 w-6 text-sm',
  default: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export default function CustomAvatar({
  clickable = false,
  size = 'default',
  user,
}: CustomAvatarProps) {
  const { user: kindeUser, isLoading } = useKindeBrowserClient();

  // Use provided user or fall back to Kinde user
  const displayUser = user || kindeUser;
  const loading = !user && isLoading;

  const initials = nameToInitials(displayUser?.given_name || '', displayUser?.family_name || '');

  // Use the picture URL if it exists and is not empty
  const avatarImageUrl = displayUser?.picture || '';

  const avatarSizeClass = sizeClasses[size];

  const avatar = loading ? (
    <div className={`${avatarSizeClass}`}></div>
  ) : (
    <Avatar
      className={`${avatarSizeClass} border-primary/30 dark:border-primary/50 border ${clickable && 'cursor-pointer'}`}
    >
      <AvatarImage src={avatarImageUrl} alt={initials} width={35} height={35} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );

  // Only make clickable if no specific user is provided (meaning it's the current user)
  if (!clickable || user) {
    return avatar;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{avatar}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className='flex cursor-pointer items-center justify-between'>
          <LogoutLink>Logg ut</LogoutLink>
          <LogOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
