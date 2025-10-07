
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/context/user-provider';
import { Smile, Meh, Frown, BookOpen, BarChart2, Lightbulb, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { useAppTranslation, useLanguage } from '@/context/language-provider';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// AI Flow Logic integrated directly into the component
const MoodEntrySchema = z.object({
  date: z.string().describe('The ISO date string of the entry.'),
  mood: z.enum(['Happy', 'Neutral', 'Sad']).describe('The mood recorded for that day.'),
  note: z.string().optional().describe('An optional note provided by the user.'),
});

const MoodJournalAnalysisInputSchema = z.object({
  entries: z.array(MoodEntrySchema).describe('An array of mood journal entries from the last 30 days.'),
  language: z.enum(['en', 'ar']).default('en').describe('The language for the analysis output.'),
});

export type MoodJournalAnalysisInput = z.infer<typeof MoodJournalAnalysisInputSchema>;

const MoodJournalAnalysisOutputSchema = z.object({
  analysis: z.string().describe('A thoughtful and empathetic analysis of the user\'s mood patterns, including potential insights and gentle observations.'),
});

export type MoodJournalAnalysisOutput = z.infer<typeof MoodJournalAnalysisOutputSchema>;

const analysisPrompt = ai.definePrompt({
    name: 'analysisPrompt_moodJournalPage',
    input: {
        schema: MoodJournalAnalysisInputSchema,
    },
    output: {
        schema: MoodJournalAnalysisOutputSchema,
    },
    prompt: `You are an empathetic and insightful AI wellness assistant. Your task is to analyze a user's mood journal entries from the last 30 days and provide a gentle, supportive summary.

    Your response must be in the following language: {{{language}}}.

    Analyze the provided entries to identify patterns, such as frequent moods, correlations between notes and moods, or changes over time. Your tone should be encouraging and non-judgmental.

    If there are very few entries, acknowledge that and suggest the user log their mood more frequently to get richer insights.

    Do not give medical advice. Focus on emotional wellness and self-awareness. Frame your observations as gentle suggestions or things to consider.

    Here are the user's mood entries:
    {{#each entries}}
    - Date: {{date}}, Mood: {{mood}}{{#if note}}, Note: "{{note}}"{{/if}}
    {{/each}}
    `,
});

const analyzeMoodJournalFlow = ai.defineFlow(
    {
        name: 'analyzeMoodJournalFlow_moodJournalPage',
        inputSchema: MoodJournalAnalysisInputSchema,
        outputSchema: MoodJournalAnalysisOutputSchema,
    },
    async (input) => {
        if (input.entries.length < 3) {
            const message = input.language === 'ar'
                ? 'للحصول على تحليل مفيد، حاول تسجيل حالتك المزاجية لبضعة أيام أخرى. كلما زادت البيانات، كانت الأفكار أفضل!'
                : 'For a helpful analysis, try logging your mood for a few more days. The more data, the better the insights!';
            return { analysis: message };
        }
        const { output } = await analysisPrompt(input);
        return output!;
    }
);

async function analyzeMoodJournal(input: MoodJournalAnalysisInput): Promise<MoodJournalAnalysisOutput> {
    return analyzeMoodJournalFlow(input);
}
// End of AI Flow Logic

type Mood = 'Happy' | 'Neutral' | 'Sad';

interface MoodEntry {
  date: string;
  mood: Mood;
  note?: string;
}

export default function MoodJournalPage() {
  const { user } = useUser();
  const { t, i18n } = useAppTranslation();
  const { language } = useLanguage();

  const moodOptions: { mood: Mood; icon: React.ReactNode }[] = [
    { mood: 'Happy', icon: <Smile className="h-10 w-10 text-green-500" /> },
    { mood: 'Neutral', icon: <Meh className="h-10 w-10 text-yellow-500" /> },
    { mood: 'Sad', icon: <Frown className="h-10 w-10 text-red-500" /> },
  ];

  const moodToValue = (mood: Mood): number => {
    if (mood === 'Happy') return 3;
    if (mood === 'Neutral') return 2;
    if (mood === 'Sad') return 1;
    return 0;
  };

  const valueToMood = (value: number): Mood | null => {
      if (value === 3) return 'Happy';
      if (value === 2) return 'Neutral';
      if (value === 1) return 'Sad';
      return null;
  }
  
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [hasLoggedToday, setHasLoggedToday] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem(`moodJournal_${user?.name}`);
      if (storedEntries) {
        const entries: MoodEntry[] = JSON.parse(storedEntries);
        setMoodEntries(entries);
        const todayStr = startOfDay(new Date()).toISOString();
        if (entries.some(entry => entry.date === todayStr)) {
          setHasLoggedToday(true);
        }
      }
    } catch (error) {
      console.error("Could not load mood entries from localStorage", error);
    }
  }, [user]);

  const handleSaveMood = () => {
    if (!selectedMood || !user) return;

    const today = startOfDay(new Date());
    const newEntry: MoodEntry = {
      date: today.toISOString(),
      mood: selectedMood,
      note: note,
    };

    const updatedEntries = [...moodEntries.filter(entry => entry.date !== newEntry.date), newEntry];
    setMoodEntries(updatedEntries);
    
    try {
      localStorage.setItem(`moodJournal_${user.name}`, JSON.stringify(updatedEntries));
    } catch (error) {
        console.error("Could not save mood entries to localStorage", error);
    }
    
    setHasLoggedToday(true);
    setSelectedMood(null);
    setNote('');
  };

  const handleAnalyzeMoods = async () => {
    setIsLoadingAnalysis(true);
    setAnalysis('');

    const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));
    const recentEntries = moodEntries.filter(entry => new Date(entry.date) >= thirtyDaysAgo);

    try {
      const input: MoodJournalAnalysisInput = {
        entries: recentEntries,
        language: language,
      };
      const result = await analyzeMoodJournal(input);
      setAnalysis(result.analysis);
    } catch (error) {
      console.error('Failed to analyze mood journal:', error);
      const errorMessage = i18n.language === 'ar'
        ? 'عذرًا، لم نتمكن من تحليل يومياتك في هذا الوقت. يرجى المحاولة مرة أخرى لاحقًا.'
        : 'Sorry, we were unable to analyze your journal at this time. Please try again later.';
      setAnalysis(errorMessage);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const getChartData = () => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => startOfDay(subDays(new Date(), i))).reverse();
    return last7Days.map(day => {
      const entry = moodEntries.find(e => e.date === day.toISOString());
      return {
        name: format(day, 'EEE'),
        mood: entry ? moodToValue(entry.mood) : 0,
        fullDate: format(day, 'MMM d'),
      };
    });
  };
  
  const getTranslatedMood = (mood: Mood | null): string => {
    if (mood === 'Happy') return t('moodJournalPage.moods.happy');
    if (mood === 'Neutral') return t('moodJournalPage.moods.neutral');
    if (mood === 'Sad') return t('moodJournalPage.moods.sad');
    return t('moodJournalPage.moods.notLogged');
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              <BookOpen /> {t('moodJournalPage.title')}
            </CardTitle>
            <CardDescription>
              {t('moodJournalPage.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasLoggedToday ? (
              <div className="text-center p-8 bg-muted rounded-lg">
                <p className="font-semibold text-lg">{t('moodJournalPage.loggedToday')}</p>
                <p className="text-muted-foreground">{t('moodJournalPage.comeBackTomorrow')}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-around items-center p-4 rounded-lg bg-muted">
                  {moodOptions.map(({ mood, icon }) => (
                    <button
                      key={mood}
                      onClick={() => setSelectedMood(mood)}
                      className={`p-4 rounded-full transition-all duration-200 ${selectedMood === mood ? 'bg-primary/20 scale-110' : 'hover:bg-primary/10'}`}
                      aria-label={`Select mood: ${getTranslatedMood(mood)}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                {selectedMood && (
                  <div className="space-y-4">
                    <Textarea
                      placeholder={t('moodJournalPage.notePlaceholder')}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <Button onClick={handleSaveMood} className="w-full">
                      {t('moodJournalPage.saveButton')}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <BarChart2 /> {t('moodJournalPage.chartTitle')}
            </CardTitle>
            <CardDescription>{t('moodJournalPage.chartDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getChartData()} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
                        <YAxis 
                            stroke="hsl(var(--foreground))" 
                            fontSize={12} 
                            domain={[0, 3]} 
                            ticks={[1, 2, 3]}
                            tickFormatter={(value) => getTranslatedMood(valueToMood(value))}
                        />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                const moodValue = payload[0].value as number;
                                const mood = valueToMood(moodValue);
                                return (
                                <div className="p-2 bg-background border rounded-lg shadow-sm">
                                    <p className="font-bold">{`${label} (${(payload[0].payload as any).fullDate})`}</p>
                                    <p className="text-sm">Mood: {getTranslatedMood(mood)}</p>
                                </div>
                                );
                            }
                            return null;
                            }}
                        />
                        <Bar dataKey="mood" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
           <CardHeader>
             <CardTitle className="font-headline flex items-center gap-2">
                <Lightbulb /> {t('moodJournalPage.analysisTitle')}
             </CardTitle>
             <CardDescription>{t('moodJournalPage.analysisDescription')}</CardDescription>
           </CardHeader>
           <CardContent>
              {isLoadingAnalysis ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ) : analysis ? (
                <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
              ) : null}
             <Button onClick={handleAnalyzeMoods} disabled={isLoadingAnalysis || moodEntries.length === 0} className="mt-4">
               <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingAnalysis ? 'animate-spin' : ''}`} />
               {isLoadingAnalysis ? t('moodJournalPage.analyzingButton') : t('moodJournalPage.analyzeButton')}
             </Button>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}

    