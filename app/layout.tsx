import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { headers } from 'next/headers';

import WagmiContextProvider from '@/contexts/WagmiContextProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Swapscout',
  description: 'Swap between chains fast and easy. Powered by Blockscout',
  icons: [
    { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    { rel: 'apple-touch-icon', url: '/favicon-256x256.png' },
  ],
  openGraph: {
    title: 'Swapscout',
    description: 'Swap between chains fast and easy. Powered by Blockscout',
    images: [{ url: '/og-image.png', width: 1200, height: 600 }],
    type: 'website',
  },
};

const GoogleAnalytics = () => {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `}
      </Script>
    </>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookies = headers().get('cookie');

  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon-256x256.png" />
      </head>
      <body className={inter.className}>
        <WagmiContextProvider cookies={cookies}>
          {children}
        </WagmiContextProvider>
      </body>
    </html>
  );
}
