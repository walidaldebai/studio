import type { Metadata } from 'next';
import { ThemeProvider } from '@/context/theme-provider';
import { UserProvider } from '@/context/user-provider';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zen Zone',
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
          href='data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(0, 0%, 5.1%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.82 2.94 0l.96-.96.96.96c.82.82 2.13.82 2.94 0v0a2.17 2.17 0 0 0 0-3.08L12 5Z" /></svg>'
        />
      </head>
      <body className="font-body antialiased">
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
