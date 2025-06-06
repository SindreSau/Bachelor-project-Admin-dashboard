import { ColumnDef, FilterFn } from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown, ArrowRightSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { concatGroupName } from '@/lib/utils';
import StatusBadge from './status-badge';
import ReviewControls from '@/app/soknader/[applicationId]/components/review-controls';
import { Application, Review, ReviewStatus, Student } from '@prisma/client';
import { getStatusOrder } from '@/utils/get-status-order';
import { useMemo } from 'react';

type ApplicationWithStudentsAndReviews = Application & {
  students: Student[];
  reviews: Review[];
};

// Move this outside of the render cycle to avoid unnecessary recalculations
const calculateRatingScore = (reviews: Review[]): number => {
  if (!reviews || reviews.length === 0) return 0;

  return reviews.reduce((total, review) => {
    // THUMBS_DOWN = 0, THUMBS_UP = 1, STAR = 2
    const reviewValue = review.review
      ? review.review === ReviewStatus.THUMBS_DOWN
        ? 0
        : review.review === ReviewStatus.THUMBS_UP
          ? 1
          : 2
      : 0;

    return total + reviewValue;
  }, 0);
};

// Create a memoized map of application IDs to rating scores
// This will be used in the ApplicationTable component
export const useRatingScores = (applications: ApplicationWithStudentsAndReviews[]) => {
  return useMemo(() => {
    const scoreMap = new Map<number, number>();

    applications.forEach((app) => {
      const score = calculateRatingScore(app.reviews);
      scoreMap.set(app.id, score);
    });

    return scoreMap;
  }, [applications]);
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

// Factory function to create columns with a rating scores map
export const createColumns = (
  ratingScores: Map<number, number>
): ColumnDef<ApplicationWithStudentsAndReviews>[] => [
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
    accessorKey: 'status',
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
    accessorKey: 'ratingScore',
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
    // Use the pre-computed scores from the map
    accessorFn: (row) => {
      return ratingScores.get(row.id) || 0;
    },
    sortingFn: (rowA, rowB) => {
      // Get the rating scores from the pre-computed map
      const scoreA = ratingScores.get(rowA.original.id) || 0;
      const scoreB = ratingScores.get(rowB.original.id) || 0;

      // Sort by score (higher score first)
      return scoreB - scoreA;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const application = row.original;
      return (
        <Link
          href={`/soknader/${application.id.toString()}`}
          className='group text-muted-foreground/70 flex cursor-pointer items-center justify-center'
        >
          <ArrowRightSquare className='group-hover:text-primary h-6 w-6' />
        </Link>
      );
    },
  },
];
