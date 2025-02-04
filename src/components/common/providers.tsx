import { ThemeProvider } from 'next-themes';
import { SidebarProvider } from '../ui/sidebar';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
      <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>
    </ThemeProvider>
  );
};

export default Providers;
