'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/context/user-provider';
import { Smile, Meh, Frown, BookOpen, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

type Mood = 'Happy' | 'Neutral' | 'Sad';

interface MoodEntry {
  date: string;
  mood: Mood;
  note?: string;
}

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

export default function MoodJournalPage() {
  const { user } = useUser();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [hasLoggedToday, setHasLoggedToday] = useState(false);

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

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              <BookOpen /> Mood Journal
            </CardTitle>
            <CardDescription>
              How are you feeling today? Log your mood to track your emotional well-being.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasLoggedToday ? (
              <div className="text-center p-8 bg-muted rounded-lg">
                <p className="font-semibold text-lg">You've already logged your mood for today.</p>
                <p className="text-muted-foreground">Come back tomorrow to log again!</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-around items-center p-4 rounded-lg bg-muted">
                  {moodOptions.map(({ mood, icon }) => (
                    <button
                      key={mood}
                      onClick={() => setSelectedMood(mood)}
                      className={`p-4 rounded-full transition-all duration-200 ${selectedMood === mood ? 'bg-primary/20 scale-110' : 'hover:bg-primary/10'}`}
                      aria-label={`Select mood: ${mood}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                {selectedMood && (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Add a note about your mood (optional)"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <Button onClick={handleSaveMood} className="w-full">
                      Save Today's Mood
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
                <BarChart2 /> Mood History (Last 7 Days)
            </CardTitle>
            <CardDescription>Visualize your mood patterns over the past week.</CardDescription>
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
                            tickFormatter={(value) => valueToMood(value) || ''}
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
                                    <p className="text-sm">Mood: {mood || 'Not Logged'}</p>
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
      </div>
    </div>
  );
}
