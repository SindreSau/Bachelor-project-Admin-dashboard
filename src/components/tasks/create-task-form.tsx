'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Tittel må være minst 2 tegn",
  }),
  description: z.string().min(2, {
    message: "Beskrivelse må være minst 2 tegn",
  }),
})

const CreateTaskForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
  })

  return (
    <div className='rounded-lg border bg-card my-6 px-6 py-6 text-card-foreground shadow-sm'>
      <h2 className="text-xl font-bold mb-4">Legg til en oppgave</h2>
      <Form {...form}>
        <form className="space-y-8 pt-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tittel</FormLabel>
                <FormControl>
                  <Input placeholder="Tittel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beskrivelse</FormLabel>
                <FormControl>
                  <Textarea placeholder="Beskrivelse" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Publiser</Button>
        </form>
      </Form>
    </div>
  )
}

export default CreateTaskForm;