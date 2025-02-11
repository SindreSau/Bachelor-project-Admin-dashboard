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

export default async function CustomAvatar() {
  const initials = 'SS';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className='border-green-foreground h-8 w-8 border-2'>
          <AvatarImage
            src={
              'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=70&w=128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }
            alt={initials}
            width={35}
            height={35}
          />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className='p-0'>
          <Link href={'/account'} className='w-full'>
            <DropdownMenuLabel>Min konto</DropdownMenuLabel>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
