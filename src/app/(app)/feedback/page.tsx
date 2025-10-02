'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/context/user-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Mail, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppTranslation } from '@/context/language-provider';

const formSchema = z.object({
  feedback: z.string().min(10, {
    message: 'Please provide at least 10 characters of feedback.',
  }),
});

export default function FeedbackPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const { t } = useAppTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { feedback: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user?.name || 'Anonymous',
          feedback: values.feedback,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send feedback');
      }

      toast({
        title: t('feedbackPage.successTitle'),
        description: t('feedbackPage.successDescription'),
      });
      form.reset();
    } catch (error) {
      console.error('Failed to send feedback:', error);
      toast({
        variant: 'destructive',
        title: t('feedbackPage.errorTitle'),
        description: t('feedbackPage.errorDescription'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              <Mail /> {t('feedbackPage.title')}
            </CardTitle>
            <CardDescription>
              {t('feedbackPage.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="feedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('feedbackPage.formLabel')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('feedbackPage.formPlaceholder')}
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  <Send className="mr-2" />
                  {isLoading ? t('feedbackPage.sending') : t('feedbackPage.sendButton')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
