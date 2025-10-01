'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Wind } from 'lucide-react';

const breathingCycle = [
  { text: 'Breathe In', duration: 4000, scale: 1.5 },
  { text: 'Hold', duration: 4000, scale: 1.5 },
  { text: 'Breathe Out', duration: 6000, scale: 1 },
  { text: 'Hold', duration: 2000, scale: 1 },
];

export default function BreathingPage() {
  const [cycleIndex, setCycleIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const cycle = breathingCycle[cycleIndex];
    const timer = setTimeout(() => {
      setCycleIndex((prevIndex) => (prevIndex + 1) % breathingCycle.length);
    }, cycle.duration);

    return () => clearTimeout(timer);
  }, [cycleIndex]);

  if (!isClient) {
    return null; // Don't render on the server
  }

  const currentCycle = breathingCycle[cycleIndex];

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-3.5rem)] overflow-hidden">
      <div className="text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-4">
        <Wind className="h-8 w-8 text-primary-foreground/80"/>
        <p className="text-2xl md:text-4xl font-headline font-semibold text-primary-foreground tracking-wider">
          {currentCycle.text}
        </p>
      </div>

      <div
        className={cn(
          'relative rounded-full bg-primary flex items-center justify-center transition-transform ease-in-out',
        )}
        style={{
          width: 'clamp(250px, 50vw, 500px)',
          height: 'clamp(250px, 50vw, 500px)',
          transform: `scale(${currentCycle.scale})`,
          transitionDuration: `${currentCycle.duration}ms`,
        }}
      >
      </div>
       <p className="text-muted-foreground absolute bottom-8 text-center text-sm">
        Follow the guide to regulate your breathing. <br/> Feel free to close your eyes and focus on the sensation.
      </p>
    </div>
  );
}
