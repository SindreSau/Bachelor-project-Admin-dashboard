'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

// Map custom theme names to Sonner's theme prop
function mapTheme(theme: string | undefined): 'light' | 'dark' | 'system' {
  if (!theme || theme === 'system') return 'system';
  if (theme === 'light' || theme === 'github-light' || theme === 'coffee') {
    return 'light';
  }
  if (theme === 'dark' || theme === 'github-dark' || theme === 'coffee-dark') {
    return 'dark';
  }
  return 'system';
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={mapTheme(theme)}
      className='toaster group'
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
