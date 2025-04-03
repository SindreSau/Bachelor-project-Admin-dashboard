'use client';

import { useState } from 'react';
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
import { createTask } from '@/actions/tasks/create-task';
import { DatePicker } from './date-picker';
import Spinner from '@/components/common/spinner';
import { MinimalTiptapEditor } from '../minimal-tiptap';
import { Card } from '../ui/card';
import { Content } from '@tiptap/react';

const formSchema = z.object({
  taskName: z.string().min(2, {
    message: 'Tittel må være minst 2 tegn',
  }),
  taskDescription: z.string().min(2, {
    message: 'Beskrivelse må være minst 2 tegn',
  }),
  deadline: z.date().optional().nullable(),
});

const CreateTaskForm = () => {
  // Track loading states for both buttons
  const [isDraftLoading, setIsDraftLoading] = useState(false);
  const [isPublishLoading, setIsPublishLoading] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: '',
      taskDescription: '',
      deadline: null,
    },
  });

  const onSubmit = async (
    data: {
      taskName: string;
      taskDescription: string;
      deadline: Date | null;
    },
    publish: boolean
  ) => {
    // Set the appropriate loading state based on which button was clicked
    if (publish) {
      setIsPublishLoading(true);
    } else {
      setIsDraftLoading(true);
    }

    try {
      const deadline = data.deadline ? new Date(data.deadline) : null;

      await createTask({
        ...data,
        deadline: deadline ? deadline.toISOString() : null,
        published: publish,
      });
      form.reset();
      setEditorKey(prev => prev + 1); // Reset editor state

    } catch (error) {
      console.error(error);
    } finally {
      // Reset loading states regardless of outcome
      if (publish) {
        setIsPublishLoading(false);
      } else {
        setIsDraftLoading(false);
      }
    }
  };

  const handleSaveClick = () => {
    form.handleSubmit((data) => onSubmit(data, false))();
  };

  const handleSaveAndPublishClick = () => {
    form.handleSubmit((data) => onSubmit(data, true))();
  };

  return (
    <div className='bg-card text-card-foreground my-6 rounded-lg border px-6 py-6 shadow-xs'>
      <h2 className='mb-4 text-xl font-bold'>Legg til en oppgave</h2>
      <Form {...form}>
        <form className='space-y-8 pt-4'>
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
                  <Card className='overflow-hidden border'>
                    <MinimalTiptapEditor
                      key={editorKey}
                      value={field.value}
                      onChange={(newContent: Content) => {
                        // For HTML output, cast to string for form value
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
          <div className='flex space-x-2'>
            <Button
              type='button'
              onClick={handleSaveClick}
              disabled={isDraftLoading || isPublishLoading}
              className='bg-confirm hover:bg-confirm/80 disabled:bg-confirm/50 inline-flex items-center'
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
              onClick={handleSaveAndPublishClick}
              disabled={isDraftLoading || isPublishLoading}
              className='inline-flex items-center'
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
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateTaskForm;
