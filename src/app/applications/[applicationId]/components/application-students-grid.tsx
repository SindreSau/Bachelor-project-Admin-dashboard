'use client';

import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Student, File } from '@prisma/client';
import { getBlobPdf } from '@/utils/blobstorage/get-files';

type StudentWithFiles = Student & {
  files: File[];
};

interface StudentsGridProps {
  students: StudentWithFiles[];
  studentRepresentativeId: number | null;
}

const ApplicationStudentsGrid = ({ students, studentRepresentativeId }: StudentsGridProps) => {
  // Sort students so that the representative always appears first
  const sortedStudents = [...students].sort((a, b) => {
    if (a.id === studentRepresentativeId) return -1;
    if (b.id === studentRepresentativeId) return 1;
    return 0;
  });

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Studenter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4'>
          {sortedStudents.map((student) => (
            <Card
              key={student.id}
              className={`${student.id === studentRepresentativeId ? 'border border-primary' : ''}`}
            >
              <CardContent className='flex h-full flex-col gap-1 pt-4'>
                <div className='flex flex-col gap-2'>
                  <h3 className='font-medium'>
                    {student.firstName} {student.lastName}
                  </h3>
                  {student.id === studentRepresentativeId && (
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
  );
};

export default ApplicationStudentsGrid;
