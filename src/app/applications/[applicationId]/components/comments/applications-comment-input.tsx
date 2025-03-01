'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { addComment } from '@/actions/applications/comment-actions';
import { toast } from 'sonner';

interface CommentInputFieldProps {
  applicationId: number;
  userId: string;
  maxLength?: number;
}

const CommentInputField = ({ applicationId, userId, maxLength = 400 }: CommentInputFieldProps) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!comment.trim()) {
      return;
    }

    if (comment.length > maxLength) {
      toast.error(`Kommentar kan ikke være mer enn ${maxLength} tegn`);
      return;
    }

    setIsSubmitting(true);

    // Using promise chain instead of async/await
    addComment({
      applicationId,
      commentText: comment,
      userId,
    })
      .then((result) => {
        if (result.success) {
          setComment(''); // Clear input field
          toast.success('Kommentar sendt');
        } else {
          toast.error('Kunne ikke sende kommentar');
          console.error(result.error);
        }
      })
      .catch((err) => {
        toast.error('Kunne ikke sende kommentar');
        console.error(err);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const charCount = comment.length;
  const isOverLimit = charCount > maxLength;

  return (
    <div className='border-t p-4'>
      <form onSubmit={handleSubmit}>
        <div className='relative'>
          <Textarea
            placeholder='Skriv en kommentar...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={`mb-2 min-h-[80px] w-full ${isOverLimit ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
          />
        </div>

        <Button
          type='submit'
          disabled={isSubmitting || isOverLimit || !comment.trim()}
          className='w-full'
        >
          {isSubmitting ? 'Sender...' : 'Send kommentar'}
        </Button>
      </form>
    </div>
  );
};

export default CommentInputField;
