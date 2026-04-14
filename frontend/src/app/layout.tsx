import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Toaster } from 'react-hot-toast';
import ServiceWorkerRegister from '@/components/pwa/ServiceWorkerRegister';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Billing Sembok - ISP Management System',
  description: 'The complete billing and management solution for Internet Service Providers. Automate invoicing, track payments, and grow your business.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'LokalISP Billing',
    statusBarStyle: 'default',
  },
};

export const viewport = {
  themeColor: '#7c3aed',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Toaster position="top-right" />
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
