
'use client';

import { useUser, type UserProfile } from '@/context/user-provider';
import { OnboardingForm } from './_components/onboarding-form';
import { useAppTranslation } from '@/context/language-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OnboardingPage() {
  const { user, setUser, isLoaded } = useUser();
  const router = useRouter();
  const { t } = useAppTranslation();

  useEffect(() => {
    if (isLoaded && user) {
      router.push('/dashboard');
    }
  }, [isLoaded, user, router]);


  const handleOnboardingComplete = (data: Omit<UserProfile, 'id'>) => {
    setUser(data);
    router.push('/dashboard');
  };

  if (!isLoaded || user) {
      return null; // Or a loading spinner
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-headline font-bold">{t('onboarding.title')}</h1>
            <p className="text-muted-foreground mt-2">{t('onboarding.subtitle')}</p>
        </div>
        <OnboardingForm onOnboardingComplete={handleOnboardingComplete} />
      </div>
    </main>
  );
}
