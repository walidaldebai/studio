
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, MessageSquare, BrainCircuit, Settings, UserCircle, LogOut, BookOpen, Wind, Languages, Headset, Palmtree, Mic, Ear, GraduationCap, Gift, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { useUser } from '@/context/user-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppTranslation, useLanguage } from '@/context/language-provider';
import React, { useState } from 'react';
import { WhatsNewDialog } from './whats-new-dialog';

function LanguageToggle() {
    const { language, setLanguage } = useLanguage();
  
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Languages className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')} disabled={language === 'en'}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ar')} disabled={language === 'ar'}>العربية</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
  }

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUser();
  const { t } = useAppTranslation();
  const [isWhatsNewOpen, setIsWhatsNewOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/rant-chat', label: t('rantChat'), icon: MessageSquare },
    { href: '/guidance', label: t('guidance'), icon: BrainCircuit },
    { href: '/mood-journal', label: t('moodJournal'), icon: BookOpen },
    { href: '/breathing', label: t('breathing'), icon: Wind },
    { href: '/meditations', label: t('meditations'), icon: Headset },
    { href: '/audio-affirmations', label: t('audioAffirmations'), icon: Mic },
    { href: '/mindful-moments', label: t('mindfulMoments'), icon: Ear },
    { href: '/sand-garden', label: t('sandGarden'), icon: Palmtree },
  ];

  if (user?.specialization.toLowerCase() === 'teacher') {
    navLinks.splice(1, 0, { href: '/pocket-coach', label: t('pocketCoach'), icon: GraduationCap });
    navLinks.splice(2, 0, { href: '/lesson-destressor', label: t('lessonDestressor'), icon: ClipboardCheck });
  }

  const duplicatedNavLinks = [...navLinks, ...navLinks];


  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
              <ShoulderIcon className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline text-lg">{t('appName')}</span>
              <Badge variant="outline">{t('appVersion')}</Badge>
            </Link>
            <div className="hidden md:flex items-center overflow-hidden w-full max-w-2xl">
              <div className="animate-marquee whitespace-nowrap flex">
                  {duplicatedNavLinks.map(({ href, label, icon: Icon }, index) => (
                  <Link
                      key={`${label}-${index}`}
                      href={href}
                      className={cn(
                      'flex items-center gap-2 transition-colors hover:text-primary mx-4',
                      pathname === href ? 'text-primary' : 'text-muted-foreground'
                      )}
                  >
                      <Icon className="h-4 w-4" />
                      {label}
                  </Link>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setIsWhatsNewOpen(true)}>
                <Gift className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">{t('whatsNew.title')}</span>
            </Button>
            <LanguageToggle />
            <ThemeToggle />
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <UserCircle className="h-8 w-8" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.specialization}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="w-full flex">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t('settings')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    logout();
                    router.push('/');
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>
      <WhatsNewDialog isOpen={isWhatsNewOpen} onOpenChange={setIsWhatsNewOpen} />
    </>
  );
}

function ShoulderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2Z" />
      <path d="M16 2v17a3 3 0 0 1-3 3H7" />
      <path d="M6 8h2" />
      <path d="M6 12h2" />
      <path d="M6 16h2" />
    </svg>
  );
}
