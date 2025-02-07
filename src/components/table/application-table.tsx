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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { Application } from '@prisma/client';

interface ApplicationTableProps {
  applications: Application[];
}

const columnWidths = {
  // For ensuring that header and body cells align
  groupId: 'w-[100px]',
  school: 'w-[100px]',
  status: 'w-[120px]',
  createdAt: 'w-[150px]',
  updatedAt: 'w-[150px]',
};
const ApplicationTable = ({ applications }: ApplicationTableProps) => {
  const router = useRouter();

  const handleRowClick = (applicationId: string) => {
    router.push(`/applications/${applicationId}`);
  };

  return (
    <Card className='flex h-[850px] w-full flex-col'>
      <CardHeader>
        <CardTitle>Applications</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col overflow-hidden'>
        <div className='relative flex-1 overflow-hidden'>
          {/* Fixed Header */}
          <ScrollArea className='sticky top-0 z-10 bg-background'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={columnWidths.groupId}>Group ID</TableHead>
                  <TableHead className={columnWidths.school}>School</TableHead>
                  <TableHead className={columnWidths.status}>Status</TableHead>
                  <TableHead className={columnWidths.createdAt}>Created At</TableHead>
                  <TableHead className={columnWidths.updatedAt}>Updated At</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </ScrollArea>
          {/* Scrollable Body */}
          <ScrollArea className='h-full'>
            <Table>
              <TableBody>
                {applications.map((application) => (
                  <TableRow
                    key={application.id}
                    className='cursor-pointer hover:bg-muted/50'
                    onClick={() => handleRowClick(application.id.toString())}
                  >
                    <TableCell className={columnWidths.groupId}>{application.id}</TableCell>
                    <TableCell className={columnWidths.school}>{application.school}</TableCell>
                    <TableCell className={columnWidths.status}>In Progress</TableCell>
                    <TableCell className={columnWidths.createdAt}>
                      {application.createdAt?.toLocaleDateString('nb-NO')}
                    </TableCell>
                    <TableCell className={columnWidths.updatedAt}>
                      {application.updatedAt?.toLocaleDateString('nb-NO')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationTable;
