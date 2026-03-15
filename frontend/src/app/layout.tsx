import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { AuthBootstrap } from '@/features/auth/components/auth-bootstrap';

export const metadata: Metadata = {
  title: 'Secure OAuth Authentication System',
  description: 'Production-grade authentication flow with access and refresh token rotation.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthBootstrap>{children}</AuthBootstrap>
      </body>
    </html>
  );
}
