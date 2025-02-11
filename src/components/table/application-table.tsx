'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Application } from '@prisma/client';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

const ApplicationTable = ({ applications }: { applications: Application[] }) => {
  return (
    <Card className='h-full flex-col'>
      <CardHeader>
        <CardTitle>Søknader</CardTitle>
      </CardHeader>
      <CardContent className=''>
        {/* Fixed Header */}
        <Table className='sticky top-0 z-10 bg-background'>
          <TableHeader>
            <TableRow>
              <TableHead className='border'>Gruppenavn</TableHead>
              <TableHead className='border'>Skole</TableHead>
              <TableHead className='border'>Status</TableHead>
              <TableHead className='border'>Søknadsdato</TableHead>
              <TableHead className='border'>Sist Oppdatert</TableHead>
              <TableHead className='border'></TableHead>
            </TableRow>
          </TableHeader>

          {/* Scrollable Body */}
          <TableBody>
            {applications?.map((application) => (
              <TableRow key={application.id}>
                <TableCell className='border'>{application.id}</TableCell>
                <TableCell className='border'>{application.school}</TableCell>
                <TableCell className='border'>Pågående</TableCell>
                <TableCell className='border'>
                  {application.createdAt?.toLocaleDateString('nb-NO')}
                </TableCell>
                <TableCell className='border'>
                  {application.updatedAt?.toLocaleDateString('nb-NO')}
                </TableCell>
                <TableCell className='border'>
                  <Link
                    href={`/applications/${application.id.toString()}`}
                    className='flex cursor-pointer items-center justify-center hover:text-primary'
                  >
                    <ExternalLink />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ApplicationTable;
