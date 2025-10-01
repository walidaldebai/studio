'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, RefreshCw } from 'lucide-react';
import { getDailyAffirmation } from '@/ai/flows/daily-affirmation';
import { useAppTranslation } from '@/context/language-provider';

export function DailyAffirmationCard() {
  const { t } = useAppTranslation();
  const [affirmation, setAffirmation] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchAffirmation = async () => {
    setIsLoading(true);
    try {
      const response = await getDailyAffirmation();
      setAffirmation(response.affirmation);
    } catch (error) {
      console.error('Failed to get affirmation:', error);
      setAffirmation(t('dashboardCards.affirmationDefault'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAffirmation();
  }, []);

  return (
    <Card className="flex flex-col lg:col-span-2 hover:border-primary transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Sparkles className="h-6 w-6 text-primary" /> {t('dashboardCards.dailyAffirmation')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between gap-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        ) : (
          <p className="text-lg italic text-muted-foreground">
            &ldquo;{affirmation}&rdquo;
          </p>
        )}
        <Button onClick={fetchAffirmation} disabled={isLoading} variant="outline" size="sm" className="self-start">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {t('dashboardCards.newAffirmation')}
        </Button>
      </CardContent>
    </Card>
  );
}
