import { ColumnDef, FilterFn } from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown, BookOpenText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { concatGroupName } from '@/lib/utils';
import StatusBadge from './status-badge';
import ReviewControls from '@/app/soknader/[applicationId]/components/review-controls';
import { Application, Review, Student } from '@prisma/client';
import { getStatusOrder } from '@/utils/get-status-order';

type ApplicationWithStudentsAndReviews = Application & {
  students: Student[];
  reviews: Review[];
};

// Define a custom filter function for exact matches
export const exactMatchFilter: FilterFn<ApplicationWithStudentsAndReviews> = (
  row,
  columnId,
  filterValue
) => {
  if (filterValue === undefined || filterValue === null || filterValue === '') return true;

  const value = row.getValue(columnId) as string;
  return value === filterValue;
};

// Column header button component to reduce repetition
const SortableColumnHeader = ({
  column,
  title,
}: {
  column: {
    getIsSorted: () => false | 'asc' | 'desc';
    toggleSorting: (desc?: boolean) => void;
  };
  title: string;
}) => {
  const sortDirection = column.getIsSorted();
  return (
    <Button
      variant='ghost'
      onClick={() => column.toggleSorting(sortDirection === 'asc')}
      className='px-0 hover:bg-transparent'
    >
      {title}
      {sortDirection === 'asc' ? (
        <ArrowUp className='ml-2 h-4 w-4' />
      ) : sortDirection === 'desc' ? (
        <ArrowDown className='ml-2 h-4 w-4' />
      ) : (
        <ArrowUpDown className='ml-2 h-4 w-4' />
      )}
    </Button>
  );
};

// Define column structure for tanstack/react-table
export const columns: ColumnDef<ApplicationWithStudentsAndReviews>[] = [
  {
    accessorKey: 'groupName',
    header: ({ column }) => <SortableColumnHeader column={column} title='Gruppenavn' />,
    cell: ({ row }) => {
      const application = row.original;
      return <div>{concatGroupName(application.students)}</div>;
    },
  },
  {
    accessorKey: 'school',
    header: ({ column }) => <SortableColumnHeader column={column} title='Skole' />,
    cell: ({ row }) => <div>{row.original.school}</div>,
  },
  {
    accessorKey: 'statusText',
    header: ({ column }) => <SortableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const application = row.original;
      const status = application.status;
      return <StatusBadge status={status} />;
    },
    filterFn: exactMatchFilter,
    // Add a custom sorting function based on our order property
    sortingFn: (rowA, rowB) => {
      const statusA = rowA.original.status;
      const statusB = rowB.original.status;

      const orderA = getStatusOrder(statusA);
      const orderB = getStatusOrder(statusB);

      return orderA - orderB;
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortableColumnHeader column={column} title='Søknadsdato' />,
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
    header: ({ column }) => <SortableColumnHeader column={column} title='Sist Oppdatert' />,
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
    header: ({ column }) => <SortableColumnHeader column={column} title='Vurdering' />,
    cell: ({ row }) => {
      const application = row.original;
      const reviews = application.reviews || [];
      return (
        <ReviewControls
          applicationId={application.id}
          applicationReviews={reviews}
          readOnly={true}
          applicationStatus={application.status}
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
