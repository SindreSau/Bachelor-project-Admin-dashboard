'use client';

import * as React from 'react';
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown, BookOpenText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Application, Student, Review } from '@prisma/client';
import { concatGroupName } from '@/lib/utils';
import Link from 'next/link';
import getApplicationStatus from '@/utils/applications/get-application-status';

type ApplicationWithStudentsAndReviews = Application & {
  students: Student[];
  reviews: Review[];
};

interface ApplicationViewProps {
  applications: ApplicationWithStudentsAndReviews[];
}

// Define column structure for tanstack/react-table
const columns: ColumnDef<ApplicationWithStudentsAndReviews>[] = [
  {
    accessorKey: 'groupName',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(sortDirection === 'asc')}
          className='px-0 hover:bg-transparent'
        >
          Gruppenavn
          {sortDirection === 'asc' ? (
            <ArrowUp className='ml-2 h-4 w-4' />
          ) : sortDirection === 'desc' ? (
            <ArrowDown className='ml-2 h-4 w-4' />
          ) : (
            <ArrowUpDown className='ml-2 h-4 w-4' />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const application = row.original;
      return <div>{concatGroupName(application.students)}</div>;
    },
  },
  {
    accessorKey: 'school',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(sortDirection === 'asc')}
          className='px-0 hover:bg-transparent'
        >
          Skole
          {sortDirection === 'asc' ? (
            <ArrowUp className='ml-2 h-4 w-4' />
          ) : sortDirection === 'desc' ? (
            <ArrowDown className='ml-2 h-4 w-4' />
          ) : (
            <ArrowUpDown className='ml-2 h-4 w-4' />
          )}
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.original.school}</div>,
  },
  {
    accessorKey: 'statusText', // Use the pre-processed statusText value for sorting
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(sortDirection === 'asc')}
          className='px-0 hover:bg-transparent'
        >
          Status
          {sortDirection === 'asc' ? (
            <ArrowUp className='ml-2 h-4 w-4' />
          ) : sortDirection === 'desc' ? (
            <ArrowDown className='ml-2 h-4 w-4' />
          ) : (
            <ArrowUpDown className='ml-2 h-4 w-4' />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const application = row.original;
      const reviews = application.reviews || [];
      const status = getApplicationStatus(reviews);
      return <span className={status.className}>{status.text}</span>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(sortDirection === 'asc')}
          className='px-0 hover:bg-transparent'
        >
          Søknadsdato
          {sortDirection === 'asc' ? (
            <ArrowUp className='ml-2 h-4 w-4' />
          ) : sortDirection === 'desc' ? (
            <ArrowDown className='ml-2 h-4 w-4' />
          ) : (
            <ArrowUpDown className='ml-2 h-4 w-4' />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return date?.toLocaleDateString('nb-NO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(sortDirection === 'asc')}
          className='px-0 hover:bg-transparent'
        >
          Sist Oppdatert
          {sortDirection === 'asc' ? (
            <ArrowUp className='ml-2 h-4 w-4' />
          ) : sortDirection === 'desc' ? (
            <ArrowDown className='ml-2 h-4 w-4' />
          ) : (
            <ArrowUpDown className='ml-2 h-4 w-4' />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.updatedAt;
      return date?.toLocaleDateString('nb-NO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const application = row.original;
      return (
        <Link
          href={`/soknader/${application.id.toString()}`}
          className='group flex cursor-pointer items-center justify-center'
        >
          <BookOpenText className='group-hover:text-primary h-6 w-6' />
        </Link>
      );
    },
  },
];

const ApplicationTable = ({ applications }: ApplicationViewProps) => {
  // Pre-process applications to add the derived values for sorting
  const processedApplications = React.useMemo(
    () =>
      applications.map((app) => {
        const reviews = app.reviews || [];
        const status = getApplicationStatus(reviews);

        return {
          ...app,
          groupName: concatGroupName(app.students), // Add this for sorting
          statusText: status.text, // Add the status text as a direct property for sorting
        };
      }),
    [applications]
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: processedApplications,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  function getLink(row: ApplicationWithStudentsAndReviews) {
    return `/soknader/${row.id.toString()}`;
  }

  return (
    <Card className='h-full flex-col'>
      <CardHeader>
        <CardTitle>Søknader</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center py-4'>
          <Input
            placeholder='Filtrer på navn...'
            value={(table.getColumn('groupName')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('groupName')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
        </div>
        <div className='rounded border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    onClick={() => (window.location.href = getLink(row.original))}
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className='group hover:bg-muted/50 cursor-pointer'
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    Ingen resultater.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationTable;
