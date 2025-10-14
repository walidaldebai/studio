
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
          href='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22hsl(262.1%2083.3%25%2057.8%25)%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M8%2018V14%22/%3E%3Cpath%20d%3D%22M12%2018V10%22/%3E%3Cpath%20d%3D%22M16%2018V14%22/%3E%3Cpath%20d%3D%22M12%204v2%22/%3E%3Cpath%20d%3D%22M12%2020h.01%22/%3E%3C/svg%3E'
        />
      </head>
      <body className={cn("font-body antialiased", "bg-background bg-gradient-main")} suppressHydrationWarning>
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
