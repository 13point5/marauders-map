import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'The Stair Tower · Sriraam’s Map Study', icons: { icon: '/favicon.svg' }, description: 'A single hand-lettered stair tower, traced from an original Marauder’s Map photograph. Explore the drawing and compare its contours with the source.' };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
