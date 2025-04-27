import { ThemeProvider } from 'next-themes';
import { SidebarProvider } from '../ui/sidebar';
import { AuthProvider } from '../layout/auth-provider';
import { TooltipProvider } from '../ui/tooltip';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
        themes={['light', 'dark', 'github-light', 'github-dark', 'system']}
      >
        <SidebarProvider defaultOpen={true}>
          <TooltipProvider>{children}</TooltipProvider>
        </SidebarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Providers;
