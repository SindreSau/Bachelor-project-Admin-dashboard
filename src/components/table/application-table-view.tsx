'use client';
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
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const handleRowClick = (href: string) => {
    router.push(href);
  };

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
              <TableCell colSpan={columns.length} className='h-24 text-center'></TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            // Show data when loaded and not empty
            table.getRowModel().rows.map((row) => {
              const href = getLink(row.original);
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => handleRowClick(href)}
                  className='group hover:bg-muted/50 cursor-pointer'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
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
