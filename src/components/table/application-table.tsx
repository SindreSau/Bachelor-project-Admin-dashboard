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
// import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { Application } from '@prisma/client';
// import IconExternalLink from '../icons/external-link';
import { ExternalLink } from 'lucide-react';

interface ApplicationTableProps {
  applications: Application[];
}

const ApplicationTable = ({ applications }: ApplicationTableProps) => {
  const router = useRouter();

  const handleClick = (applicationId: string) => {
    router.push(`/applications/${applicationId}`);
  };

  return (
    // <ScrollArea className='h-full'>
    <Card className='h-full flex-col'>
      <CardHeader>
        <CardTitle>Applications</CardTitle>
      </CardHeader>
      <CardContent className=''>
        {/* <div> */}
        {/* Fixed Header */}
        <Table className='sticky top-0 z-10 bg-background'>
          {/* <ScrollArea className='sticky top-0 z-10 bg-background'> */}
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
          {/* </ScrollArea> */}
          {/* Scrollable Body */}
          {/* <ScrollArea className='h-full'> */}
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className='border'>{application.id}</TableCell>
                <TableCell className='border'>{application.school}</TableCell>
                <TableCell className='border'>In Progress</TableCell>
                <TableCell className='border'>
                  {application.createdAt?.toLocaleDateString('nb-NO')}
                </TableCell>
                <TableCell className='border'>
                  {application.updatedAt?.toLocaleDateString('nb-NO')}
                </TableCell>
                <TableCell
                  onClick={() => handleClick(application.id.toString())}
                  className='cursor-pointer border hover:text-primary'
                >
                  <ExternalLink />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* </ScrollArea> */}
        </Table>
        {/* </div> */}
      </CardContent>
    </Card>
    // </ScrollArea>
  );
};

export default ApplicationTable;
