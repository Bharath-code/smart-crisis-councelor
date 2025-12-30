import type { Metadata } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/contexts/SessionContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  style: 'italic',
  variable: '--font-serif'
});

export const metadata: Metadata = {
  title: 'Smart Crisis Counselor',
  description: 'AI-powered crisis counselor with real-time voice support',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CrisisHelp',
  },
  formatDetection: {
    telephone: true,
  },
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${instrumentSerif.variable} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
