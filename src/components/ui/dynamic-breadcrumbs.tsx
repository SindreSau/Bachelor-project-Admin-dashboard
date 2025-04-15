'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

function toTitleCase(str: string) {
  return str.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function DynamicBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // Build up the breadcrumb items
  const breadcrumbs = [
    { label: 'Dashboard', href: '/' },
    ...segments.map((segment, idx) => {
      const href = '/' + segments.slice(0, idx + 1).join('/');
      return {
        label: toTitleCase(segment),
        href,
      };
    }),
  ];

  // Array of breadcrumb labels that should never be links (case-insensitive)
  const nonLinkLabels = ['soknader', 'rediger'];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbItem>
              {nonLinkLabels.includes(crumb.label.toLowerCase()) ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : idx === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
