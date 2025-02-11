'use client';

import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Student, File, Application } from '@prisma/client';
import { concatGroupName } from '@/lib/utils';
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
  return (
    <div className='flex h-full flex-col gap-2 p-2'>
      {/* Main Info Card */}
      <Card>
        <CardHeader className='grid grid-cols-1 pb-2'>
          <CardTitle>Søknadsdetaljer</CardTitle>
        </CardHeader>
        <CardContent className='py-2'>
          <ScrollArea className='w-full'>
            <div className='grid min-w-[500px] grid-cols-6'>
              <div className='space-y-0.5'>
                <p className='text-sm font-medium text-muted-foreground'>Gruppenavn</p>
                <p className='text-sm'>{concatGroupName(application.students)}</p>
              </div>
              <div className='space-y-0.5'>
                <p className='text-sm font-medium text-muted-foreground'>Skole</p>
                <p className='text-sm'>{application.school}</p>
              </div>
              <div className='space-y-0.5'>
                <p className='text-sm font-medium text-muted-foreground'>Søknadsdato</p>
                <p className='text-sm'>
                  {application.createdAt?.toLocaleDateString('nb-NO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className='space-y-0.5'>
                <p className='text-sm font-medium text-muted-foreground'>Sist Oppdatert</p>
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
                <p className='text-sm'>Pågående</p>
              </div>
              <div className='space-y-0.5'>
                <p className='text-sm font-medium text-muted-foreground'>Vurdering</p>
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
            {application.students.map((student, index) => (
              <Card
                key={index}
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
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          student.files.some((file) => file.documentType === 'CV')
                            ? 'bg-primary/50 text-inherit'
                            : 'bg-red-500/70 text-white'
                        }`}
                      >
                        {student.files.some((file) => file.documentType === 'CV')
                          ? 'Vis CV'
                          : 'Mangler CV'}
                      </span>
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          student.files.some((file) => file.documentType === 'GRADES')
                            ? 'bg-primary/50 text-inherit'
                            : 'bg-red-500/70 text-white'
                        }`}
                      >
                        {student.files.some((file) => file.documentType === 'GRADES')
                          ? 'Vis Karakterer'
                          : 'Mangler Karakterer'}
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
