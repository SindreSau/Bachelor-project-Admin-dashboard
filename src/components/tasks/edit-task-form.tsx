'use client';
import React, { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';
import { Task } from '@prisma/client';
import { updateTask } from '@/actions/tasks/update-task';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Spinner from '@/components/common/spinner';

const formSchema = z.object({
  taskName: z.string().min(2, {
    message: 'Tittel må være minst 2 tegn',
  }),
  taskDescription: z.string().min(2, {
    message: 'Beskrivelse må være minst 2 tegn',
  }),
});

const EditTaskForm = ({ task }: { task: Task }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: task.taskName,
      taskDescription: task.taskDescription || '',
    },
  });

  const router = useRouter();

  const onSubmit = async (data: { taskName: string; taskDescription: string }) => {
    setIsSubmitting(true);
    try {
      await updateTask(task.id, data);
      router.push('/prosjekter');
    } catch (error) {
      console.error('Error updating task:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className='my-6 rounded-lg border bg-card px-6 py-6 text-card-foreground shadow-xs'>
      <h2 className='mb-4 text-xl font-bold'>Rediger oppgave</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 pt-4'>
          <FormField
            control={form.control}
            name='taskName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tittel</FormLabel>
                <FormControl>
                  <Input placeholder='Tittel' {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='taskDescription'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beskrivelse</FormLabel>
                <FormControl>
                  <Textarea placeholder='Beskrivelse' {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex space-x-4'>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='inline-flex items-center disabled:cursor-not-allowed'
            >
              {isSubmitting ? (
                <>
                  <Spinner size='xs' className='mr-2' />
                  <span>Lagrer...</span>
                </>
              ) : (
                'Lagre'
              )}
            </Button>
            <Link href='/prosjekter'>
              <Button type='button' variant='secondary' disabled={isSubmitting}>
                Avbryt
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditTaskForm;
