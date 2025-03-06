import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='flex h-full flex-1 flex-col gap-2'>
      {/* Application Details Card Skeleton */}
      <Card>
        <CardHeader className='space-y-2 pb-2'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-7 w-48' />
            <div className='flex gap-2'>
              <Skeleton className='h-9 w-24' />
              <Skeleton className='h-9 w-24' />
            </div>
          </div>
          <div className='flex flex-wrap gap-4'>
            <Skeleton className='h-5 w-32' />
            <Skeleton className='h-5 w-32' />
            <Skeleton className='h-5 w-32' />
          </div>
        </CardHeader>
        <CardContent className='pb-3'>
          <div className='flex items-center justify-between border-t pt-3'>
            <div className='flex gap-2'>
              <Skeleton className='h-8 w-8 rounded-full' />
              <Skeleton className='h-8 w-8 rounded-full' />
            </div>
            <Skeleton className='h-5 w-24' />
          </div>
        </CardContent>
      </Card>

      <div className='flex h-full flex-col-reverse gap-2 xl:flex-row-reverse'>
        {/* Comments Card Skeleton */}
        <Card className='flex h-full w-full flex-col xl:w-1/3'>
          <CardHeader className='pb-2'>
            <Skeleton className='h-7 w-32' />
          </CardHeader>
          <CardContent className='flex flex-col gap-4 overflow-y-auto'>
            <Skeleton className='h-32 w-full' />
            <div className='flex flex-col gap-4'>
              {Array(2)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className='rounded-lg border p-4'>
                    <div className='mb-2 flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Skeleton className='h-8 w-8 rounded-full' />
                        <Skeleton className='h-5 w-24' />
                      </div>
                      <Skeleton className='h-4 w-20' />
                    </div>
                    <Skeleton className='h-12 w-full' />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Cover Letter Skeleton */}
        <Card className='flex h-full w-full flex-col xl:w-2/3'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <Skeleton className='h-7 w-32' />
            <div className='flex gap-2'>
              {Array(2)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className='h-8 w-24' />
                ))}
            </div>
          </CardHeader>
          <CardContent className='flex-1 overflow-y-auto'>
            <Skeleton className='h-6 w-full' />
            <Skeleton className='mt-2 h-6 w-5/6' />
            <Skeleton className='mt-2 h-6 w-4/6' />
            <Skeleton className='mt-2 h-6 w-full' />
            <Skeleton className='mt-2 h-6 w-3/4' />
          </CardContent>
        </Card>
      </div>

      {/* Students Grid Skeleton */}
      <Card>
        <CardHeader className='pb-2'>
          <Skeleton className='h-7 w-32' />
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className={`${i === 0 ? 'border-primary' : ''}`}>
                  <CardContent className='space-y-4 pt-4'>
                    <Skeleton className='h-6 w-36' />
                    {i === 0 && (
                      <div className='flex items-center gap-1'>
                        <Skeleton className='h-4 w-4' />
                        <Skeleton className='h-4 w-32' />
                      </div>
                    )}
                    <Skeleton className='h-5 w-40' />
                    <div className='flex gap-2'>
                      <Skeleton className='h-8 w-16' />
                      <Skeleton className='h-8 w-24' />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
