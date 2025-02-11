'use client';

import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Student, File, Application } from '@prisma/client';
import { getBlobPdf } from '@/utils/blobstorage/get-files';
import { Star } from 'lucide-react';

type StudentWithFiles = Student & {
  files: File[];
};

type ApplicationWithStudentAndFiles = Application & {
  students: StudentWithFiles[];
  studentRepresentative: Student | null;
};

interface ApplicationViewProps {
  application: ApplicationWithStudentAndFiles;
}

const ApplicationView = ({ application }: ApplicationViewProps) => {
  // Sort students so that the representative always appears first
  const sortedStudents = [...application.students].sort((a, b) => {
    if (a.id === application.studentRepresentative?.id) return -1;
    if (b.id === application.studentRepresentative?.id) return 1;
    return 0;
  });

  return (
    <div className='flex h-full flex-col gap-2 p-2'>
      {/* Main Info Card */}
      <Card>
        <CardHeader className='grid grid-cols-1 pb-2'>
          <CardTitle>Søknadsdetaljer</CardTitle>
        </CardHeader>
        <CardContent className='py-2'>
          <ScrollArea className='w-full'>
            <div className='grid min-w-[500px] grid-cols-6'>{/* your info blocks */}</div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Cover Letter Card */}
      <Card className='grow'>
        <CardHeader>
          <CardTitle>Søknad</CardTitle>
        </CardHeader>
        <CardContent>
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
                <CardContent className='pt-4'>
                  <div className='space-y-2'>
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
                    <div className='flex gap-2'>
                      {student.files.map((file) => {
                        const handleClick = async (e: React.MouseEvent) => {
                          e.preventDefault();
                          try {
                            const pdfFile = await getBlobPdf(file.storageUrl);
                            const arrayBuffer = await pdfFile.arrayBuffer();
                            const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
                            const url = window.URL.createObjectURL(blob);
                            window.open(url, '_blank');
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
                      {!student.files.some((file) => file.documentType === 'CV') && (
                        <span className='rounded bg-red-500/70 px-2 py-1 text-xs text-white'>
                          Mangler CV
                        </span>
                      )}
                      {!student.files.some((file) => file.documentType === 'GRADES') && (
                        <span className='rounded bg-red-500/70 px-2 py-1 text-xs text-white'>
                          Mangler Karakterer
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationView;
