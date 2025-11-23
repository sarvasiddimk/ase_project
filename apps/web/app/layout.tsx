import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppLayout from '@/components/layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Red Panther ASE',
  description: 'Adaptive Service Ecosystem',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
