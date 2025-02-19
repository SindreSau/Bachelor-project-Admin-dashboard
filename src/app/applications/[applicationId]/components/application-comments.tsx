import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import CustomAvatar from '@/components/common/custom-avatar';

const ApplicationComments = () => {
  return (
    <Card className='w-full xl:max-w-xs'>
      <CardHeader>
        <CardTitle>Kommentarer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-1'>
          <Card>
            <CardHeader className=''>
              <div className='flex items-center gap-3'>
                <CustomAvatar />
                <div className='font-medium'>Jens</div>
              </div>
              <div className='text-sm text-muted-foreground'>12. april 2021</div>
            </CardHeader>

            <CardContent className='text-sm text-muted-foreground'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec nisl nec nisl
              consectetur adipiscing elit. Nulla nec nisl nec nisl.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className=''>
              <div className='flex items-center gap-3'>
                <CustomAvatar />
                <div className='font-medium'>Daniel</div>
              </div>
              <div className='text-sm text-muted-foreground'>12. april 2021</div>
            </CardHeader>

            <CardContent className='text-sm text-muted-foreground'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationComments;
