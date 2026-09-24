import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bitcoin Script Visualizer — Execution Simulator',
  description: 'Interactive educational simulator for stack-based Bitcoin Script execution.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B0F17] text-[#F8FAFC] antialiased selection:bg-[#F7931A] selection:text-[#0B0F17]">
        {children}
      </body>
    </html>
  );
}
