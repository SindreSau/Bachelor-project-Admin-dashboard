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
  useSidebar, // Import the hook from the same place as other sidebar components
} from '@/components/ui/sidebar';
import { Separator } from '@radix-ui/react-separator';
import { navigationLinks } from '@/lib/navigationlinks';
import Link from 'next/link';

export const AppSidebar = () => {
  const { setOpenMobile, isMobile } = useSidebar(); // Use setOpen instead of setIsOpen

  const handleCloseSidebar = () => {
    // Only close on mobile
    if (!isMobile) return;
    setOpenMobile(false);
  };

  return (
    <Sidebar variant='sidebar' collapsible='icon' className='py-1'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='text-base font-bold'>Bachelor Admin</SidebarGroupLabel>
          <Separator className='my-1' />
          <SidebarGroupContent>
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
