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
import { Application, Student } from '@prisma/client';
import { ExternalLink } from 'lucide-react';
import { concatGroupName } from '@/lib/utils';
import Link from 'next/link';

type ApplicationWithStudents = Application & {
  students: Student[];
};

interface ApplicationViewProps {
  applications: ApplicationWithStudents[]; // Changed from single application to array
}

const ApplicationTable = ({ applications }: ApplicationViewProps) => {
  return (
    <Card className='h-full flex-col'>
      <CardHeader>
        <CardTitle>Søknader</CardTitle>
      </CardHeader>
      <CardContent className=''>
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
          <TableBody>
            {applications.map((application) => {
              return (
                <TableRow key={application.id}>
                  <TableCell className='border'>{concatGroupName(application.students)}</TableCell>
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
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ApplicationTable;
