
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Waves, Play, Pause, CloudRain, TreePine, Coffee } from 'lucide-react';
import { useAppTranslation } from '@/context/language-provider';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type Soundscape = {
  id: string;
  titleKey: keyof typeof en.soundscapesPage.sounds;
  Icon: React.ElementType;
  audioSrc: string;
  imageSrc: string;
};

// Lazy load translations to avoid making this a server component
const en = {
    soundscapesPage: {
      sounds: {
        rain: "Rainfall",
        forest: "Forest",
        ocean: "Ocean Waves",
        cafe: "Cozy Cafe"
      }
    }
};
const ar = {
    soundscapesPage: {
        sounds: {
            rain: "هطول المطر",
            forest: "غابة",
            ocean: "أمواج المحيط",
            cafe: "مقهى دافئ"
        }
    }
};


export default function SoundscapesPage() {
  const { t, i18n } = useAppTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const soundscapes: Soundscape[] = [
    {
      id: 'rain',
      titleKey: 'rain',
      Icon: CloudRain,
      audioSrc: 'https://soundbible.com/grab.php?id=1778&type=mp3',
      imageSrc: 'https://images.unsplash.com/photo-1515694346937-94d85e41e622?q=80&w=1980',
    },
    {
      id: 'forest',
      titleKey: 'forest',
      Icon: TreePine,
      audioSrc: 'https://soundbible.com/grab.php?id=1771&type=mp3',
      imageSrc: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070',
    },
    {
      id: 'ocean',
      titleKey: 'ocean',
      Icon: Waves,
      audioSrc: 'https://soundbible.com/grab.php?id=1933&type=mp3',
      imageSrc: 'https://images.unsplash.com/photo-1439405326853-58f2724f2b30?q=80&w=2070',
    },
    {
      id: 'cafe',
      titleKey: 'cafe',
      Icon: Coffee,
      audioSrc: 'https://soundbible.com/grab.php?id=1630&type=mp3',
      imageSrc: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1974',
    },
  ];

  const getSoundTitle = (titleKey: keyof typeof en.soundscapesPage.sounds) => {
    const translations = i18n.language === 'ar' ? ar : en;
    return translations.soundscapesPage.sounds[titleKey];
  }


  const toggleSound = (sound: Soundscape) => {
    if (activeSound === sound.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setActiveSound(sound.id);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = sound.audioSrc;
        audioRef.current.play();
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <Waves /> {t('soundscapesPage.title')}
          </CardTitle>
          <CardDescription>{t('soundscapesPage.description')}</CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {soundscapes.map((sound) => (
          <Card key={sound.id} className="overflow-hidden relative group">
            <Image
              src={sound.imageSrc}
              alt={getSoundTitle(sound.titleKey)}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative flex flex-col justify-between h-48 p-6 text-white">
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <sound.Icon className="h-6 w-6" /> {getSoundTitle(sound.titleKey)}
              </CardTitle>
              <Button
                onClick={() => toggleSound(sound)}
                size="icon"
                variant="secondary"
                className={cn(
                    "rounded-full h-12 w-12",
                    activeSound === sound.id && isPlaying && "bg-primary text-primary-foreground"
                )}
              >
                {activeSound === sound.id && isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <audio ref={audioRef} loop onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
    </div>
  );
}
