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

// TODO Status updated based on reviews

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
      <CardContent>
        <div className='rounded border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gruppenavn</TableHead>
                <TableHead>Skole</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Søknadsdato</TableHead>
                <TableHead>Sist Oppdatert</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => {
                return (
                  <TableRow key={application.id}>
                    <TableCell>{concatGroupName(application.students)}</TableCell>
                    <TableCell>{application.school}</TableCell>
                    <TableCell>Pågående</TableCell>
                    <TableCell>{application.createdAt?.toLocaleDateString('nb-NO')}</TableCell>
                    <TableCell>{application.updatedAt?.toLocaleDateString('nb-NO')}</TableCell>
                    <TableCell>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationTable;
