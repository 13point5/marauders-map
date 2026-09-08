import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Sriraam’s Map · Unfold & Wander',
  icons: { icon: '/favicon.svg' },
  description:
    'Unfold a parchment map of Sriraam’s castle and grounds. Explore letter-built halls, a word forest and a walled garden with touch, pan and zoom.',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
