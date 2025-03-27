import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RotateCcw, ThumbsDown, ThumbsUp, Star } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { STATUS_OPTIONS } from '@/lib/constants';
import { Table } from '@tanstack/react-table';
import { Application, Student, Review } from '@prisma/client';

type ApplicationWithStudentsAndReviews = Application & {
  students: Student[];
  reviews: Review[];
  groupName?: string;
  statusText?: string;
};

interface ApplicationFiltersProps {
  table: Table<ApplicationWithStudentsAndReviews>;
  schoolFilter: string;
  setSchoolFilter: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  ratingFilter: string;
  setRatingFilter: React.Dispatch<React.SetStateAction<string>>;
  resetFilters: () => void;
}

const ApplicationFilters = ({
  table,
  schoolFilter,
  setSchoolFilter,
  statusFilter,
  setStatusFilter,
  ratingFilter,
  setRatingFilter,
  resetFilters,
}: ApplicationFiltersProps) => {
  return (
    <div className='flex items-center gap-8 py-4'>
      <Input
        placeholder='Filtrer på navn...'
        value={(table.getColumn('groupName')?.getFilterValue() as string) ?? ''}
        onChange={(event) => table.getColumn('groupName')?.setFilterValue(event.target.value)}
        className='max-w-sm'
      />

      <Select
        value={schoolFilter}
        onValueChange={(value) => {
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
        onValueChange={(value) => {
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
          {Object.entries(STATUS_OPTIONS).map(([key, status]) => (
            <div key={key}>
              <SelectItem key={key} value={status}>
                {status}
              </SelectItem>
            </div>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={ratingFilter}
        onValueChange={(value) => {
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
  );
};

export default ApplicationFilters;
