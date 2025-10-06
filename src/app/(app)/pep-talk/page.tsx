'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Play, Pause, RefreshCw, Volume2, Bot } from 'lucide-react';
import { generatePepTalk, type GeneratePepTalkInput } from '@/ai/flows/generate-pep-talk';
import { convertTextToSpeech } from '@/ai/flows/text-to-speech';
import { useAppTranslation, useLanguage } from '@/context/language-provider';

export default function PepTalkPage() {
  const { t } = useAppTranslation();
  const { language } = useLanguage();

  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<{ pepTalk: string; audio: string | null } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerateSession = async () => {
    setIsLoading(true);
    setSession(null);
    setIsPlaying(false);

    try {
      const pepTalkInput: GeneratePepTalkInput = { language };
      const { pepTalk } = await generatePepTalk(pepTalkInput);
      setSession({ pepTalk, audio: null });

      const { audio } = await convertTextToSpeech(pepTalk);
      setSession({ pepTalk, audio });

    } catch (error) {
      console.error('Failed to generate pep talk session:', error);
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
              <Volume2 /> {t('pepTalkPage.title')}
            </CardTitle>
            <CardDescription>{t('pepTalkPage.description')}</CardDescription>
          </CardHeader>
          <CardContent>
              <Button onClick={handleGenerateSession} disabled={isLoading} className="w-full">
                <Sparkles className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? t('pepTalkPage.generating') : t('pepTalkPage.generateButton')}
              </Button>
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
                  <p className="text-muted-foreground">{t('pepTalkPage.generating')}</p>
                </div>
            </CardContent>
          </Card>
        )}

        {session && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Bot /> {t('pepTalkPage.cardTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-lg dark:prose-invert max-w-none text-center italic">
                <p>&ldquo;{session.pepTalk}&rdquo;</p>
              </div>

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
                  <p className="text-muted-foreground text-sm">{t('pepTalkPage.playerHint')}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 py-4">
                  <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-muted-foreground text-sm">{t('pepTalkPage.generatingAudio')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
