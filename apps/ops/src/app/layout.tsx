import './globals.css';
import React from 'react';
import OpsLayoutWrapper from './OpsLayoutWrapper';

export const metadata = {
  title: 'StadiumPulse Ops Control Center',
  description: 'Real-time Crowd Analytics & AI Copilot Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <OpsLayoutWrapper>
          {children}
        </OpsLayoutWrapper>
      </body>
    </html>
  );
}
