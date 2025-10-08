
'use client';

import { Analytics } from "@vercel/analytics/next"
import Image from 'next/image';
import Link from 'next/link';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BrainCircuit, MessageSquare, BookOpen, User, CheckCircle, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useUser } from '@/context/user-provider';
import type { PropsWithChildren } from 'react';
import { ShoulderIcon } from "@/components/shoulder-icon";


function GetStartedButton({ children, ...props }: PropsWithChildren<ButtonProps>) {
  const { user, isLoaded } = useUser();
  const href = !isLoaded ? '/onboarding' : user ? '/dashboard' : '/onboarding';

  return (
    <Button asChild {...props}>
      <Link href={href}>
        {children}
      </Link>
    </Button>
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
      description: "Feeling lost or stressed? Describe your situation and receive personalized, actionable advice from an AI companion trained to provide supportive and constructive feedback. It's like having a wellness coach in your pocket.",
      image: guidanceImage
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Empathetic Rant Chat",
      description: "Sometimes you just need to vent. Our Rant Chat is a private, non-judgmental space where you can let it all out. The AI listens with empathy, validating your feelings without offering unsolicited advice, helping you feel heard and understood.",
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Insightful Mood Journal",
      description: "Track your daily emotional landscape to better understand yourself. Log your mood, add notes, and let our AI provide gentle, insightful analysis on your patterns over time, helping you foster self-awareness and growth.",
      image: journalImage
    }
  ];

  const howItWorksSteps = [
    {
      icon: <User className="h-8 w-8 text-primary" />,
      title: "1. Create Your Profile",
      description: "Answer a few simple questions to create a confidential profile. This helps us tailor the experience to your unique needs and profession.",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "2. Explore Your Tools",
      description: "Dive into a suite of tools like the Rant Chat, Mood Journal, or ask for Personalized Guidance. Each one is designed to support you in a different way.",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: "3. Find Your Calm",
      description: "Use the tools as often as you need. Our goal is to provide a consistent, reliable resource to help you build resilience and find moments of peace.",
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <ShoulderIcon className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline text-lg">Kaatf</span>
            </Link>
            <div className="flex flex-1 items-center justify-end space-x-2">
                <ThemeToggle />
                <GetStartedButton>Get Started</GetStartedButton>
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
                    priority
                />
             )}
            <div className="container relative z-20">
                <h1 className="text-4xl md:text-6xl font-headline font-bold"
                    style={{ textShadow: '0 0 20px hsl(var(--background))' }}>
                    Support, Shoulder to Shoulder
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-foreground/80">
                    Kaatf (كاتف), from the Arabic for "shoulder to shoulder," represents our core belief in mutual support. We aim to help people manage stress, anxiety, and the pressures of daily life by providing accessible and supportive tools.
                </p>
            </div>
        </section>

        {/* Our Philosophy Section */}
        <section className="py-20 bg-muted/50">
            <div className="container text-center">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Philosophy</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    We believe that everyone deserves a space to feel heard, understood, and supported. In a world that's always 'on', finding a moment for yourself can be tough. Kaatf is built on the idea of solidarity—standing shoulder to shoulder with you. Our AI is designed to be a compassionate companion, a private and always-available resource to help you reflect and recharge.
                </p>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
            <div className="container space-y-16">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">A Toolkit for Your Mind</h2>
                    <p className="mt-2 max-w-xl mx-auto text-muted-foreground">
                        Explore features designed to support you in meaningful ways, whenever you need them.
                    </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="flex flex-col text-center items-center p-6 md:p-8 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:border-primary">
                            <CardHeader className="p-0 items-center">
                                {feature.icon}
                                <CardTitle className="mt-4 text-2xl font-headline font-semibold">{feature.title}</CardTitle>
                             </CardHeader>
                             <CardContent className="p-0 mt-2 text-muted-foreground flex-grow">
                                <p>{feature.description}</p>
                             </CardContent>
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

        {/* How It Works Section */}
        <section className="py-20 bg-muted/50 border-t">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">How It Works</h2>
              <p className="mt-2 max-w-xl mx-auto text-muted-foreground">
                Getting started is simple and takes just a moment.
              </p>
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
              {howItWorksSteps.map((step) => (
                <div key={step.title} className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-background border shadow-sm">
                    {step.icon}
                  </div>
                  <h3 className="mt-5 text-xl font-headline font-semibold">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="py-20 border-t">
            <div className="container text-center">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">Ready to Find Your Support?</h2>
                <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
                    Create your personalized profile and unlock a space designed just for you. Your journey to clarity starts now.
                </p>
                <GetStartedButton size="lg" className="mt-8">
                  Sign Up and Begin
                </GetStartedButton>
            </div>
        </section>
      </main>

      <footer className="py-6 border-t">
        <div className="container text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Kaatf. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
