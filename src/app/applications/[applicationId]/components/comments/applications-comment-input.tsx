'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { addComment } from '@/actions/applications/comment-actions';

interface CommentInputFieldProps {
  applicationId?: number; // Optional if you want to pass it from the parent
  userId: string; // You would typically get this from your auth context
}

const CommentInputField = ({ applicationId = 1, userId }: CommentInputFieldProps) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Don't submit if comment is empty
    if (!comment.trim()) {
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const result = await addComment({
        applicationId,
        commentText: comment,
        userId,
      });

      if (result.success) {
        setComment(''); // Clear the input field
        setStatus('success');
        // Here you would typically trigger a refresh of the comments list
      } else {
        setStatus('error');
        console.error(result.error);
      }
    } catch (err) {
      setStatus('error');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='border-t p-4'>
      <form onSubmit={handleSubmit}>
        <Textarea
          placeholder='Skriv en kommentar...'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className='mb-2 min-h-[80px] w-full'
          disabled={isSubmitting}
        />

        {status === 'error' && (
          <p className='mb-2 text-sm text-red-500'>Kunne ikke sende kommentar</p>
        )}

        {status === 'success' && <p className='mb-2 text-sm text-green-500'>Kommentar sendt</p>}

        <Button type='submit' disabled={isSubmitting} className='w-full'>
          {isSubmitting ? 'Sender...' : 'Send kommentar'}
        </Button>
      </form>
    </div>
  );
};

export default CommentInputField;
