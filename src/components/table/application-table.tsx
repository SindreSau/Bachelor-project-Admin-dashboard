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
import { concatGroupName } from '@/lib/utils';
import getApplicationStatus from '@/utils/applications/get-application-status';
import ApplicationFilters from './application-filters';
import ApplicationTableView from './application-table-view';
import { createColumns, useRatingScores } from './application-table-columns';
import { Application, Review, Student } from '@prisma/client';

type ApplicationWithStudentsAndReviews = Application & {
  students: Student[];
  reviews: Review[];
};

interface ApplicationViewProps {
  applications: ApplicationWithStudentsAndReviews[];
}

const ApplicationTable = ({ applications }: ApplicationViewProps) => {
  const [processedApplications, setProcessedApplications] = React.useState<
    ApplicationWithStudentsAndReviews[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [schoolFilter, setSchoolFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [ratingFilter, setRatingFilter] = React.useState<string>('all');

  // Fetch application statuses and process applications
  React.useEffect(() => {
    const fetchStatuses = async () => {
      setIsLoading(true);

      try {
        const updatedApplications = await Promise.all(
          applications.map(async (app) => {
            const status = await getApplicationStatus(app.id);
            return {
              ...app,
              groupName: concatGroupName(app.students),
              status: status ?? '',
            };
          })
        );
        setProcessedApplications(updatedApplications);
      } catch (error) {
        console.error('Error processing applications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatuses();
  }, [applications]);

  // Create memoized rating scores map
  const ratingScores = useRatingScores(processedApplications);

  // Create columns with the rating scores
  const columns = React.useMemo(() => createColumns(ratingScores), [ratingScores]);

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

        <ApplicationTableView
          table={table}
          columns={columns}
          isLoading={isLoading}
          getLink={getLink}
        />
      </CardContent>
    </Card>
  );
};

export default ApplicationTable;
