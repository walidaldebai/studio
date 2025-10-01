'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/context/user-provider';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, BrainCircuit, ArrowRight, Send } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function DashboardPage() {
  const { user, addFeedback } = useUser();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState('');
  const heroImage = PlaceHolderImages.find(img => img.id === 'zen-dashboard-hero');

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (feedback.trim().length < 10) {
      toast({
        variant: 'destructive',
        title: 'Feedback too short',
        description: 'Please provide at least 10 characters of feedback.',
      });
      return;
    }
    
    try {
        await addFeedback({ name: user.name, feedback });
        toast({
          title: 'Feedback submitted',
          description: 'Thank you for helping us improve Zen Zone!',
        });
        setFeedback('');
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Submission failed',
            description: 'Could not submit your feedback at this time.',
        });
    }
  };

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

        <Card className="flex flex-col md:col-span-2 lg:col-span-1 hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Send className="h-6 w-6" /> Submit Feedback
            </CardTitle>
            <CardDescription>
              Have a suggestion or found a bug? Let us know how we can improve.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <form onSubmit={handleFeedbackSubmit} className="flex flex-col h-full">
              <Textarea
                placeholder="Tell us what you think..."
                className="flex-grow"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <Button type="submit" className="mt-4 w-full">
                Send Feedback
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
