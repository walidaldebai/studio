
'use client';

import { useUser } from '@/context/user-provider';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, BrainCircuit, ArrowRight, BookOpen, Mail, Wind, Headset, Palmtree, Mic, Ear, GraduationCap } from 'lucide-react';
import { DailyAffirmationCard } from './_components/daily-affirmation-card';
import { useAppTranslation } from '@/context/language-provider';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { WhatsNewDialog } from '@/components/whats-new-dialog';

export default function DashboardPage() {
  const { user } = useUser();
  const { t } = useAppTranslation();
  const [isWhatsNewOpen, setIsWhatsNewOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const version = 'alpha-2.0';
      const hasSeenWhatsNew = localStorage.getItem('seenWhatsNew');
      if (hasSeenWhatsNew !== version) {
        setIsWhatsNewOpen(true);
        localStorage.setItem('seenWhatsNew', version);
      }
    }
  }, [isClient]);


  return (
    <>
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-8 text-center">
          <h1
            className="text-4xl md:text-5xl font-headline font-bold"
            style={{ textShadow: '0 0 10px hsl(var(--primary) / 0.3)' }}
          >
            <span className="inline-block bg-gradient-primary text-transparent bg-clip-text animate-text-gradient bg-[length:200%_auto]">
              <HeartHandshake className="h-10 w-10" />
            </span>{' '}
            <span className="bg-gradient-primary text-transparent bg-clip-text animate-text-gradient bg-[length:200%_auto]">{t('welcome')}, {user?.name}</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {t('appSlogan')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <DailyAffirmationCard />
          
          {user?.specialization.toLowerCase() === 'teacher' && (
            <Card className="flex flex-col transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <GraduationCap className="h-6 w-6" /> {t('dashboardCards.pocketCoachTitle')}
                </CardTitle>
                <CardDescription>
                  {t('dashboardCards.pocketCoachDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Button asChild className="w-full">
                  <Link href="/pocket-coach">
                    {t('dashboardCards.pocketCoachButton')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="flex flex-col transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <MessageSquare className="h-6 w-6" /> {t('dashboardCards.rantChatTitle')}
              </CardTitle>
              <CardDescription>
                {t('dashboardCards.rantChatDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button asChild className="w-full">
                <Link href="/rant-chat">
                  {t('dashboardCards.rantChatButton')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <BrainCircuit className="h-6 w-6" /> {t('dashboardCards.guidanceTitle')}
              </CardTitle>
              <CardDescription>
                {t('dashboardCards.guidanceDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button asChild className="w-full">
                <Link href="/guidance">
                  {t('dashboardCards.guidanceButton')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <BookOpen className="h-6 w-6" /> {t('dashboardCards.moodJournalTitle')}
              </CardTitle>
              <CardDescription>
                {t('dashboardCards.moodJournalDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button asChild className="w-full">
                  <Link href="/mood-journal">
                    {t('dashboardCards.moodJournalButton')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Wind className="h-6 w-6" /> {t('dashboardCards.breathingTitle')}
              </CardTitle>
              <CardDescription>
                {t('dashboardCards.breathingDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button asChild className="w-full">
                <Link href="/breathing">
                  {t('dashboardCards.breathingButton')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Headset className="h-6 w-6" /> {t('dashboardCards.meditationsTitle')}
              </CardTitle>
              <CardDescription>
                {t('dashboardCards.meditationsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button asChild className="w-full">
                <Link href="/meditations">
                  {t('dashboardCards.meditationsButton')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Mic className="h-6 w-6" /> {t('dashboardCards.audioAffirmationsTitle')}
              </CardTitle>
              <CardDescription>
                {t('dashboardCards.audioAffirmationsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button asChild className="w-full">
                <Link href="/audio-affirmations">
                  {t('dashboardCards.audioAffirmationsButton')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Ear className="h-6 w-6" /> {t('dashboardCards.mindfulMomentsTitle')}
              </CardTitle>
              <CardDescription>
                {t('dashboardCards.mindfulMomentsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button asChild className="w-full">
                <Link href="/mindful-moments">
                  {t('dashboardCards.mindfulMomentsButton')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Palmtree className="h-6 w-6" /> {t('dashboardCards.sandGardenTitle')}
              </CardTitle>
              <CardDescription>
                {t('dashboardCards.sandGardenDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button asChild className="w-full">
                <Link href="/sand-garden">
                  {t('dashboardCards.sandGardenButton')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2 xl:col-span-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Mail className="h-6 w-6" /> {t('dashboardCards.feedbackTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                  {t('dashboardCards.feedbackDescription')} <a href="mailto:walidaldebai@gmail.com" className="text-primary underline">walidaldebai@gmail.com</a>.
                </p>
            </CardContent>
          </Card>

        </div>
      </div>
      <WhatsNewDialog isOpen={isWhatsNewOpen} onOpenChange={setIsWhatsNewOpen} />
    </>
  );
}

function HeartHandshake(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.82 2.94 0l.96-.96.96.96c.82.82 2.13.82 2.94 0v0a2.17 2.17 0 0 0 0-3.08L12 5Z" />
      </svg>
    )
}

    
