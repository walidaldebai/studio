'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/user-provider';
import { cn } from '@/lib/utils';
import { Target, CheckCircle2, RotateCcw } from 'lucide-react';
import { useAppTranslation } from '@/context/language-provider';

const allValues = [
  'Creativity', 'Growth', 'Community', 'Health', 'Authenticity',
  'Achievement', 'Adventure', 'Compassion', 'Courage', 'Curiosity',
  'Family', 'Freedom', 'Friendship', 'Fun', 'Gratitude',
  'Honesty', 'Humor', 'Independence', 'Justice', 'Kindness',
  'Knowledge', 'Leadership', 'Learning', 'Love', 'Loyalty',
  'Order', 'Peace', 'Power', 'Respect', 'Responsibility',
  'Security', 'Spirituality', 'Stability', 'Success', 'Tradition',
  'Wealth', 'Wisdom'
];

type Stage = 'select-10' | 'select-5' | 'results';

export default function ValuesDiscoveryPage() {
  const { t } = useAppTranslation();
  const { user } = useUser();
  const storageKey = `values_discovery_${user?.id}`;

  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [stage, setStage] = useState<Stage>('select-10');
  
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const { values, final } = JSON.parse(savedState);
        setSelectedValues(values);
        if (final) {
          setStage('results');
        }
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
  }, [storageKey]);

  const handleSelectValue = (value: string) => {
    const limit = stage === 'select-10' ? 10 : 5;
    
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter(v => v !== value));
    } else if (selectedValues.length < limit) {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const proceedToNextStage = () => {
    if (stage === 'select-10') {
      setStage('select-5');
      const currentSelection = [...selectedValues];
      setSelectedValues([]); // Reset for the next stage
      // The values to choose from in the next stage are the ones just selected.
      // So we'll use a temporary state to hold them for the next render.
      setTempValues(currentSelection); 
    } else if (stage === 'select-5') {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ values: selectedValues, final: true }));
      } catch (error) {
        console.error("Failed to save final values to localStorage", error);
      }
      setStage('results');
    }
  };
  
  const [tempValues, setTempValues] = useState<string[] | null>(null);

  const handleReset = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
        console.error("Failed to remove from localStorage", error);
    }
    setSelectedValues([]);
    setTempValues(null);
    setStage('select-10');
  };

  const getInstructions = () => {
    switch (stage) {
      case 'select-10':
        return t('valuesDiscoveryPage.instructions10');
      case 'select-5':
        return t('valuesDiscoveryPage.instructions5');
      case 'results':
        return t('valuesDiscoveryPage.instructionsResults');
    }
  };

  const isProceedDisabled = () => {
    if (stage === 'select-10') return selectedValues.length !== 10;
    if (stage === 'select-5') return selectedValues.length !== 5;
    return true;
  };
  
  const currentValues = stage === 'select-5' ? (tempValues || []) : allValues;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              <Target /> {t('valuesDiscoveryPage.title')}
            </CardTitle>
            <CardDescription>{getInstructions()}</CardDescription>
          </CardHeader>
          <CardContent>
            {stage !== 'results' ? (
              <>
                <div className="flex flex-wrap gap-3 justify-center">
                  {currentValues.map(value => (
                    <Button
                      key={value}
                      variant={selectedValues.includes(value) ? 'default' : 'outline'}
                      onClick={() => handleSelectValue(value)}
                      className="transition-transform duration-200 hover:scale-105"
                    >
                      {selectedValues.includes(value) && <CheckCircle2 className="mr-2 h-4 w-4" />}
                      {t(`values.${value}`, value)}
                    </Button>
                  ))}
                </div>
                <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    {t('valuesDiscoveryPage.selectedCount', { count: selectedValues.length, limit: stage === 'select-10' ? 10 : 5 })}
                  </p>
                  <Button onClick={proceedToNextStage} disabled={isProceedDisabled()}>
                    {t('valuesDiscoveryPage.proceedButton')}
                  </Button>
                </div>
              </>
            ) : (
              <div className='text-center'>
                 <h3 className="text-2xl font-headline font-semibold mb-4">{t('valuesDiscoveryPage.yourTop5')}</h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  {selectedValues.map(value => (
                    <Card key={value} className="p-4 bg-primary text-primary-foreground min-w-[120px] text-center">
                      <p className="font-semibold">{t(`values.${value}`, value)}</p>
                    </Card>
                  ))}
                </div>
                 <Button onClick={handleReset} variant="outline" className="mt-8">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {t('valuesDiscoveryPage.resetButton')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
