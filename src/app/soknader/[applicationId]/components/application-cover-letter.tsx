import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task } from '@prisma/client';

interface ApplicationCoverLetterProps {
  coverLetter: string;
  tasks: Task[];
}

const ApplicationCoverLetter = ({ coverLetter, tasks }: ApplicationCoverLetterProps) => {
  return (
    <Card className='@container h-full w-full flex-col'>
      <CardHeader>
        <CardTitle>
          <div className='flex flex-col @xl:flex-row @xl:items-center @xl:justify-between @xl:gap-6'>
            <div className='mb-2 @xl:mb-0'>Søknad</div>
            <div className='flex flex-col items-start gap-2 @xl:flex-row @xl:items-center'>
              {/* Tasks Section */}
              <h3 className='text-muted-foreground mb-1 text-sm font-medium @xl:mb-0'>Oppgaver:</h3>
              <div className='flex flex-wrap gap-2'>
                {tasks.length > 0 ? (
                  tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={`bg-secondary flex items-center rounded-md px-3 py-1 text-sm ${index === 0 ? 'border-primary border' : ''}`}
                    >
                      <span className='bg-primary text-primary-foreground mr-2 flex h-5 w-5 items-center justify-center rounded-full text-xs'>
                        {index + 1}
                      </span>
                      {task.taskName}
                    </div>
                  ))
                ) : (
                  <p className='text-muted-foreground text-sm'>Ingen oppgaver valgt</p>
                )}
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Divider */}
        <div className='bg-border mb-2 h-px @md:mb-4'></div>

        {/* Cover Letter Section */}
        <div className='overflow-y-auto whitespace-pre-wrap'>
          <ScrollArea className='h-full max-h-[calc(100vh-300px)] p-1'>
            {coverLetter || 'No cover letter provided'}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCoverLetter;
