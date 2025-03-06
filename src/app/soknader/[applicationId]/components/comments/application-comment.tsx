'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import CustomAvatar from '@/components/common/custom-avatar';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteComment } from '@/actions/applications/comment-actions';
import { toast } from 'sonner';
import { Comment as CommentType } from '@prisma/client';

interface CommentProps {
  comment: CommentType;
  isCurrentUser: boolean;
}

const Comment = ({ comment, isCurrentUser }: CommentProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteComment(comment.id);
      if (result.success) {
        toast.info('Kommentar slettet');
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
    <div className={`flex w-full ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <Card className={`w-4/5 ${isCurrentUser ? 'border bg-accent dark:bg-accent/50' : ''}`}>
        <CardHeader className='flex flex-row items-center justify-between px-3 py-2'>
          <div className='flex items-center gap-3'>
            <CustomAvatar
              size='sm'
              user={{
                id: comment.kindeUserId,
                given_name: comment.kindeGivenName,
                family_name: comment.kindeFamilyName,
                picture: comment.kindeUserImage,
              }}
            />
            <div className='font-medium'>
              <span className='md:hidden'>{comment.kindeGivenName}</span>
              <span className='hidden md:inline'>
                {comment.kindeGivenName} {comment.kindeFamilyName}
              </span>
            </div>
            <div className='text-sm text-muted-foreground'>{formattedDate}</div>
          </div>
          {isCurrentUser && (
            <Button
              variant='ghost'
              size='icon'
              className='h-7 w-7 -translate-y-1 text-destructive hover:bg-destructive/60'
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          )}
        </CardHeader>

        <CardContent className='px-3 pb-3 pt-0 text-sm text-muted-foreground'>
          {comment.commentText}
        </CardContent>
      </Card>
    </div>
  );
};

export default Comment;
