'use client';

import { useState, useRef, React } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Headset, Play, Pause, RefreshCw, Wand2 } from 'lucide-react';
import { generateMeditationScript, type GenerateMeditationInput } from '@/ai/flows/generate-meditation';
import { convertTextToSpeech } from '@/ai/flows/text-to-speech';
import { useAppTranslation, useLanguage } from '@/context/language-provider';

type MeditationTheme = 'Stress Relief' | 'Focus' | 'Gratitude' | 'Sleep' | 'De-Stress';

export default function MeditationsPage() {
  const { t } = useAppTranslation();
  const { language } = useLanguage();

  const themes: { value: MeditationTheme, label: string }[] = [
    { value: 'Stress Relief', label: t('meditationsPage.themes.stress') },
    { value: 'De-Stress', label: t('meditationsPage.themes.deStress') },
    { value: 'Focus', label: t('meditationsPage.themes.focus') },
    { value: 'Gratitude', label: t('meditationsPage.themes.gratitude') },
    { value: 'Sleep', label: t('meditationsPage.themes.sleep') },
  ];
  
  const [selectedTheme, setSelectedTheme] = useState<MeditationTheme | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<{ title: string; script: string; audio: string | null } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerateSession = async () => {
    if (!selectedTheme) return;
    setIsLoading(true);
    setSession(null);
    setIsPlaying(false);

    try {
      // Step 1: Generate Script
      const meditationInput: GenerateMeditationInput = { theme: selectedTheme, language };
      const { title, script } = await generateMeditationScript(meditationInput);
      setSession({ title, script, audio: null });

      // Step 2: Generate Audio
      const { audio } = await convertTextToSpeech(script);
      setSession({ title, script, audio });

    } catch (error) {
      console.error('Failed to generate meditation session:', error);
      // You could show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              <Headset /> {t('meditationsPage.title')}
            </CardTitle>
            <CardDescription>{t('meditationsPage.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select 
                onValueChange={(value: MeditationTheme) => setSelectedTheme(value)}
                disabled={isLoading}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={t('meditationsPage.selectTheme')} />
                </SelectTrigger>
                <SelectContent>
                  {themes.map(theme => (
                    <SelectItem key={theme.value} value={theme.value}>{theme.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleGenerateSession} disabled={!selectedTheme || isLoading} className="flex-shrink-0">
                <Wand2 className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? t('meditationsPage.generating') : t('meditationsPage.generateButton')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading && !session && (
          <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="flex flex-col items-center gap-4 py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">{t('meditationsPage.generating')}</p>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </CardContent>
          </Card>
        )}

        {session && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">{session.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {session.audio ? (
                <div className="flex flex-col items-center gap-4">
                  <audio
                    ref={audioRef}
                    src={session.audio}
                    onEnded={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                  <Button onClick={togglePlayPause} size="icon" className="h-16 w-16 rounded-full">
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </Button>
                  <p className="text-muted-foreground text-sm">{t('meditationsPage.playerHint')}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">{t('meditationsPage.generatingAudio')}</p>
                </div>
              )}
              
              <div className="prose prose-sm dark:prose-invert max-w-none bg-muted p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{session.script}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
