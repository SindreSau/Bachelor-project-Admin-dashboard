import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ColumnDef, flexRender, Table as TableType } from '@tanstack/react-table';
import { Application, Student, Review } from '@prisma/client';

type ApplicationWithStudentsAndReviews = Application & {
  students: Student[];
  reviews: Review[];
  groupName?: string;
  statusText?: string;
};

interface ApplicationTableViewProps {
  table: TableType<ApplicationWithStudentsAndReviews>;
  columns: ColumnDef<ApplicationWithStudentsAndReviews>[];
  isLoading: boolean;
  getLink: (row: ApplicationWithStudentsAndReviews) => string;
}

const ApplicationTableView = ({
  table,
  columns,
  isLoading,
  getLink,
}: ApplicationTableViewProps) => {
  return (
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
          {isLoading ? (
            // Show loading state
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                <div className='flex items-center justify-center space-x-2'>
                  {/* super duper cool spinner */}
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-dashed border-t-green-400 border-r-yellow-400 border-b-orange-400 border-l-red-400'></div>
                  <span>Laster søknader...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            // Show data when loaded and not empty
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
            // Show no results when not loading and empty
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                Ingen resultater.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationTableView;
