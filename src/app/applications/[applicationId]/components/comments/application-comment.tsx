import { Card, CardHeader, CardContent } from '@/components/ui/card';
import CustomAvatar from '@/components/common/custom-avatar';

interface CommentProps {
  user: string;
  date: string;
  content: string;
  isCurrentUser: boolean;
}

const Comment = ({ user, date, content, isCurrentUser }: CommentProps) => {
  return (
    <Card className={`w-full ${isCurrentUser ? 'bg-accent dark:bg-accent/50' : ''}`}>
      <CardHeader className='px-3 py-2'>
        <div className={`flex items-center gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
          <CustomAvatar />
          <div className='font-medium'>{user}</div>
          <div className='text-sm text-muted-foreground'>{date}</div>
        </div>
      </CardHeader>

      <CardContent className='px-3 pb-3 pt-0 text-sm text-muted-foreground'>{content}</CardContent>
    </Card>
  );
};

export default Comment;
