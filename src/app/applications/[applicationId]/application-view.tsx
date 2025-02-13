'use client';

import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Student, File, Application, Review, Task } from '@prisma/client';
import { concatGroupName } from '@/lib/utils';
import { getBlobPdf } from '@/utils/blobstorage/get-files';
import { Star } from 'lucide-react';
import ApplicationDetailsCard from './components/application-details-card';

type StudentWithFiles = Student & {
  files: File[];
};

type ApplicationViewTypes = Application & {
  students: StudentWithFiles[];
  studentRepresentative: Student | null;
  tasks: Task[];
  reviews: Review[];
};

interface ApplicationViewProps {
  application: ApplicationViewTypes;
}

const ApplicationView = ({ application }: ApplicationViewProps) => {
  // Sort students so that the representative always appears first
  const sortedStudents = [...application.students].sort((a, b) => {
    if (a.id === application.studentRepresentative?.id) return -1;
    if (b.id === application.studentRepresentative?.id) return 1;
    return 0;
  });

  return (
    <div className='flex h-full p-2'>
      <div className='flex flex-1 flex-col gap-2'>
        {/* Application Details Card */}
        <ApplicationDetailsCard
          applicationId={application.id}
          groupName={concatGroupName(application.students)}
          school={application.school}
          createdAt={application.createdAt}
          updatedAt={application.updatedAt}
          applicationReviews={application.reviews}
        />
        {/* Cover Letter Card */}
        <Card className='grow'>
          <CardHeader>
            <CardTitle>
              <div className='items-start justify-between lg:flex'>
                <div className='pb-2'>Søknad</div>
                <div className='gap-4 lg:flex'>
                  {/* Tasks Section */}
                  <h3 className='mb-2 text-sm font-medium text-muted-foreground'>
                    Oppgaver søkt på:
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {application.tasks.length > 0 ? (
                      application.tasks.map((task) => (
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
              <ScrollArea className='p-1'>
                {application.coverLetterText || 'No cover letter provided'}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Students Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Studenter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3'>
              {sortedStudents.map((student) => (
                <Card
                  key={student.id}
                  className={`${student.id === application.studentRepresentative?.id ? 'border border-primary' : ''}`}
                >
                  <CardContent className='flex h-full flex-col gap-1 pt-4'>
                    <div className='flex flex-col gap-2'>
                      <h3 className='font-medium'>
                        {student.firstName} {student.lastName}
                      </h3>
                      {student.id === application.studentRepresentativeId && (
                        <div className='flex items-center gap-1 text-xs text-primary'>
                          <Star size={16} className='text-primary' />
                          <span className='text-muted-foreground'>Gruppeansvarlig</span>
                        </div>
                      )}
                      <p className='text-sm text-muted-foreground'>{student.email}</p>
                    </div>
                    <div className='mt-auto flex items-end gap-2'>
                      {student.files.map((file: File) => {
                        const handleClick = async (e: React.MouseEvent) => {
                          e.preventDefault();
                          try {
                            const pdfFile = await getBlobPdf(file.storageUrl);
                            const arrayBuffer = await pdfFile.arrayBuffer();
                            const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
                            const url = window.URL.createObjectURL(blob);

                            window.open(url, '_blank');

                            // Clean up the URL after opening
                            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
                          } catch (error) {
                            console.error('Error opening file:', error);
                          }
                        };

                        return (
                          <button
                            key={file.id}
                            onClick={handleClick}
                            className='rounded bg-primary/50 px-2 py-1 text-xs text-inherit transition-colors hover:bg-primary/70'
                          >
                            {file.documentType === 'CV' ? 'Vis CV' : 'Vis Karakterer'}
                          </button>
                        );
                      })}
                      {['CV', 'GRADES'].map(
                        (type) =>
                          !student.files.some((file: File) => file.documentType === type) && (
                            <span
                              key={type}
                              className='rounded bg-destructive px-2 py-1 text-xs text-primary-foreground'
                            >
                              Mangler {type === 'CV' ? 'CV' : 'Karakterer'}
                            </span>
                          )
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationView;
