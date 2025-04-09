'use client';
import { useState } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
import Spinner from '@/components/common/spinner';
import { MinimalTiptapEditor } from '../minimal-tiptap';
import { Card } from '../ui/card';
import { Content } from '@tiptap/react';
import { DatePicker } from './date-picker';

import { updateTask } from '@/actions/tasks/update-task';
import { createTask } from '@/actions/tasks/create-task';
import { Task } from '@prisma/client';

const taskSchema = z.object({
  taskName: z.string().min(2, { message: 'Tittel må være minst 2 tegn' }),
  taskDescription: z.string().min(2, { message: 'Beskrivelse må være minst 2 tegn' }),
  deadline: z.date().optional().nullable(),
  minStudents: z.number().min(0).max(10).default(3),
  maxStudents: z.number().min(0).max(15).default(5),
});
type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  isEditComponent?: boolean;
  task?: Task;
}

export default function TaskForm({ isEditComponent, task }: TaskFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftLoading, setIsDraftLoading] = useState(false);
  const [isPublishLoading, setIsPublishLoading] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  // Parse deadline from task to Date object if it exists
  const taskDeadline = task?.deadline ? new Date(task.deadline) : undefined;

  const defaultValues: TaskFormValues = {
    taskName: task?.taskName || '',
    taskDescription: task?.taskDescription || '',
    deadline: taskDeadline || undefined,
    minStudents: task?.minStudents ?? 3,
    maxStudents: task?.maxStudents ?? 5,
  };

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  const handleEditSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      if (task) {
        const { taskName, taskDescription, deadline, minStudents, maxStudents } = data;
        await updateTask(task.id, {
          taskName,
          taskDescription,
          deadline: deadline ? deadline.toISOString() : null,
          minStudents,
          maxStudents,
        });
        router.push('/prosjekter');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSubmit = async (data: TaskFormValues, publish: boolean) => {
    if (publish) {
      setIsPublishLoading(true);
    } else {
      setIsDraftLoading(true);
    }
    try {
      await createTask({
        ...data,
        deadline: data.deadline ? data.deadline.toISOString() : null,
        published: publish,
      });
      form.reset();
      setEditorKey((prev) => prev + 1);
      router.push('/prosjekter');
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      if (publish) {
        setIsPublishLoading(false);
      } else {
        setIsDraftLoading(false);
      }
    }
  };

  // Render the form fields for both create and edit modes
  const renderDeadlineAndStudentsFields = () => (
    <div className='flex flex-wrap space-x-4'>
      <FormField
        control={form.control}
        name='deadline'
        render={({ field }) => (
          <FormItem className='flex flex-col'>
            <FormLabel>Søknadsfrist</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(date)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='minStudents'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Min. studenter</FormLabel>
            <FormControl>
              <Input
                type='number'
                placeholder='Minimum'
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                min={0}
                max={10}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='maxStudents'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maks studenter</FormLabel>
            <FormControl>
              <Input
                type='number'
                placeholder='Maksimum'
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                min={0}
                max={15}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  return (
    <div className='bg-card text-card-foreground my-6 rounded-lg border px-6 py-6 shadow-xs'>
      <h2 className='mb-4 text-xl font-bold'>
        {isEditComponent ? 'Rediger oppgave' : 'Legg til en oppgave'}
      </h2>
      <Form {...form}>
        <form
          onSubmit={
            isEditComponent ? form.handleSubmit(handleEditSubmit) : (e) => e.preventDefault()
          }
          className='space-y-8 pt-4'
        >
          <FormField
            control={form.control}
            name='taskName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tittel</FormLabel>
                <FormControl>
                  <Input placeholder='Tittel' {...field} />
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
                  <Card className='overflow-hidden border'>
                    <MinimalTiptapEditor
                      key={editorKey}
                      value={field.value}
                      onChange={(newContent: Content) => {
                        const htmlString = typeof newContent === 'string' ? newContent : '';
                        field.onChange(htmlString);
                      }}
                      className='bg-background w-full'
                      editorContentClassName='p-4 min-h-[150px]'
                      output='html'
                      placeholder='Beskrivelse av oppgaven...'
                      editorClassName='focus:outline-none'
                    />
                  </Card>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Now render deadline and students fields for both create and edit modes */}
          {renderDeadlineAndStudentsFields()}

          <div className='flex space-x-4'>
            {isEditComponent ? (
              <>
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
              </>
            ) : (
              <>
                <Button
                  type='button'
                  onClick={() => form.handleSubmit((data) => handleCreateSubmit(data, false))()}
                  disabled={isDraftLoading || isPublishLoading}
                  className='bg-confirm hover:bg-confirm/80 disabled:bg-confirm/50 inline-flex cursor-pointer items-center'
                >
                  {isDraftLoading ? (
                    <>
                      <Spinner size='xs' className='mr-2' />
                      <span>Lagrer...</span>
                    </>
                  ) : (
                    <span>Lagre som utkast</span>
                  )}
                </Button>
                <Button
                  type='button'
                  onClick={() => form.handleSubmit((data) => handleCreateSubmit(data, true))()}
                  disabled={isDraftLoading || isPublishLoading}
                  className='inline-flex cursor-pointer items-center'
                >
                  {isPublishLoading ? (
                    <>
                      <Spinner size='xs' className='mr-2' />
                      <span>Publiserer...</span>
                    </>
                  ) : (
                    <span>Lagre og publiser</span>
                  )}
                </Button>
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
