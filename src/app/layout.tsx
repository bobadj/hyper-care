import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import './globalicons.css';

import Header from '../components/Header';
import Footer from '../components/Footer';
import QueryProvider from '@/providers/QueryProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HyperCare',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
        >
          <Header />
          <div className="w-full border-b border-neutral-200 bg-white p-4">
            <div className="max-w-[1200px] mx-auto">
              <h1 className="text-lg font-bold">Welcome to HyperCare</h1>
            </div>
          </div>
          <div className="flex flex-row min-h-[80%] items-stretch max-w-[1200px] mx-auto mb-4">
            <div className="w-full bg-gray-50">{children}</div>
          </div>
          <Footer />
        </body>
      </QueryProvider>
    </html>
  );
}
