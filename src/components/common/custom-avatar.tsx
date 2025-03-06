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

interface User {
  id: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

interface CustomAvatarProps {
  clickable?: boolean;
  size?: 'xs' | 'sm' | 'default' | 'lg';
  user?: User; // Optional user prop
}

const sizeClasses = {
  xs: 'h-5 w-5',
  sm: 'h-6 w-6',
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
    <Avatar className={`${avatarSizeClass} border border-primary/30 dark:border-primary/50`}>
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
        <DropdownMenuItem className='flex items-center justify-between'>
          <LogoutLink>Logg ut</LogoutLink>
          <LogOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
