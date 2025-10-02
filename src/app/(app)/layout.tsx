'use client';

import { AppHeader } from '@/components/app-header';
import { useUser } from '@/context/user-provider';
import { useTransitionRouter } from '@/context/transition-provider';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const { transitionTo } = useTransitionRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      transitionTo('/onboarding');
    }
  }, [user, isLoaded, transitionTo]);

  if (!isLoaded || !user) {
    return (
      <div className="flex flex-col h-screen">
        <header className="border-b">
          <div className="container flex h-14 items-center">
            <Skeleton className="h-6 w-32" />
            <div className="ml-auto flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </header>
        <main className="flex-1 p-8">
          <Skeleton className="h-full w-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
