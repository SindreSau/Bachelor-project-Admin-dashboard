import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import Providers from '@/components/common/providers';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard',
  robots: {
    notranslate: true,
    googleBot: 'noindex, nofollow',
    index: false,
    follow: false,
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='nb' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <AppSidebar />
          <div className='flex w-full flex-col'>
            <Header />
            <main className='mx-auto w-full max-w-(--breakpoint-2xl) grow p-4'>{children}</main>
            <Toaster richColors />
          </div>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
