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
import { useRouter } from 'next/navigation';
import { ApplicationTableProps } from '@/types/application';

const ApplicationTable = ({ applications }: ApplicationTableProps) => {
  const router = useRouter();

  const handleRowClick = (groupId: string) => {
    router.push(`/applications/${groupId}`);
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group ID</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Applied Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {applications.map((application) => (
              <TableRow
                key={application.groupId}
                className='cursor-pointer hover:bg-muted/50'
                onClick={() => handleRowClick(application.groupId)}
              >
                <TableCell className='text-primary'>{application.groupId}</TableCell>
                <TableCell>{application.school}</TableCell>
                <TableCell>{application.appliedAt?.toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ApplicationTable;
