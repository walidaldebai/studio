'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Wind } from 'lucide-react';
import { useAppTranslation } from '@/context/language-provider';
import { Trans } from 'react-i18next';

export default function BreathingPage() {
  const { i18n } = useAppTranslation();
  const [isClient, setIsClient] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0);

  const breathingCycleConfig = {
    en: [
      { text: 'Breathe In', duration: 4000, scale: 1.2 },
      { text: 'Hold', duration: 4000, scale: 1.2 },
      { text: 'Breathe Out', duration: 6000, scale: 1 },
      { text: 'Hold', duration: 2000, scale: 1 },
    ],
    ar: [
      { text: 'شهيق', duration: 4000, scale: 1.2 },
      { text: 'احبس', duration: 4000, scale: 1.2 },
      { text: 'زفير', duration: 6000, scale: 1 },
      { text: 'احبس', duration: 2000, scale: 1 },
    ],
  };

  const [breathingCycle, setBreathingCycle] = useState(breathingCycleConfig.en);

  useEffect(() => {
    setIsClient(true);
    setBreathingCycle(i18n.language === 'ar' ? breathingCycleConfig.ar : breathingCycleConfig.en);
  }, [i18n.language]);

  useEffect(() => {
    if (!isClient) return;

    const cycle = breathingCycle[cycleIndex];
    const timer = setTimeout(() => {
      setCycleIndex((prevIndex) => (prevIndex + 1) % breathingCycle.length);
    }, cycle.duration);

    return () => clearTimeout(timer);
  }, [cycleIndex, isClient, breathingCycle]);

  if (!isClient) {
    return null; // Don't render on the server to prevent mismatch
  }

  const currentCycle = breathingCycle[cycleIndex];

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-3.5rem)] overflow-hidden">
        <div
            className={cn(
                'relative flex flex-col items-center justify-center',
                'transition-transform ease-in-out shadow-2xl bg-gradient-to-br from-primary to-[hsl(var(--gradient-to))]',
                'rounded-full'
            )}
            style={{
                width: 'clamp(200px, 40vw, 400px)',
                height: 'clamp(200px, 40vw, 400px)',
                transform: `scale(${currentCycle.scale})`,
                transitionDuration: `${currentCycle.duration}ms`,
                boxShadow: '0 0 80px 20px hsl(var(--primary) / 0.4)',
            }}
            >
            <div className="text-center flex flex-col items-center gap-4">
                <Wind className="h-8 w-8 text-primary-foreground/80"/>
                <p className="text-2xl md:text-4xl font-headline font-semibold text-primary-foreground tracking-wider">
                    {currentCycle.text}
                </p>
            </div>
            <p className="text-muted-foreground absolute bottom-8 text-center text-sm px-4">
                <Trans i18nKey="breathingPage.instructions">
                    Follow the guide to regulate your breathing. <br/> Feel free to close your eyes and focus on the sensation.
                </Trans>
            </p>
        </div>
    </div>
  );
}
