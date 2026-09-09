import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Sriraam’s Map · Research Tower',
  icons: { icon: '/favicon.svg' },
  description:
    'Explore the Research Tower, the first section of Sriraam’s letter-built parchment map. Drag, pan and zoom into the quill-drawn architecture.',
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
