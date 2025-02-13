import { SidebarTrigger } from '../ui/sidebar';
import CustomAvatar from './custom-avatar';
import ThemeSwitcher from './theme-switcher';

export const Header = async () => {
  return (
    <header className='flex items-center justify-between border-b bg-card/80 px-2 py-1'>
      {/* LEFT SIDE OF HEADER */}
      <SidebarTrigger />

      {/* RIGHT SIDE OF HEADER */}
      <div className='flex items-center justify-center gap-2'>
        <ThemeSwitcher className='h-8 w-8' />
        <CustomAvatar />
      </div>
    </header>
  );
};
