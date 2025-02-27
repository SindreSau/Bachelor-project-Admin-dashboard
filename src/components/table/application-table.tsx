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
import { Application, Student, Review } from '@prisma/client';
import { ExternalLink } from 'lucide-react';
import { concatGroupName } from '@/lib/utils';
import Link from 'next/link';
import getApplicationStatus from '@/utils/applications/get-application-status';

// TODO Status updated based on reviews

type ApplicationWithStudentsAndReviews = Application & {
  students: Student[];
  reviews: Review[];
};

interface ApplicationViewProps {
  applications: ApplicationWithStudentsAndReviews[]; // Changed from single application to array
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
                const reviews = application.reviews || [];
                const status = getApplicationStatus(reviews);
                return (
                  <TableRow key={application.id}>
                    <TableCell>{concatGroupName(application.students)}</TableCell>
                    <TableCell>{application.school}</TableCell>
                    <TableCell>
                      <span className={`${status.className}`}>{status.text}</span>
                    </TableCell>
                    <TableCell>
                      {application.createdAt?.toLocaleDateString('nb-NO', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      {application.updatedAt?.toLocaleDateString('nb-NO', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </TableCell>
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
