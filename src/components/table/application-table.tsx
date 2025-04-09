'use client';

import * as React from 'react';
import {
  SortingState,
  ColumnFiltersState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { createColumns, useRatingScores } from './application-table-columns';
import ApplicationFilters from './application-filters';
import ApplicationTableView from './application-table-view';
import { Application, Review, Student } from '@prisma/client';

type ApplicationWithStudentsAndReviews = Application & {
  students: Student[];
  reviews: Review[];
  groupName?: string;
  status?: string;
};

interface ApplicationViewProps {
  applications: ApplicationWithStudentsAndReviews[];
}

const ApplicationTable = ({ applications }: ApplicationViewProps) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [schoolFilter, setSchoolFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [ratingFilter, setRatingFilter] = React.useState<string>('all');

  // Create memoized rating scores map
  const ratingScores = useRatingScores(applications);

  // Create columns with the rating scores
  const columns = React.useMemo(() => createColumns(ratingScores), [ratingScores]);

  const table = useReactTable({
    data: applications,
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

  function getLink(row: ApplicationWithStudentsAndReviews) {
    return `/soknader/${row.id.toString()}`;
  }

  return (
    <Card className='h-full flex-col'>
      <CardHeader>
        <CardTitle>Søknader</CardTitle>
      </CardHeader>
      <CardContent>
        <ApplicationFilters
          table={table}
          schoolFilter={schoolFilter}
          setSchoolFilter={setSchoolFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          resetFilters={resetFilters}
        />

        <ApplicationTableView table={table} columns={columns} isLoading={false} getLink={getLink} />
      </CardContent>
    </Card>
  );
};

export default ApplicationTable;
