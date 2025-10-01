'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/context/user-provider';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, BrainCircuit, ArrowRight, BookOpen, Mail } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { DailyAffirmationCard } from './_components/daily-affirmation-card';

export default function DashboardPage() {
  const { user } = useUser();
  const heroImage = PlaceHolderImages.find(img => img.id === 'zen-dashboard-hero');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="relative w-full h-64 rounded-xl overflow-hidden mb-8">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center p-4">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary-foreground">
            Welcome, {user?.name}
          </h1>
          <p className="mt-2 text-lg text-primary-foreground/80">
            Your space for calm and clarity awaits.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DailyAffirmationCard />

        <Card className="flex flex-col hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <MessageSquare className="h-6 w-6" /> Rant Chat
            </CardTitle>
            <CardDescription>
              Vent your frustrations and receive empathetic, understanding responses from our AI companion.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end">
            <Link href="/rant-chat" className="w-full">
              <Button className="w-full">
                Start Chatting <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <BrainCircuit className="h-6 w-6" /> Personalized Guidance
            </CardTitle>
            <CardDescription>
              Get tailored health and wellness advice based on your unique profile and needs.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end">
            <Link href="/guidance" className="w-full">
              <Button className="w-full">
                Get Advice <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <BookOpen className="h-6 w-6" /> Mood Journal
            </CardTitle>
            <CardDescription>
              Track your daily mood and visualize your emotional patterns over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end">
            <Link href="/mood-journal" className="w-full">
              <Button className="w-full">
                Open Journal <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 lg:col-span-3 hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Mail className="h-6 w-6" /> Share Your Feedback
            </CardTitle>
            <CardDescription>
              Have ideas or suggestions? We'd love to hear from you. Send any feedback to <a href="mailto:walidaldebai@gmail.com" className="text-primary underline">walidaldebai@gmail.com</a>.
            </CardDescription>
          </CardHeader>
        </Card>

      </div>
    </div>
  );
}
