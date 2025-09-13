import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from 'react-hot-toast';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Fal Platform - Modern Fal Baktırma & Ritüel Platformu',
  description: 'El falı, yüz falı, kahve falı ve ritüel hizmetleri sunan modern platform',
  keywords: 'fal, el falı, yüz falı, kahve falı, ritüel, astroloji',
  authors: [{ name: 'Fal Platform Team' }],
  robots: 'index, follow',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Fal Platform - Modern Fal Baktırma & Ritüel Platformu',
    description: 'El falı, yüz falı, kahve falı ve ritüel hizmetleri sunan modern platform',
    type: 'website',
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fal Platform - Modern Fal Baktırma & Ritüel Platformu',
    description: 'El falı, yüz falı, kahve falı ve ritüel hizmetleri sunan modern platform',
  },
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#667eea" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Fal Platform" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <ServiceWorkerRegistration />
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
