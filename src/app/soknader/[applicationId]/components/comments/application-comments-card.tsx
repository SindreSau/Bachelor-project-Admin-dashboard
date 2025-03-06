import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Comment from './application-comment';
import CommentInputField from './applications-comment-input';

interface CommentType {
  id: number;
  commentText: string;
  userId: string;
  createdAt: Date;
}

interface ApplicationCommentsProps {
  applicationId: number;
  comments: CommentType[];
  currentUserName?: string;
}

const ApplicationComments = ({
  applicationId,
  comments,
  currentUserName,
}: ApplicationCommentsProps) => {
  const hasComments = comments && comments.length > 0;

  return (
    <Card className='w-full xl:max-w-xs'>
      <CardHeader>
        <CardTitle className='text-lg font-normal'>
          Kommentarer ({hasComments ? comments.length : 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-2'>
          {!hasComments ? (
            <p className='text-sm text-gray-500'>Ingen kommentarer ennå.</p>
          ) : (
            comments.map((comment) => (
              <Comment
                key={comment.id}
                id={comment.id}
                user={comment.userId}
                date={comment.createdAt?.toLocaleDateString('nb-NO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                content={comment.commentText}
                isCurrentUser={comment.userId === currentUserName}
              />
            ))
          )}
        </div>
      </CardContent>
      {currentUserName && (
        <CommentInputField applicationId={applicationId} userId={currentUserName} />
      )}
    </Card>
  );
};

export default ApplicationComments;
