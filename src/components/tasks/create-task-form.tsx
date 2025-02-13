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
import { DatePicker } from './date-picker';

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
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: '',
      taskDescription: '',
      deadline: null,
    },
  });

  const onSubmit = async (data: {
    taskName: string;
    taskDescription: string;
    deadline: Date | null;
  }) => {
    try {
      console.log(data);
      const deadline = data.deadline ? new Date(data.deadline) : null;

      await createTask({
        ...data,
        deadline: deadline ? deadline.toISOString() : null,
      });
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='my-6 rounded-lg border bg-card px-6 py-6 text-card-foreground shadow-sm'>
      <h2 className='mb-4 text-xl font-bold'>Legg til en oppgave</h2>
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
          <FormField
            control={form.control}
            name='deadline'
            render={({ field }) => (
              <FormItem>
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
          <Button type='submit'>Lagre</Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateTaskForm;
