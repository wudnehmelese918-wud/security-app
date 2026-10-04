import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'DBU Security Gate Management System | Debre Berhan University',
  description:
    'Official Debre Berhan University Asset & Gate Security Management Platform. Real-time QR clearance, biometric verification, and institutional gate pass tracking.',
  icons: {
    icon: '/dbu-logo.png',
    shortcut: '/dbu-logo.png',
    apple: '/dbu-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
