import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Sriraam’s Map · Towers & Halls', icons: { icon: '/favicon.svg' }, description: 'Explore the photographed tower, connected halls, and stairwell as source-traced vector ink, with pan, zoom, and aligned photo comparisons.' };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
