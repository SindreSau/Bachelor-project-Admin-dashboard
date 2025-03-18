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
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  BookOpenText,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
  Star,
} from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import ReviewControls from '@/app/soknader/[applicationId]/components/review-controls';

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
    accessorKey: 'rating',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(sortDirection === 'asc')}
          className='px-0 hover:bg-transparent'
        >
          Vurdering
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
      const application: ApplicationWithStudentsAndReviews = row.original;
      const reviews = application.reviews || [];
      return (
        <ReviewControls
          applicationId={application.id}
          applicationReviews={reviews}
          readOnly={true}
        />
      );
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
        const rating = reviews.length > 0 ? reviews[0].review : null;

        return {
          ...app,
          groupName: concatGroupName(app.students), // Add this for sorting
          statusText: status.text,
          rating, // Add the status text as a direct property for sorting
        };
      }),
    [applications]
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [schoolFilter, setSchoolFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [ratingFilter, setRatingFilter] = React.useState<string>('all');

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

  function resetFilters() {
    const columns = table.getAllColumns();

    columns.forEach((column) => {
      column.setFilterValue(undefined);
    });

    setSchoolFilter('all');
    setStatusFilter('all');
    setRatingFilter('all');
    setSorting([]);
  }

  return (
    <Card className='h-full flex-col'>
      <CardHeader>
        <CardTitle>Søknader</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center gap-8 py-4'>
          <Input
            placeholder='Filtrer på navn...'
            value={(table.getColumn('groupName')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('groupName')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />

          <Select
            value={schoolFilter}
            onValueChange={(value: React.SetStateAction<string>) => {
              setSchoolFilter(value);
              table.getColumn('school')?.setFilterValue(value === 'all' ? undefined : value);
            }}
            defaultValue='all'
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Skole' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Alle skoler</SelectItem>
              <SelectItem value='oslomet'>OsloMet</SelectItem>
              <SelectItem value='kristiania'>Høyskolen Kristiania</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(value: React.SetStateAction<string>) => {
              setStatusFilter(value);
              table.getColumn('statusText')?.setFilterValue(value === 'all' ? undefined : value);
            }}
            defaultValue='all'
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Alle statuser</SelectItem>
              <SelectItem value='ikke begynt'>Ikke begynt</SelectItem>
              <SelectItem value='påbegynt'>Påbegynt</SelectItem>
              <SelectItem value='ferdig'>Ferdig</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={ratingFilter}
            onValueChange={(value: React.SetStateAction<string>) => {
              setRatingFilter(value);
              table.getColumn('rating')?.setFilterValue(value === 'all' ? undefined : value);
            }}
            defaultValue='all'
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Vurderinger' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Alle vurderinger</SelectItem>
              <SelectItem value='THUMBS_DOWN'>
                <ThumbsDown />
              </SelectItem>
              <SelectItem value='THUMBS_UP'>
                <ThumbsUp />
              </SelectItem>
              <SelectItem value='STAR'>
                <Star />
              </SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={resetFilters} variant='outline' size='sm' className='cursor-pointer'>
            Nullstill
            <RotateCcw />
          </Button>
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
                    onClick={() => {
                      window.location.href = getLink(row.original);
                    }}
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
