import React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteAllApplications } from '@/actions/applications/delete-all-applications';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RotateCcw, MoreHorizontal } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ConfirmActionModal from '../tasks/confirm-action-modal';

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
  resetFilters,
}: ApplicationFiltersProps) => {
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const handleDeleteAllConfirm = async () => {
    setIsDeletingAll(true);
    try {
      const result = await deleteAllApplications();
      if (result.success) {
        toast.success('Alle søknader slettet');
        // Optionally, refresh data here
      } else {
        toast.error('Kunne ikke slette alle søknader', { description: result.error });
      }
    } catch (error) {
      toast.error('Noe gikk galt', { description: 'Kunne ikke slette alle søknader.' });
    } finally {
      setIsDeletingAll(false);
      setIsDeleteAllDialogOpen(false);
    }
  };

  return (
    <div className='flex flex-wrap items-center gap-4 py-4'>
      <Input
        placeholder='Filtrer på navn...'
        value={(table.getColumn('groupName')?.getFilterValue() as string) ?? ''}
        onChange={(event) => table.getColumn('groupName')?.setFilterValue(event.target.value)}
        className='max-w-xs'
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
          table.getColumn('status')?.setFilterValue(value === 'all' ? undefined : value);
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
              <SelectItem key={key} value={status.value}>
                {status.value}
              </SelectItem>
            </div>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={resetFilters} variant='outline' size='sm' className='cursor-pointer'>
        Nullstill
        <RotateCcw />
      </Button>
      <div className='flex justify-end'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-fit px-2'>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Handlinger</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ConfirmActionModal
              onAction={handleDeleteAllConfirm}
              title='Slett søknad'
              description={`Er du sikker på at du vil slette alle søknader? Dette kan ikke angres.`}
              confirmText='Slett'
              cancelText='Avbryt'
              actionButtonClassName='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              trigger={
                <DropdownMenuItem
                  className='text-destructive-foreground hover:text-destructive-foreground bg-destructive/20 cursor-pointer'
                  onSelect={(e) => e.preventDefault()}
                >
                  Slett alle søknader
                </DropdownMenuItem>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ApplicationFilters;
