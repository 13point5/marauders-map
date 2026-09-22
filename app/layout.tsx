import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Sriraam’s Map · The Castle',
  icons: { icon: '/favicon.svg' },
  description:
    'Explore Sriraam’s castle: a Great Hall, Research Tower, and growing rooms for ideas, writing and work. Pan, zoom, and tap a room.',
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
