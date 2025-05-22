'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import CustomAvatar from '@/components/common/custom-avatar';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { restoreComment, deleteComment } from '@/actions/applications/comment-actions';
import { toast } from 'sonner';
import { Comment as CommentType } from '@prisma/client';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';

interface CommentProps {
  comment: CommentType;
  isCurrentUser: boolean;
  user: KindeUser<Record<string, unknown>>;
}

const Comment = ({ comment, isCurrentUser, user }: CommentProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteComment(comment.id, user as KindeUser<void>);
      if (result.success) {
        toast('Kommentar slettet', {
          duration: 10000,
          action: {
            label: 'Angre',
            onClick: async () => {
              await restoreComment(comment.id, user as KindeUser<void>);
            },
          },
        });
      } else {
        toast.error('Kunne ikke slette kommentar');
        console.error(result.error);
      }
    } catch (err) {
      toast.error('Kunne ikke slette kommentar');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format the date
  const formattedDate = new Date(comment.createdAt).toLocaleDateString('no-NB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div
      className={`@container flex w-full ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <Card className={`w-4/5 ${isCurrentUser ? 'bg-accent/10 border' : ''}`}>
        <CardHeader className='flex flex-row items-center justify-between px-3 py-2'>
          <div className='flex items-center gap-3'>
            <CustomAvatar
              size='sm'
              userData={{
                id: isCurrentUser ? user.id : comment.kindeUserId,
                given_name: isCurrentUser ? user.given_name : comment.kindeGivenName,
                family_name: isCurrentUser ? user.family_name : comment.kindeFamilyName,
                picture: isCurrentUser ? user.picture : comment.kindeUserImage,
              }}
            />
            <div className='font-medium'>
              <span className='@sm:hidden'>{comment.kindeGivenName}</span>
              <span className='hidden @sm:inline'>
                {comment.kindeGivenName} {comment.kindeFamilyName}
              </span>
            </div>
            <div className='text-muted-foreground text-sm'>{formattedDate}</div>
          </div>
          {isCurrentUser && (
            <Button
              variant='ghost'
              size='icon'
              className='text-destructive hover:bg-destructive/60 h-7 w-7 -translate-y-1 cursor-pointer'
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          )}
        </CardHeader>

        <CardContent className='px-3 pt-0 pb-3 text-sm'>{comment.commentText}</CardContent>
      </Card>
    </div>
  );
};

export default Comment;
