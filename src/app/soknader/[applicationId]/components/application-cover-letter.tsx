import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task } from '@prisma/client';

interface ApplicationCoverLetterProps {
  coverLetter: string;
  tasks: Task[];
}

const ApplicationCoverLetter = ({ coverLetter, tasks }: ApplicationCoverLetterProps) => {
  // Add test tasks
  tasks = [
    ...tasks,
    // @ts-expect-error - This is a test task for demo purposes
    { id: 'test-task', taskName: 'Test task here for demo purposes' } as Task,
    // @ts-expect-error - This is another test task for demo purposes
    { id: 'test-task2', taskName: 'This is a random nother task' } as Task,
  ];

  return (
    <Card className='@container h-full'>
      <CardHeader>
        <CardTitle>
          <div className='flex flex-col @xl:flex-row @xl:items-center @xl:justify-between @xl:gap-6'>
            <div className='mb-2 @xl:mb-0'>Søknad</div>
            <div className='flex max-w-[36rem] flex-col items-start gap-2 @xl:flex-row @xl:items-center'>
              {/* Tasks Section */}
              <h3 className='text-muted-foreground mb-1 text-sm font-medium @xl:mb-0'>
                Oppgaver søkt på:
              </h3>
              <div className='flex flex-wrap gap-2'>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div key={task.id} className='bg-secondary rounded-md px-3 py-1 text-sm'>
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
