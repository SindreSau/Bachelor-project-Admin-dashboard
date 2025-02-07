'use client';

import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Student, File, Application } from '@prisma/client';

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
  return (
    <div className='flex h-full flex-col gap-2 p-2'>
      {/* Main Info Card */}
      <Card>
        <CardHeader className='grid grid-cols-1 pb-2'>
          <CardTitle>Application Details</CardTitle>
        </CardHeader>
        <CardContent className='py-2'>
          <ScrollArea className='w-full'>
            <div className='grid min-w-[500px] grid-cols-6'>
              <div className='space-y-0.5'>
                <p className='text-sm font-medium text-muted-foreground'>Group ID</p>
                <p className='text-sm'>{application.id}</p>
              </div>
              <div className='space-y-0.5'>
                <p className='text-sm font-medium text-muted-foreground'>School</p>
                <p className='text-sm'>{application.school}</p>
              </div>
              <div className='space-y-0.5'>
                <p className='text-sm font-medium text-muted-foreground'>Applied At</p>
                <p className='text-sm'>
                  {application.createdAt?.toLocaleDateString('nb-NO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className='space-y-0.5'>
                <p className='text-sm font-medium text-muted-foreground'>Updated At</p>
                <p className='text-sm'>
                  {application.updatedAt?.toLocaleDateString('nb-NO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className='space-y-0.5'>
                <p className='text-sm font-medium text-muted-foreground'>Status</p>
                <p className='text-sm'>In Review</p>
              </div>
              <div className='space-y-0.5'>
                <p className='text-sm font-medium text-muted-foreground'>Ratings</p>
                <p></p>
              </div>
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Cover Letter Card */}
      <Card className='grow'>
        <CardHeader>
          <CardTitle>Cover Letter</CardTitle>
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
          <CardTitle>Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3'>
            {application.students.map((student, index) => (
              <Card key={index}>
                <CardContent className='pt-4'>
                  <div className='space-y-2'>
                    <h3 className='font-medium'>
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className='text-sm text-muted-foreground'>{student.email}</p>
                    <div className='flex gap-2'>
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          student.files.some((file) => file.documentType === 'CV')
                            ? 'bg-primary/50 text-inherit'
                            : 'bg-red-500/70 text-white'
                        }`}
                      >
                        {student.files.some((file) => file.documentType === 'CV')
                          ? 'CV Attached'
                          : 'Missing CV'}
                      </span>
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          student.files.some((file) => file.documentType === 'GRADES')
                            ? 'bg-primary/50 text-inherit'
                            : 'bg-red-500/70 text-white'
                        }`}
                      >
                        {student.files.some((file) => file.documentType === 'GRADES')
                          ? 'Grades Attached'
                          : 'Missing Grades'}
                      </span>
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
