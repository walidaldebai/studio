'use client';

import { useRouter } from 'next/navigation';
import { useUser, type UserProfile } from '@/context/user-provider';
import { OnboardingForm } from './_components/onboarding-form';

export default function OnboardingPage() {
  const { setUser } = useUser();
  const router = useRouter();

  const handleOnboardingComplete = (data: Omit<UserProfile, 'id'>) => {
    setUser(data);
    router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-headline font-bold">Welcome to Zen Zone</h1>
            <p className="text-muted-foreground mt-2">Let's set up your profile to personalize your experience.</p>
        </div>
        <OnboardingForm onOnboardingComplete={handleOnboardingComplete} />
      </div>
    </main>
  );
}
