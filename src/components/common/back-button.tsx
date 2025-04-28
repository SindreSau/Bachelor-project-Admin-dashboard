'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split('/').filter(Boolean);

  // Show back if in /oppgaver/* or /soknader/*
  const showBack =
    (segments.length > 1 && segments[0].toLowerCase() === 'oppgaver') ||
    (segments.length > 1 && segments[0].toLowerCase() === 'soknader');

  const handleBack = () => {
    router.back();
  };

  if (showBack) {
    return (
      <Button variant='ghost' onClick={handleBack} className='hover:bg-muted/50'>
        <ArrowLeft />
        Tilbake
      </Button>
    );
  }

  return null;
}
