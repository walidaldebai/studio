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
import { useEffect, useState } from 'react';
import { ShieldCheck, User, Lightbulb } from 'lucide-react';
import { generateAdminDashboardSuggestions } from '@/ai/flows/admin-dashboard-suggestions';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useAppTranslation } from '@/context/language-provider';


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
  const { user, setUser, isAdmin, setAdminStatus } = useUser();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState('');
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { t } = useAppTranslation();

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

  useEffect(() => {
    if (user) {
      profileForm.reset(user);
    }
  }, [user, profileForm]);

  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setUser(values);
    toast({
      title: t('settingsPage.profileUpdated'),
      description: t('settingsPage.profileUpdatedDesc'),
    });
  }

  function onAdminCodeSubmit() {
    setAdminStatus(true);
    toast({
      title: t('settingsPage.adminEnabled'),
      description: t('settingsPage.adminEnabledDesc'),
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
        <h1 className="text-3xl font-headline font-bold mb-6">{t('settingsPage.title')}</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile"><User className="mr-2 h-4 w-4"/>{t('settingsPage.profileTab')}</TabsTrigger>
            <TabsTrigger value="admin" onClick={() => !isAdmin && adminCodeForm.setFocus('adminCode')}><ShieldCheck className="mr-2 h-4 w-4"/>{t('settingsPage.adminTab')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{t('settingsPage.profileTitle')}</CardTitle>
                <CardDescription>{t('settingsPage.profileDescription')}</CardDescription>
              </CardHeader>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('settingsPage.name')}</FormLabel>
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
                          <FormLabel>{t('settingsPage.gender')}</FormLabel>
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
                          <FormLabel>{t('settingsPage.specialization')}</FormLabel>
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
                          <FormLabel>{t('settingsPage.healthIssues')}</FormLabel>
                          <FormControl><Textarea {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">{t('settingsPage.saveChanges')}</Button>
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
                      <CardTitle>{t('settingsPage.adminMode')}</CardTitle>
                      <CardDescription>{t('settingsPage.adminDescription')}</CardDescription>
                    </CardHeader>
                    <Form {...adminCodeForm}>
                      <form onSubmit={adminCodeForm.handleSubmit(onAdminCodeSubmit)}>
                        <CardContent>
                          <FormField
                            control={adminCodeForm.control}
                            name="adminCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('settingsPage.adminCode')}</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder={t('settingsPage.adminCodePlaceholder')} {...field} />
                                </FormControl>
                                <FormDescription>{t('settingsPage.adminCodeDesc')}</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                        <CardFooter>
                          <Button type="submit">{t('settingsPage.enableAdmin')}</Button>
                        </CardFooter>
                      </form>
                    </Form>
                  </Card>
                </div>
              )}
              
              <div className={cn("space-y-8", { 'pointer-events-none opacity-50': !isAdmin })}>
                 <div>
                  <h2 className="text-2xl font-headline font-bold">{t('settingsPage.adminDashboard')}</h2>
                  <p className="text-muted-foreground">{t('settingsPage.adminDashboardDesc')}</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('settingsPage.aiSuggestionGenerator')}</CardTitle>
                    <CardDescription>{t('settingsPage.aiSuggestionGeneratorDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...suggestionForm}>
                      <form onSubmit={suggestionForm.handleSubmit(onSuggestionSubmit)} className="space-y-6">
                        <FormField
                          control={suggestionForm.control}
                          name="userFeedback"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('settingsPage.userFeedback')}</FormLabel>
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
                              <FormLabel>{t('settingsPage.usageData')}</FormLabel>
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
                          {isLoadingSuggestions ? t('settingsPage.generating') : t('settingsPage.generateSuggestions')}
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
                        {t('settingsPage.actionableSuggestions')}
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
