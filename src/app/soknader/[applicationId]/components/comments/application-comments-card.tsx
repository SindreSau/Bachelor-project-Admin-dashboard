'use client';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Comment from './application-comment';
import CommentInputField from './applications-comment-input';
import { Comment as CommentType } from '@prisma/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';
import { useRef, useEffect } from 'react';
import autoAnimate from '@formkit/auto-animate';

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
  const commentsContainerRef = useRef(null);

  useEffect(() => {
    if (commentsContainerRef.current) {
      autoAnimate(commentsContainerRef.current);
    }
  }, [commentsContainerRef]);

  return (
    <Card className='flex h-full w-full flex-col justify-between'>
      <div className='flex flex-col gap-2'>
        <CardHeader className='flex-none'>
          <CardTitle className='text-lg font-normal'>
            Kommentarer ({hasComments ? comments.length : 0})
          </CardTitle>
        </CardHeader>

        <div className='relative max-h-[50vh] flex-1 px-4'>
          {/* ScrollArea with explicit fixed height */}
          <ScrollArea className='h-64 xl:h-full' type='auto'>
            <div ref={commentsContainerRef} className='flex flex-col gap-2 pr-4 pb-8'>
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

          {/* Gradient fade-out effect at the bottom */}
          <div className='from-card pointer-events-none absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t to-transparent'></div>
        </div>
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
