'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import CustomAvatar from '@/components/common/custom-avatar';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteComment } from '@/actions/applications/comment-actions';
import { toast } from 'sonner';

interface CommentProps {
  id: number;
  user: string;
  date: string;
  content: string;
  isCurrentUser: boolean;
}

const Comment = ({ id, user, date, content, isCurrentUser }: CommentProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);

    deleteComment(id)
      .then((result) => {
        if (result.success) {
          toast.info('Kommentar slettet');
        } else {
          toast.error('Kunne ikke slette kommentar');
          console.error(result.error);
        }
      })
      .catch((err) => {
        toast.error('Kunne ikke slette kommentar');
        console.error(err);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <div className={`flex w-full ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <Card className={`w-4/5 ${isCurrentUser ? 'border bg-accent dark:bg-accent/50' : ''}`}>
        <CardHeader className='flex flex-row items-center justify-between px-3 py-2'>
          <div className='flex items-center gap-3'>
            <CustomAvatar size='sm' />
            <div className='font-medium'>{user}</div>
            <div className='text-sm text-muted-foreground'>
              {new Date(date).toLocaleDateString('no-NB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </div>
          </div>
          {isCurrentUser && (
            <Button
              variant='ghost'
              size='icon'
              className='h-7 w-7 -translate-y-1 text-destructive hover:bg-destructive/60'
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 />
            </Button>
          )}
        </CardHeader>

        <CardContent className='px-3 pb-3 pt-0 text-sm text-muted-foreground'>
          {content}
        </CardContent>
      </Card>
    </div>
  );
};

export default Comment;
