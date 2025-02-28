import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ApplicationTableSkeleton() {
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
                <TableHead>
                  <Skeleton className='h-4 w-28 md:w-32' />
                </TableHead>
                <TableHead>
                  <Skeleton className='h-4 w-16 md:w-20' />
                </TableHead>
                <TableHead>
                  <Skeleton className='h-4 w-20 md:w-24' />
                </TableHead>
                <TableHead>
                  <Skeleton className='h-4 w-24 md:w-28' />
                </TableHead>
                <TableHead>
                  <Skeleton className='h-4 w-24 md:w-28' />
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className='h-5 w-36 md:w-44' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-5 w-20 md:w-24' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-5 w-20 md:w-24' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-5 w-20 md:w-24' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-5 w-20 md:w-24' />
                    </TableCell>
                    <TableCell className='flex justify-center'>
                      <Skeleton className='h-8 w-8 rounded-full' />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
