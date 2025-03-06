import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Comment from './application-comment';
import CommentInputField from './applications-comment-input';
import { Comment as CommentType } from '@prisma/client';
import { ScrollArea } from '@/components/ui/scroll-area';

interface User {
  id: string;
  given_name: string;
  family_name: string;
  picture: string;
}

interface ApplicationCommentsProps {
  applicationId: number;
  comments: CommentType[];
  currentUser?: User;
}

const ApplicationComments = ({
  applicationId,
  comments,
  currentUser,
}: ApplicationCommentsProps) => {
  const hasComments = comments && comments.length > 0;

  return (
    <Card className='flex h-full w-full flex-col'>
      <CardHeader className='flex-none'>
        <CardTitle className='text-lg font-normal'>
          Kommentarer ({hasComments ? comments.length : 0})
        </CardTitle>
      </CardHeader>
      <CardContent className='flex-grow overflow-hidden p-0 pl-4 pr-4'>
        <ScrollArea className='h-full max-h-[400px] pr-4'>
          <div className='flex flex-col gap-2 pb-2'>
            {!hasComments ? (
              <p className='text-sm text-gray-500'>Ingen kommentarer ennå.</p>
            ) : (
              comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  isCurrentUser={currentUser?.id === comment.kindeUserId}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
      {currentUser && (
        <div className='flex-none'>
          <CommentInputField applicationId={applicationId} user={currentUser} />
        </div>
      )}
    </Card>
  );
};

export default ApplicationComments;
