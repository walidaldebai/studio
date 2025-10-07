'use client';

import { useState, useRef, React } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Mic, Play, Pause, RefreshCw, Wand2 } from 'lucide-react';
import { generateAudioAffirmation, type GenerateAudioAffirmationInput } from '@/ai/flows/generate-audio-affirmation';
import { convertTextToSpeech } from '@/ai/flows/text-to-speech';
import { useAppTranslation, useLanguage } from '@/context/language-provider';
import ReactMarkdown from 'react-markdown';

type AffirmationTheme = 'Self-Compassion' | 'Finding Joy' | 'Building Confidence' | 'Overcoming Fear';

export default function AudioAffirmationsPage() {
  const { t } = useAppTranslation();
  const { language } = useLanguage();

  const themes: { value: AffirmationTheme, label: string }[] = [
    { value: 'Self-Compassion', label: t('audioAffirmationsPage.themes.selfCompassion') },
    { value: 'Finding Joy', label: t('audioAffirmationsPage.themes.findingJoy') },
    { value: 'Building Confidence', label: t('audioAffirmationsPage.themes.buildingConfidence') },
    { value: 'Overcoming Fear', label: t('audioAffirmationsPage.themes.overcomingFear') },
  ];
  
  const [selectedTheme, setSelectedTheme] = useState<AffirmationTheme | null>(null);
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
      const affirmationInput: GenerateAudioAffirmationInput = { theme: selectedTheme, language };
      // Generate script and audio together
      const { title, script } = await generateAudioAffirmation(affirmationInput);
      const { audio } = await convertTextToSpeech(script);
      
      // Set the session only when both are ready
      setSession({ title, script, audio });

    } catch (error) {
      console.error('Failed to generate affirmation session:', error);
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
              <Mic /> {t('audioAffirmationsPage.title')}
            </CardTitle>
            <CardDescription>{t('audioAffirmationsPage.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select 
                onValueChange={(value: AffirmationTheme) => setSelectedTheme(value)}
                disabled={isLoading}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={t('audioAffirmationsPage.selectTheme')} />
                </SelectTrigger>
                <SelectContent>
                  {themes.map(theme => (
                    <SelectItem key={theme.value} value={theme.value}>{theme.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleGenerateSession} disabled={!selectedTheme || isLoading} className="flex-shrink-0">
                <Wand2 className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? t('audioAffirmationsPage.generating') : t('audioAffirmationsPage.generateButton')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="flex flex-col items-center gap-4 py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">{t('audioAffirmationsPage.generating')}</p>
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
                  <p className="text-muted-foreground text-sm">{t('audioAffirmationsPage.playerHint')}</p>
                </div>
              ) : (
                 // This part should rarely be seen now, but kept as a fallback.
                <div className="flex flex-col items-center gap-4 py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">{t('audioAffirmationsPage.generatingAudio')}</p>
                </div>
              )}
              
              <div className="prose dark:prose-invert max-w-none bg-muted p-4 rounded-lg">
                <ReactMarkdown>{session.script}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
