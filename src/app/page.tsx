'use client';

import { useEffect, useState } from 'react';
import { useTransitionRouter } from '@/context/transition-provider';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { transitionTo } = useTransitionRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const userProfile = localStorage.getItem('userProfile');
      if (userProfile) {
        transitionTo('/dashboard');
      } else {
        transitionTo('/onboarding');
      }
    } catch (error) {
      // If localStorage is not available, default to onboarding
      transitionTo('/onboarding');
    }
  }, [transitionTo]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-48 h-8 bg-muted rounded-md animate-pulse"></div>
        <Skeleton className="h-96 w-80" />
      </div>
    </div>
  );
}
