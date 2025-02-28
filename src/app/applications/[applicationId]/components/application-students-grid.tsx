'use client';

import { useState } from 'react';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Crown, ExternalLink } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Student, File } from '@prisma/client';
import { getBlobPdf } from '@/utils/blobstorage/get-files';
import Spinner from '@/components/common/spinner';

type StudentWithFiles = Student & {
  files: File[];
};

interface StudentsGridProps {
  students: StudentWithFiles[];
  studentRepresentativeId: number | null;
}

const ApplicationStudentsGrid = ({ students, studentRepresentativeId }: StudentsGridProps) => {
  // Track loading state for each file
  const [loadingFiles, setLoadingFiles] = useState<Record<number, boolean>>({});

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
                      <Crown size={16} className='text-primary' />
                      <span className='text-muted-foreground'>Gruppeansvarlig</span>
                    </div>
                  )}
                  <ScrollArea className='w-full'>
                    <div className='pb-3'>
                      <p className='whitespace-nowrap pr-4 text-sm text-muted-foreground'>
                        {student.email}
                      </p>
                    </div>
                    <ScrollBar orientation='horizontal' />
                  </ScrollArea>
                </div>
                <div className='mt-auto flex items-end gap-2'>
                  {student.files.map((file: File) => {
                    const isLoading = loadingFiles[file.id] || false;

                    const handleClick = async (e: React.MouseEvent) => {
                      e.preventDefault();

                      // Set loading state for this file
                      setLoadingFiles((prev) => ({ ...prev, [file.id]: true }));
                      await new Promise((resolve) => setTimeout(resolve, 4000));

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
                      } finally {
                        // Reset loading state regardless of outcome
                        setLoadingFiles((prev) => ({ ...prev, [file.id]: false }));
                      }
                    };

                    return (
                      <button
                        key={file.id}
                        onClick={handleClick}
                        disabled={isLoading}
                        className='flex items-center justify-center rounded bg-primary/50 px-2 py-1 text-xs text-inherit transition-colors hover:bg-primary/70 disabled:cursor-not-allowed disabled:bg-primary/25'
                      >
                        <span>{file.documentType === 'CV' ? 'CV' : 'Karakterer'}</span>
                        {isLoading ? (
                          <Spinner size='xs' className='ml-2' />
                        ) : (
                          <ExternalLink className='ml-2 h-3 w-3' />
                        )}
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
