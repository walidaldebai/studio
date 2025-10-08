
import type { Metadata } from 'next';
import { ThemeProvider } from '@/context/theme-provider';
import { UserProvider } from '@/context/user-provider';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-provider';
import './globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Kaatf',
  description: 'Find your calm and clarity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(180 70% 40%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2Z" /><path d="M16 2v17a3 3 0 0 1-3 3H7" /><path d="M6 8h2" /><path d="M6 12h2" /><path d="M6 16h2" /></svg>'
        />
      </head>
      <body className={cn("font-body antialiased", "bg-gradient-main")} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LanguageProvider>
            <UserProvider>
              {children}
              <Toaster />
            </UserProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
