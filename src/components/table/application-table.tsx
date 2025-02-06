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
import { ApplicationTableProps } from '@/types/application';

const ApplicationTable = ({ applications }: ApplicationTableProps) => {
  const router = useRouter();

  const handleRowClick = (groupId: string) => {
    router.push(`/applications/${groupId}`);
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
                  <TableHead>Group ID</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied At</TableHead>
                  <TableHead>Updated At</TableHead>
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
                    key={application.groupId}
                    className='cursor-pointer hover:bg-muted/50'
                    onClick={() => handleRowClick(application.groupId)}
                  >
                    <TableCell className='text-primary'>{application.groupId}</TableCell>
                    <TableCell>{application.school}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{application.appliedAt?.toLocaleDateString()}</TableCell>
                    <TableCell></TableCell>
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
