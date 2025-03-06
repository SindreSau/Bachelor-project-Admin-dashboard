import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task } from '@prisma/client';

interface ApplicationCoverLetterProps {
  coverLetter: string;
  tasks: Task[];
}

const ApplicationCoverLetter = ({ coverLetter, tasks }: ApplicationCoverLetterProps) => {
  return (
    <Card className='w-full grow'>
      <CardHeader>
        <CardTitle>
          <div className='items-center justify-between lg:flex'>
            <div className=''>Søknad</div>
            <div className='items-center justify-center gap-4 lg:flex'>
              {/* Tasks Section */}
              <h3 className='text-sm font-medium text-muted-foreground'>Oppgaver søkt på:</h3>
              <div className='flex flex-wrap items-center justify-center gap-2'>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div key={task.id} className='rounded-md bg-secondary px-3 py-1 text-sm'>
                      {task.taskName}
                    </div>
                  ))
                ) : (
                  <p className='text-sm text-muted-foreground'>Ingen oppgaver valgt</p>
                )}
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Divider */}
        <div className='h-px bg-border' />

        {/* Cover Letter Section */}
        <div className='overflow-y-auto whitespace-pre-wrap'>
          <ScrollArea className='p-1'>{coverLetter || 'No cover letter provided'}</ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCoverLetter;
