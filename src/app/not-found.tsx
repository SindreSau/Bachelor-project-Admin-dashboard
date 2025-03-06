'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HomeIcon, Terminal } from 'lucide-react';

const NotFoundPage = () => {
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = `> ERROR: 404_PAGE_NOT_FOUND
> ATTEMPTING TO LOCATE PAGE...
> SCANNING DIRECTORY...
> NO MATCHING ROUTES FOUND
> INITIATING EMERGENCY PROTOCOLS...
> SUGGESTION: RETURN TO HOME PAGE
`;

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [fullText]);

  return (
    <main className='flex min-h-[calc(100vh-150px)] flex-col items-center justify-center'>
      <div className='container flex max-w-md flex-col items-center text-center'>
        <div className='duration-150 animate-in slide-in-from-top-5'>
          <h1 className='bg-linear-to-r from-primary to-primary/60 bg-clip-text text-8xl font-bold text-transparent'>
            404
          </h1>

          <div className='mt-4 space-y-4'>
            <h2 className='text-2xl font-semibold'>Oops! Her skulle dere da ikke ha endt opp!</h2>

            <div className='mt-6 w-full rounded-lg bg-black p-4 text-left font-mono text-sm text-green-400'>
              <div className='mb-2 flex items-center gap-2 border-b border-green-400/20 pb-2'>
                <Terminal className='h-4 w-4' />
                <span>Terminal</span>
              </div>
              <div className='min-h-[150px] whitespace-pre-wrap'>
                {text}
                {showCursor && <span className='animate-pulse'>▋</span>}
              </div>
            </div>

            <p className='text-muted-foreground'>
              Ser ut som du har funnet en side som ikke eksisterer. Kanskje du vil prøve å navigere
              hjem?
            </p>
          </div>

          <Button asChild className='mt-8' size='lg'>
            <Link href='/' className='gap-2'>
              <HomeIcon className='h-4 w-4' />
              Hjem
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
