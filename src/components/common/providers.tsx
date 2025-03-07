import { ThemeProvider } from 'next-themes';
import { SidebarProvider } from '../ui/sidebar';
import { AuthProvider } from '../layout/auth-provider';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Providers;
