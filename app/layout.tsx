import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

// Use Outfit for headings and Inter for body text for a modern feel
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Personal Finance Tracker',
  description: 'A modern, premium personal finance tracker',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang=\"zh-TW\" className={`${outfit.variable} ${inter.variable}`}>
      <body className=\"bg-[#111827] text-white font-inter min-h-screen flex selection:bg-blue-500/30 selection:text-blue-200\">
        <Sidebar />
        <div className=\"flex-1 flex flex-col pl-20 lg:pl-64 min-h-screen transition-all duration-300\">
          <Navbar />
          <main className=\"flex-1 p-6 lg:p-10 pt-24 lg:pt-28 overflow-hidden\">
            <div className=\"max-w-7xl mx-auto w-full\">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
