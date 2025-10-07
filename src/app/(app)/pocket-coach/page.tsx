
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { GraduationCap, Lightbulb, RefreshCw } from 'lucide-react';
import { useAppTranslation, useLanguage } from '@/context/language-provider';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// AI Flow Logic integrated directly into the component
const PocketCoachInputSchema = z.object({
  stressor: z.string().describe('The specific stressor the teacher is facing.'),
  language: z.enum(['en', 'ar']).default('en').describe('The language for the output.'),
});

export type PocketCoachInput = z.infer<typeof PocketCoachInputSchema>;

const PocketCoachOutputSchema = z.object({
  message: z.string().describe('A short, encouraging, and actionable piece of advice for the teacher.'),
});

export type PocketCoachOutput = z.infer<typeof PocketCoachOutputSchema>;

const pocketCoachPrompt = ai.definePrompt({
    name: 'pocketCoachPrompt_coachPage',
    input: {
        schema: PocketCoachInputSchema,
    },
    output: {
        schema: PocketCoachOutputSchema,
    },
    prompt: `You are a wise and empathetic mentor for teachers, like a friendly coach in their pocket.
    A teacher is feeling stressed about: "{{stressor}}".

    Provide one short, encouraging, and actionable piece of advice in the following language: {{{language}}}.
    The message should be a single, impactful sentence.
    Your tone should be supportive and understanding. Do not use quotation marks.
    `,
});

const generatePocketCoachMessageFlow = ai.defineFlow(
    {
        name: 'generatePocketCoachMessageFlow_coachPage',
        inputSchema: PocketCoachInputSchema,
        outputSchema: PocketCoachOutputSchema,
    },
    async (input) => {
        const { output } = await pocketCoachPrompt(input);
        return output!;
    }
);

async function generatePocketCoachMessage(input: PocketCoachInput): Promise<PocketCoachOutput> {
    return generatePocketCoachMessageFlow(input);
}
// End of AI Flow Logic

type TeacherStressor = 
  | 'Unruly Classroom' 
  | 'Difficult Parent' 
  | 'Feeling Overwhelmed' 
  | 'Lack of Recognition' 
  | 'Heavy Workload';

export default function PocketCoachPage() {
  const { t } = useAppTranslation();
  const { language } = useLanguage();

  const stressors: { value: TeacherStressor, label: string }[] = [
    { value: 'Unruly Classroom', label: t('pocketCoachPage.stressors.unrulyClassroom') },
    { value: 'Difficult Parent', label: t('pocketCoachPage.stressors.difficultParent') },
    { value: 'Feeling Overwhelmed', label: t('pocketCoachPage.stressors.feelingOverwhelmed') },
    { value: 'Lack of Recognition', label: t('pocketCoachPage.stressors.lackOfRecognition') },
    { value: 'Heavy Workload', label: t('pocketCoachPage.stressors.heavyWorkload') },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [currentStressor, setCurrentStressor] = useState<TeacherStressor | null>(null);

  const handleGetAdvice = async (stressor: TeacherStressor) => {
    setIsLoading(true);
    setMessage(null);
    setCurrentStressor(stressor);

    try {
        const input: PocketCoachInput = { stressor, language };
        const { message } = await generatePocketCoachMessage(input);
        setMessage(message);
    } catch (error) {
        console.error('Failed to get pocket coach message:', error);
        setMessage(t('pocketCoachPage.errorMessage'));
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              <GraduationCap /> {t('pocketCoachPage.title')}
            </CardTitle>
            <CardDescription>{t('pocketCoachPage.description')}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stressors.map(({ value, label }) => (
              <Button 
                key={value}
                variant="outline" 
                className="h-auto py-4 flex flex-col gap-2 items-center text-center"
                onClick={() => handleGetAdvice(value)}
                disabled={isLoading}
              >
                <span>{label}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {(isLoading || message) && (
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    {isLoading ? <RefreshCw className="h-6 w-6 animate-spin" /> : <Lightbulb className="h-6 w-6 text-primary" />}
                    {isLoading ? t('pocketCoachPage.generating') : `${t('pocketCoachPage.adviceFor')} "${currentStressor && stressors.find(s => s.value === currentStressor)?.label}"`}
                </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ) : (
                <div className="prose prose-lg dark:prose-invert max-w-none text-center italic">
                  <p>&ldquo;{message}&rdquo;</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

    