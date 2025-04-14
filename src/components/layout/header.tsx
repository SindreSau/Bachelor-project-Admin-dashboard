'use client';

import { SidebarTrigger } from '../ui/sidebar';
import CustomAvatar from '../common/custom-avatar';
import ThemeSwitcher from './theme-switcher';
import HelloName from './hello-name';
import DynamicBreadcrumbs from '@/components/ui/dynamic-breadcrumbs';

export const Header = () => {
  return (
    <header className='bg-sidebar/60 flex items-center justify-between px-2 py-1'>
      {/* LEFT SIDE OF HEADER */}
      <div>
        <SidebarTrigger className='md:hidden' />
        <div className='ml-2 hidden md:block'>
          <DynamicBreadcrumbs />
        </div>
      </div>

      {/* RIGHT SIDE OF HEADER */}
      <div className='flex items-center justify-center gap-2'>
        <HelloName />
        <ThemeSwitcher className='h-8 w-8' />
        <CustomAvatar clickable />
      </div>
    </header>
  );
};
