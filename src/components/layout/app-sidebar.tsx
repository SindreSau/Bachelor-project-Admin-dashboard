'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar, // Import the hook from the same place as other sidebar components
} from '@/components/ui/sidebar';
import { Separator } from '@radix-ui/react-separator';
import { navigationLinks } from '@/lib/navigationlinks';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export const AppSidebar = () => {
  const { setOpenMobile, isMobile } = useSidebar(); // Use setOpen instead of setIsOpen

  const handleCloseSidebar = () => {
    // Only close on mobile
    if (!isMobile) return;
    setOpenMobile(false);
  };

  const isUserOnMac = (): boolean => {
    if (typeof window === 'undefined') return false;
    return navigator.userAgent.toLowerCase().includes('mac');
  };

  return (
    <Sidebar variant='sidebar' collapsible='icon' className='py-1'>
      <SidebarContent className='h-full'>
        <SidebarGroup className='flex h-full'>
          <SidebarGroupLabel className='text-base font-bold'>Bachelor Admin</SidebarGroupLabel>
          <Separator className='my-1' />
          <SidebarGroupContent className='flex h-full flex-col justify-between'>
            <SidebarMenu>
              {navigationLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={handleCloseSidebar} asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <div className='hidden w-full justify-end p-1 md:flex'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarTrigger />
                  </TooltipTrigger>
                  <TooltipContent>
                    Shortcut:{' '}
                    <code className='rounded-md bg-gray-800 px-2 py-1 text-sm font-semibold text-white'>
                      {isUserOnMac() ? 'cmd + shift + b' : 'ctrl + shift + b'}
                    </code>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
