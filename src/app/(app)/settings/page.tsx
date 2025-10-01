'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/context/user-provider';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { ShieldCheck, User, Lightbulb, MessageCircle } from 'lucide-react';
import { generateAdminDashboardSuggestions } from '@/ai/flows/admin-dashboard-suggestions';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  gender: z.string().min(1, 'Gender is required.'),
  specialization: z.string().min(2, 'Please enter your specialization.'),
  healthIssues: z.string().optional(),
});

const adminCodeFormSchema = z.object({
  adminCode: z.string().refine(val => val === '170321', {
    message: 'Invalid admin code.',
  }),
});

const suggestionFormSchema = z.object({
  userFeedback: z.string().min(10, 'Please provide more detailed feedback.'),
  usageData: z.string().min(10, 'Please provide more detailed usage data.'),
});


export default function SettingsPage() {
  const { user, setUser, isAdmin, setAdminStatus, feedback: userFeedbackItems } = useUser();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState('');
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: user || {},
  });

  const adminCodeForm = useForm<z.infer<typeof adminCodeFormSchema>>({
    resolver: zodResolver(adminCodeFormSchema),
    defaultValues: { adminCode: '' },
  });

  const suggestionForm = useForm<z.infer<typeof suggestionFormSchema>>({
    resolver: zodResolver(suggestionFormSchema),
    defaultValues: { userFeedback: '', usageData: '' },
  });

  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setUser(values);
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved.',
    });
  }

  function onAdminCodeSubmit() {
    setAdminStatus(true);
    toast({
      title: 'Admin Mode Enabled',
      description: 'You now have access to administrative features.',
    });
    adminCodeForm.reset();
  }

  const onSuggestionSubmit = async (values: z.infer<typeof suggestionFormSchema>) => {
    setIsLoadingSuggestions(true);
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
      setIsLoadingSuggestions(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-headline font-bold mb-6">Settings</h1>
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile"><User className="mr-2 h-4 w-4"/>Profile</TabsTrigger>
            <TabsTrigger value="admin"><ShieldCheck className="mr-2 h-4 w-4"/>Admin</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>Update your personal information here.</CardDescription>
              </CardHeader>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={profileForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization / Profession</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="healthIssues"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Health Issues or Concerns (Optional)</FormLabel>
                          <FormControl><Textarea {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Save Changes</Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
          
          <TabsContent value="admin">
            <div className="relative">
              {!isAdmin && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
                  <Card className="w-full max-w-sm">
                    <CardHeader>
                      <CardTitle>Admin Mode</CardTitle>
                      <CardDescription>Unlock administrative features for the app.</CardDescription>
                    </CardHeader>
                    <Form {...adminCodeForm}>
                      <form onSubmit={adminCodeForm.handleSubmit(onAdminCodeSubmit)}>
                        <CardContent>
                          <FormField
                            control={adminCodeForm.control}
                            name="adminCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Admin Code</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Enter secret code" {...field} />
                                </FormControl>
                                <FormDescription>Enter the code to enable admin mode.</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                        <CardFooter>
                          <Button type="submit">Enable Admin Mode</Button>
                        </CardFooter>
                      </form>
                    </Form>
                  </Card>
                </div>
              )}
              
              <div className={cn("space-y-8", { 'pointer-events-none': !isAdmin })}>
                 <div>
                  <h2 className="text-2xl font-headline font-bold">Admin Dashboard</h2>
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
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-semibold">{item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{item.feedback}</p>
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
                    <Form {...suggestionForm}>
                      <form onSubmit={suggestionForm.handleSubmit(onSuggestionSubmit)} className="space-y-6">
                        <FormField
                          control={suggestionForm.control}
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
                          control={suggestionForm.control}
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
                        <Button type="submit" disabled={isLoadingSuggestions}>
                          {isLoadingSuggestions ? 'Generating...' : 'Generate Suggestions'}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                {(isLoadingSuggestions || suggestions) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-6 w-6 text-primary" />
                        Actionable Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoadingSuggestions ? (
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
