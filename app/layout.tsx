import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Sriraam · The Marauder’s Map', icons: { icon: '/favicon.svg' }, description: 'A little mischief, a lot of curiosity. Unfold an enchanted map of Sriraam’s research, writing, and world.' };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
