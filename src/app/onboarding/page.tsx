'use client';

import { useUser, type UserProfile } from '@/context/user-provider';
import { OnboardingForm } from './_components/onboarding-form';
import { useAppTranslation } from '@/context/language-provider';
import { useTransitionRouter } from '@/context/transition-provider';

export default function OnboardingPage() {
  const { setUser } = useUser();
  const { transitionTo } = useTransitionRouter();
  const { t } = useAppTranslation();

  const handleOnboardingComplete = (data: Omit<UserProfile, 'id'>) => {
    setUser(data);
    transitionTo('/dashboard');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
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
