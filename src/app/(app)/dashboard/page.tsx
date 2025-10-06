'use client';

import { useUser } from '@/context/user-provider';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, BrainCircuit, ArrowRight, BookOpen, Mail, Wind, Headset, Palmtree, HeartHandshake, Mic, Bot } from 'lucide-react';
import { DailyAffirmationCard } from './_components/daily-affirmation-card';
import { useAppTranslation } from '@/context/language-provider';
import Link from 'next/link';
import React from 'react';

export default function DashboardPage() {
  const { user } = useUser();
  const { t } = useAppTranslation();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold bg-gradient-to-r from-primary to-purple-400 text-transparent bg-clip-text animate-text-gradient">
           <HeartHandshake className="h-10 w-10 inline-block text-primary" /> {t('welcome')}, {user?.name}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('appSlogan')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <DailyAffirmationCard />

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
              <Bot className="h-6 w-6" /> {t('dashboardCards.pocketCoachTitle')}
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
  );
}
