import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bitcoin Script Visualizer & Disassembler | Alexandria Archive',
  description: 'Interactive educational simulator for stack-based Bitcoin Script execution.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-on-surface font-body antialiased selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
        {children}
      </body>
    </html>
  );
}
