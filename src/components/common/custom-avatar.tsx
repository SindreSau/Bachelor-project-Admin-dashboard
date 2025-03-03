'use client';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '../ui/dropdown-menu';

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
  const initials = 'SS';
  const avatarSizeClass = sizeClasses[size];
  const avatar = (
    <Avatar className={`${avatarSizeClass} border border-primary/30 dark:border-primary/50`}>
      <AvatarImage
        src='https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=70&w=128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        alt={initials}
        width={35}
        height={35}
      />
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
        <DropdownMenuItem className='p-0'>
          <Link href='/account' className='w-full'>
            <DropdownMenuLabel>Min konto</DropdownMenuLabel>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
