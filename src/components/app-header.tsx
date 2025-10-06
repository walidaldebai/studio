
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, MessageSquare, BrainCircuit, Settings, UserCircle, LogOut, BookOpen, Wind, Languages, Headset, Palmtree, Target } from 'lucide-react';
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
import React from 'react';

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

  const navLinks = [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/rant-chat', label: t('rantChat'), icon: MessageSquare },
    { href: '/guidance', label: t('guidance'), icon: BrainCircuit },
    { href: '/mood-journal', label: t('moodJournal'), icon: BookOpen },
    { href: '/breathing', label: t('breathing'), icon: Wind },
    { href: '/meditations', label: t('meditations'), icon: Headset },
    { href: '/values-discovery', label: t('valuesDiscovery'), icon: Target },
    { href: '/sand-garden', label: t('sandGarden'), icon: Palmtree },
  ];

  const duplicatedNavLinks = [...navLinks, ...navLinks];


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <HeartHandIcon className="h-6 w-6 text-primary" />
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
                  router.push('/onboarding');
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
  );
}

function HeartHandIcon(props: React.SVGProps<SVGSVGElement>) {
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
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.82 2.94 0l.96-.96.96.96c.82.82 2.13.82 2.94 0v0a2.17 2.17 0 0 0 0-3.08L12 5Z" />
      </svg>
    )
  }
