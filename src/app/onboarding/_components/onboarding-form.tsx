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
import { useAppTranslation } from '@/context/language-provider';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  gender: z.string().min(1, { message: 'Gender is required.' }),
  specialization: z.string().min(2, {
    message: 'Please enter your specialization or profession.',
  }),
  healthIssues: z.string().optional(),
});

type OnboardingFormProps = {
  onOnboardingComplete: (data: Omit<UserProfile, 'id'>) => void;
};

export function OnboardingForm({ onOnboardingComplete }: OnboardingFormProps) {
  const { t } = useAppTranslation();
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
        <CardTitle className="font-headline">{t('onboarding.title')}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('onboarding.name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('onboarding.namePlaceholder')} {...field} />
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
                  <FormLabel>{t('onboarding.gender')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('onboarding.genderPlaceholder')} {...field} />
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
                  <FormLabel>{t('onboarding.specialization')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('onboarding.specializationPlaceholder')} {...field} />
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
                  <FormLabel>{t('onboarding.healthIssues')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('onboarding.healthIssuesPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              {t('onboarding.signUp')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
