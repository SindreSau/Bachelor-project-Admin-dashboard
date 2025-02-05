'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

// Sample data
const sampleGroups: Group[] = [
  {
    groupId: 'G001',
    school: 'University of Technology',
    students: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@uot.edu',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@uot.edu',
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.j@uot.edu',
      },
    ],
    appliedAt: new Date('2024-02-01'),
  },
  {
    groupId: 'G002',
    school: 'State Technical College',
    students: [
      {
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.w@stc.edu',
      },
      {
        firstName: 'Tom',
        lastName: 'Brown',
        email: 'tom.b@stc.edu',
      },
      {
        firstName: 'Lisa',
        lastName: 'Anderson',
        email: 'lisa.a@stc.edu',
      },
    ],
    appliedAt: new Date('2024-02-03'),
  },
  {
    groupId: 'G003',
    school: 'Innovation Institute',
    students: [
      {
        firstName: 'Alex',
        lastName: 'Martinez',
        email: 'alex.m@ii.edu',
      },
      {
        firstName: 'Emily',
        lastName: 'Taylor',
        email: 'emily.t@ii.edu',
      },
      {
        firstName: 'David',
        lastName: 'Lee',
        email: 'david.l@ii.edu',
      },
    ],
    appliedAt: new Date('2024-02-04'),
  },
];

interface ApplicationTableProps {
  groups: Group[];
}

type Student = {
  firstName: string;
  lastName: string;
  email: string;
};

type Group = {
  groupId: string;
  school: string;
  students: Student[];
  appliedAt?: Date;
};

const ApplicationTable = ({ groups }: ApplicationTableProps) => {
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
            {groups.map((group) => (
              <TableRow
                key={group.groupId}
                className='cursor-pointer hover:bg-muted/50'
                onClick={() => handleRowClick(group.groupId)}
              >
                <TableCell className='text-primary'>{group.groupId}</TableCell>
                <TableCell>{group.school}</TableCell>
                <TableCell>{group.appliedAt?.toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ApplicationTable;
