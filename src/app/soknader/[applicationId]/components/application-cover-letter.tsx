import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task } from '@prisma/client';

interface ApplicationCoverLetterProps {
  coverLetter: string;
  tasks: Task[];
}

const ApplicationCoverLetter = ({ coverLetter, tasks }: ApplicationCoverLetterProps) => {
  // Add a test task
  tasks = [
    ...tasks,
    { id: 'test-task', taskName: 'Test task here for demo purposes' } as Task,
    { id: 'test-task2', taskName: 'This is a random nother task' } as Task,
  ];

  // TODO: Use container queries when updated to tailwind v4 to make even more responsive
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-6'>
            <div className='mb-2 lg:mb-0'>Søknad</div>
            <div className='flex max-w-[36rem] flex-col items-center gap-2 lg:flex-row'>
              {/* Tasks Section */}
              <h3 className='mb-1 text-sm font-medium text-muted-foreground'>Oppgaver søkt på:</h3>
              <div className='flex flex-wrap gap-2'>
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
        <div className='mb-2 h-px bg-border lg:mb-4'></div>

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
