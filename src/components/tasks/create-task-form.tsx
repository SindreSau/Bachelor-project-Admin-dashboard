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
    <div className='my-6 rounded-lg border bg-card px-6 py-6 text-card-foreground shadow-sm'>
      <h2 className='mb-4 text-xl font-bold'>Legg til en oppgave</h2>
      <Form {...form}>
        <form
          action={createTask}
          onSubmit={() => {
            form.reset();
          }}
          className='space-y-8 pt-4'
        >
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
          <Button type='submit'>Lagre</Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateTaskForm;
