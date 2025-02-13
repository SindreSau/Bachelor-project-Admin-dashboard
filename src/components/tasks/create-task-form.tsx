'use client';

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
import { createTask } from '@/actions/tasks/create-task';

const formSchema = z.object({
  taskName: z.string().min(2, {
    message: 'Tittel må være minst 2 tegn',
  }),
  taskDescription: z.string().min(2, {
    message: 'Beskrivelse må være minst 2 tegn',
  }),
});

const CreateTaskForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: '',
      taskDescription: '',
    },
  });

  return (
    <div className='rounded-lg border bg-card p-6 shadow-sm'>
      <h2 className='mb-6 text-2xl font-semibold'>Legg til en oppgave</h2>
      <Form {...form}>
        <form
          action={createTask}
          onSubmit={() => {
            form.reset();
          }}
          className='space-y-6'
        >
          <FormField
            control={form.control}
            name='taskName'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-base'>Tittel</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Tittel'
                    {...field}
                    value={field.value || ''}
                    className='w-full'
                  />
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
                <FormLabel className='text-base'>Beskrivelse</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Beskrivelse'
                    {...field}
                    value={field.value || ''}
                    className='min-h-[100px] w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='w-full md:w-auto'>
            Lagre
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateTaskForm;
