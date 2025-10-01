'use client';

import Link from 'next/link';
import { useUser } from '@/context/user-provider';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, BrainCircuit, ArrowRight, BookOpen, Mail, Wind } from 'lucide-react';
import { DailyAffirmationCard } from './_components/daily-affirmation-card';
import { useAppTranslation } from '@/context/language-provider';
import { Trans } from 'react-i18next';

export default function DashboardPage() {
  const { user } = useUser();
  const { t } = useAppTranslation();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
          {t('welcome')}, {user?.name}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('appSlogan')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DailyAffirmationCard />

        <Card className="flex flex-col hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <MessageSquare className="h-6 w-6" /> {t('dashboardCards.rantChatTitle')}
            </CardTitle>
            <CardDescription>
              {t('dashboardCards.rantChatDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end">
            <Link href="/rant-chat" className="w-full">
              <Button className="w-full">
                {t('dashboardCards.rantChatButton')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <BrainCircuit className="h-6 w-6" /> {t('dashboardCards.guidanceTitle')}
            </CardTitle>
            <CardDescription>
              {t('dashboardCards.guidanceDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end">
            <Link href="/guidance" className="w-full">
              <Button className="w-full">
                {t('dashboardCards.guidanceButton')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <BookOpen className="h-6 w-6" /> {t('dashboardCards.moodJournalTitle')}
            </CardTitle>
            <CardDescription>
              {t('dashboardCards.moodJournalDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end">
            <Link href="/mood-journal" className="w-full">
              <Button className="w-full">
                {t('dashboardCards.moodJournalButton')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Wind className="h-6 w-6" /> {t('dashboardCards.breathingTitle')}
            </CardTitle>
            <CardDescription>
              {t('dashboardCards.breathingDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end">
            <Link href="/breathing" className="w-full">
              <Button className="w-full">
                {t('dashboardCards.breathingButton')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 lg:col-span-1 hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Mail className="h-6 w-6" /> {t('dashboardCards.feedbackTitle')}
            </CardTitle>
            <CardDescription>
              <Trans i18nKey="dashboardCards.feedbackDescription">
                Have ideas or suggestions? We&apos;d love to hear from you. Send any feedback to <a href="mailto:walidaldebai@gmail.com" className="text-primary underline">walidaldebai@gmail.com</a>.
              </Trans>
            </CardDescription>
          </CardHeader>
        </Card>

      </div>
    </div>
  );
}
