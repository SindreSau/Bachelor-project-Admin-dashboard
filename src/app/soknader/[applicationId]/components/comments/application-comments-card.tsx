import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Comment from './application-comment';
import CommentInputField from './applications-comment-input';
import { Comment as CommentType } from '@prisma/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';

interface ApplicationCommentsProps {
  applicationId: number;
  comments: CommentType[];
  currentUser: KindeUser<Record<string, unknown>>;
}

const ApplicationComments = ({
  applicationId,
  comments,
  currentUser,
}: ApplicationCommentsProps) => {
  const hasComments = comments && comments.length > 0;

  return (
    <Card className='flex h-full w-full flex-col justify-between'>
      <CardHeader className='flex-none'>
        <CardTitle className='text-lg font-normal'>
          Kommentarer ({hasComments ? comments.length : 0})
        </CardTitle>
      </CardHeader>

      <div className='max-h-[35rem] flex-1 px-4'>
        {/* ScrollArea with explicit fixed height */}
        <ScrollArea className='h-64 xl:h-full' type='auto'>
          <div className='flex flex-col gap-2 pr-4 pb-2'>
            {!hasComments ? (
              <p className='text-sm text-gray-500'>Ingen kommentarer ennå.</p>
            ) : (
              comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  isCurrentUser={currentUser?.id === comment.kindeUserId}
                  user={currentUser}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {currentUser && (
        <div className='mt-2 flex-none px-4 pb-4'>
          <CommentInputField applicationId={applicationId} user={currentUser} />
        </div>
      )}
    </Card>
  );
};

export default ApplicationComments;
