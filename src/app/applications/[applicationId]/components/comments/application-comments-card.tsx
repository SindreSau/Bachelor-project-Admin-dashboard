import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Comment from './application-comment';
import CommentInputField from '../comments/applications-comment-input';

interface CommentType {
  id: number;
  commentText: string;
  userId: string;
  createdAt: Date;
}

interface ApplicationCommentsProps {
  applicationId: number;
  comments: CommentType[];
  currentUserId?: string;
}

const ApplicationComments = ({
  applicationId,
  comments,
  currentUserId,
}: ApplicationCommentsProps) => {
  // For demo purposes, you would replace this with actual data from your backend
  // feks const user = useAuthUser();

  const hasComments = comments && comments.length > 0;

  return (
    <Card className='w-full xl:max-w-xs'>
      <CardHeader>
        <CardTitle>Kommentarer ({hasComments ? comments.length : 0})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-2'>
          {!hasComments ? (
            <p className='text-sm text-gray-500'>Ingen kommentarer ennå.</p>
          ) : (
            comments.map((comment) => (
              <Comment
                key={comment.id}
                user={comment.userId} // You might want to fetch user names from somewhere
                date={comment.createdAt?.toLocaleDateString('nb-NO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                content={comment.commentText}
                isCurrentUser={comment.userId === currentUserId}
              />
            ))
          )}
        </div>
      </CardContent>
      {currentUserId && <CommentInputField applicationId={applicationId} userId={currentUserId} />}
    </Card>
  );
};

export default ApplicationComments;
