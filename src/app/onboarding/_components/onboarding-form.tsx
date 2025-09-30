'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { UserProfile } from '@/context/user-provider';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  gender: z.string().min(1, { message: 'Gender is required.' }),
  specialization: z.string().min(2, {
    message: 'Please enter your specialization or profession.',
  }),
  healthIssues: z.string().min(5, {
    message: 'Please describe any health issues or concerns.',
  }),
});

type OnboardingFormProps = {
  onOnboardingComplete: (data: UserProfile) => void;
};

export function OnboardingForm({ onOnboardingComplete }: OnboardingFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      gender: '',
      specialization: '',
      healthIssues: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onOnboardingComplete(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Profile</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Female" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialization / Profession</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Software Developer, Student" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="healthIssues"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Health Issues or Concerns</FormLabel>
                  <FormControl>
                    <Textarea placeholder="E.g., Anxiety, trouble sleeping" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Begin Your Journey
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
