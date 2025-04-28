'use client';
import { cn } from '@/lib/utils';
import { ChevronDown, CoffeeIcon, Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

interface ThemeSwitcherProps {
  className?: string;
}

const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme, themes } = useTheme();

  // When mounted on client, show the switcher.
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a placeholder or null during SSR/hydration
    return <div className={cn('h-8 w-10', className)} />; // Adjust size as needed
  }

  const renderThemeIcon = (theme: string | undefined) => {
    switch (theme) {
      case 'light':
        return <Sun className='h-4 w-4' />;
      case 'dark':
        return <Moon className='h-4 w-4' />;
      case 'github-light':
      case 'github-dark':
        return <GitHubLogoIcon className='h-4 w-4' />;
      case 'coffee':
        return <CoffeeIcon className='h-4 w-4' />;
      case 'coffee-dark':
        return <CoffeeIcon className='h-4 w-4' />;
      case 'system':
      default:
        return <Laptop className='h-4 w-4' />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className={cn(className, 'h-8 w-10')}
          aria-label='Toggle theme'
        >
          {renderThemeIcon(resolvedTheme)}
          <span className='sr-only'>Toggle theme</span>
          <ChevronDown className='!h-3 !w-3' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {themes
          .filter((t) => t !== 'system') // Optionally filter out system if you want explicit choices
          .map((theme) => (
            <DropdownMenuItem key={theme} onClick={() => setTheme(theme)}>
              {renderThemeIcon(theme)}
              <span className='ml-2 capitalize'>{theme.replace('-', ' ')}</span>
            </DropdownMenuItem>
          ))}
        {/* Add System theme option separately if desired */}
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Laptop className='mr-2 h-4 w-4' />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
