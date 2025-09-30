'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/context/user-provider';
import { getPersonalizedWellnessAdvice } from '@/ai/flows/personalized-wellness-advice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { BrainCircuit } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  needs: z.string().min(10, {
    message: 'Please describe your needs in at least 10 characters.',
  }),
});

export default function GuidancePage() {
  const { user } = useUser();
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { needs: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    setIsLoading(true);
    setAdvice('');

    try {
      const response = await getPersonalizedWellnessAdvice({
        ...user,
        needs: values.needs,
      });
      setAdvice(response.advice);
    } catch (error) {
      console.error('Failed to get advice:', error);
      setAdvice('Sorry, I was unable to generate advice at this time. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Personalized Guidance</CardTitle>
            <CardDescription>
              Based on your profile, what specific wellness questions do you have today?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="needs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>My wellness needs</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="E.g., 'How can I improve my sleep quality?' or 'Suggest some quick relaxation exercises for a busy day.'"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Generating...' : 'Get My Advice'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {(isLoading || advice) && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <BrainCircuit className="h-6 w-6" /> Your AI-Powered Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {advice}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
