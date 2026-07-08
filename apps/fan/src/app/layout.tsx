import './globals.css';
import React from 'react';
import { SettingsProvider } from '../context/SettingsContext';
import Link from 'next/link';
import { Home, MessageSquare, Map, Car, Accessibility, WifiOff } from 'lucide-react';
import HeaderWrapper from '@/app/HeaderWrapper';

export const metadata = {
  title: 'StadiumPulse Fan PWA',
  description: 'AI-Powered Stadium Assistant & Wayfinding PWA',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#020617" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="antialiased">
        <SettingsProvider>
          {/* Skip link for keyboard navigation (a11y) */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only absolute top-4 left-4 bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold z-50 shadow-lg border border-white"
          >
            Skip to Content
          </a>

          {/* Persistent Header */}
          <HeaderWrapper />

          {/* Main Content Area */}
          <div id="main-content" className="flex-1 flex flex-col pb-20 overflow-y-auto">
            {children}
          </div>

          {/* Bottom Tab Bar Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 flex justify-around items-center z-40 px-2 shadow-2xl">
            <Link 
              href="/" 
              className="flex flex-col items-center justify-center text-slate-400 hover:text-emerald-400 active:text-emerald-400 w-16 h-full transition"
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-medium">Home</span>
            </Link>
            <Link 
              href="/assistant" 
              className="flex flex-col items-center justify-center text-slate-400 hover:text-emerald-400 active:text-emerald-400 w-16 h-full transition"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-medium">Assistant</span>
            </Link>
            <Link 
              href="/map" 
              className="flex flex-col items-center justify-center text-slate-400 hover:text-emerald-400 active:text-emerald-400 w-16 h-full transition"
            >
              <Map className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-medium">Map</span>
            </Link>
            <Link 
              href="/transport" 
              className="flex flex-col items-center justify-center text-slate-400 hover:text-emerald-400 active:text-emerald-400 w-16 h-full transition"
            >
              <Car className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-medium">Transport</span>
            </Link>
          </nav>
        </SettingsProvider>
      </body>
    </html>
  );
}
