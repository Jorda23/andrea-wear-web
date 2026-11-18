import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../src/index.css';
import { AppProviders } from './providers';

export const metadata: Metadata = {
  title: 'Andrea Wear',
  description: 'Explore thoughtful fashion, easy checkout, and order tracking at Andrea Wear.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
