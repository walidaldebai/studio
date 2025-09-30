'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateAdminDashboardSuggestions } from '@/ai/flows/admin-dashboard-suggestions';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, MessageCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  userFeedback: z.string().min(10, 'Please provide more detailed feedback.'),
  usageData: z.string().min(10, 'Please provide more detailed usage data.'),
});

export default function AdminPage() {
  const { isAdmin, isLoaded, feedback: userFeedbackItems } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { userFeedback: '', usageData: '' },
  });

  useEffect(() => {
    if (isLoaded && !isAdmin) {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'You must be an admin to view this page.',
      });
      router.replace('/dashboard');
    }
  }, [isAdmin, isLoaded, router, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSuggestions('');
    try {
      const result = await generateAdminDashboardSuggestions(values);
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate suggestions at this time.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || !isAdmin) {
    return <div className="flex h-screen items-center justify-center"><p>Checking permissions...</p></div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Oversee app feedback and generate AI-powered improvements.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-primary" />
              Live User Feedback
            </CardTitle>
            <CardDescription>Feedback submitted by users from the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            {userFeedbackItems && userFeedbackItems.length > 0 ? (
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {userFeedbackItems.map((item) => (
                  <div key={item.id} className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.feedback}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No feedback has been submitted yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Suggestion Generator</CardTitle>
            <CardDescription>Provide summarized user feedback and usage data to get improvement ideas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="userFeedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Feedback Summary</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="E.g., 'Users are enjoying the Rant Chat but find the UI confusing. Many have requested a feature to save conversations...'"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="usageData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>App Usage Data Summary</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="E.g., 'Rant Chat DAU is up 20%. Guidance feature has a 50% drop-off rate after the first use. 75% of users are on the dark theme...'"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Generating...' : 'Generate Suggestions'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {(isLoading || suggestions) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-primary" />
                Actionable Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {suggestions}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
