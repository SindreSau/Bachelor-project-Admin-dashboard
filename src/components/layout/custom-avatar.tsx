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
        <Avatar className='h-8 w-8'>
          <AvatarImage src={''} alt={initials} width={35} height={35} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className='p-0'>
          <Link href={'/account'} className='w-full'>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
