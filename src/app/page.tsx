
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, BrainCircuit, MessageSquare, BookOpen, HeartHandshake } from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';


function HeartHandIcon(props: React.SVGProps<SVGSVGElement>) {
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

export default function AboutPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'about-hero');
  const guidanceImage = PlaceHolderImages.find(p => p.id === 'about-guidance');
  const journalImage = PlaceHolderImages.find(p => p.id === 'about-journal');
  
  const features = [
    {
      icon: <BrainCircuit className="h-10 w-10 text-primary" />,
      title: "AI-Powered Guidance",
      description: "Receive personalized wellness advice tailored to your unique profile and daily challenges. Our AI companion is here to support you on your journey.",
      image: guidanceImage
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Empathetic Rant Chat",
      description: "A safe, non-judgmental space to vent your frustrations. Our AI listens with compassion, helping you feel heard and understood without offering unsolicited advice.",
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Insightful Mood Journal",
      description: "Track your emotional landscape and uncover patterns. Our AI provides gentle insights to help you reflect on your well-being over time.",
      image: journalImage
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <HeartHandIcon className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline text-lg">Zen Zone</span>
            </Link>
            <div className="flex flex-1 items-center justify-end space-x-2">
                <ThemeToggle />
                <Button asChild>
                    <Link href="/onboarding">Get Started</Link>
                </Button>
            </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 text-center animate-fade-in">
             <div 
                className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10"
             />
             {heroImage && (
                 <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    data-ai-hint={heroImage.imageHint}
                    fill
                    className="object-cover"
                />
             )}
            <div className="container relative z-20">
                <h1 className="text-4xl md:text-6xl font-headline font-bold"
                    style={{ textShadow: '0 0 20px hsl(var(--background))' }}>
                    Find Your Calm and Clarity
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-foreground/80">
                    Zen Zone is your personal sanctuary for mental and emotional well-being. We blend modern technology with mindful practices to help you navigate life's challenges with greater peace and resilience.
                </p>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
            <div className="container space-y-16">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">A Toolkit for Your Mind</h2>
                    <p className="mt-2 max-w-xl mx-auto text-muted-foreground">
                        Explore features designed to support you in meaningful ways.
                    </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="flex flex-col text-center items-center p-8 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:border-primary">
                             {feature.icon}
                             <h3 className="mt-4 text-2xl font-headline font-semibold">{feature.title}</h3>
                             <p className="mt-2 text-muted-foreground flex-grow">{feature.description}</p>
                             {feature.image && (
                                <div className="mt-6 w-full aspect-video relative rounded-lg overflow-hidden border">
                                    <Image
                                        src={feature.image.imageUrl}
                                        alt={feature.image.description}
                                        data-ai-hint={feature.image.imageHint}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                             )}
                        </Card>
                    ))}
                </div>
            </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="py-20 border-t">
            <div className="container text-center">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">Ready to Find Your Zen?</h2>
                <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
                    Create your personalized profile in just a few moments and unlock a space designed just for you.
                </p>
                <Button asChild size="lg" className="mt-8">
                    <Link href="/onboarding">Sign Up Now</Link>
                </Button>
            </div>
        </section>
      </main>

      <footer className="py-6 border-t">
        <div className="container text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Zen Zone. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
