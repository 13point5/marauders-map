import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Letters into Architecture · Sriraam’s Map Study', icons: { icon: '/favicon.svg' }, description: 'Original floor plans assembled from reusable hand-lettered vector pieces. Explore two new designs, the letter kit, and the approved reference tower.' };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
