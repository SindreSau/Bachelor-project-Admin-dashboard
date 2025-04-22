import { getDeletedTasks } from '@/actions/tasks/get-deleted-tasks';
import DeletedTaskCard from '@/components/tasks/unpublished-task-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowBigLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TrashPage() {
  const archivedTasks = await getDeletedTasks();

  return (
    <div className='bg-card rounded-lg border p-6 shadow-xs'>
      <div className='mb-4 flex items-center justify-between'>
        <Button asChild variant='outline' size='sm'>
          <Link href='/oppgaver' className='flex items-center'>
            <ArrowBigLeft className='h-4 w-4' />
            Tilbake
          </Link>
        </Button>
        <h2 className='text-xl font-bold'>Søppelbøtte</h2>
        <div className='w-[70px]'></div>
      </div>
      <div className='grid gap-4 sm:grid-cols-1 lg:grid-cols-1'>
        {archivedTasks.length > 0 ? (
          archivedTasks.map((task) => (
            <div key={task.id} className='w-full'>
              <DeletedTaskCard task={task} />
            </div>
          ))
        ) : (
          <p className='text-muted-foreground py-4 text-center'>Ingen oppgaver å vise.</p>
        )}
      </div>
    </div>
  );
}
