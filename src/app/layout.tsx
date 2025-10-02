import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import { QueryProvider } from '@/components/query-provider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import Head from 'next/head';

import './globals.css';

export const metadata: Metadata = {
  title: 'Fluid Tasks',
  description: 'Your personal task manager.',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const RootLayout = ({ children }: Readonly<PropsWithChildren>) => {
  return (
    <html lang="en">
      <Head>
        <title>Fluid Tasks</title>
        <link rel="icon" href="/icon.svg" />
      </Head>
      <body className={`${inter.variable} min-h-screen antialiased`}>
        <QueryProvider>
          <Toaster theme="light" richColors closeButton />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
