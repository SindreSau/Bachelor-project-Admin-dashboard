import Link from 'next/link';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFoundPage() {
  return (
    <main className='flex min-h-[calc(100vh-150px)] flex-col items-center justify-center'>
      <div className='container flex max-w-md flex-col items-center text-center'>
        <div className='duration-150 animate-in slide-in-from-top-5'>
          <h1 className='bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-8xl font-bold text-transparent'>
            404
          </h1>

          <div className='mt-4 space-y-4'>
            <h2 className='text-2xl font-semibold'>Oops! Page not found</h2>
            <p className='text-muted-foreground'>
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          <Button asChild className='mt-8' size='lg'>
            <Link href='/' className='gap-2'>
              <HomeIcon className='h-4 w-4' />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
