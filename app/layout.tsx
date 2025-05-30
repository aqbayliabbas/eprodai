import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "sonner";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YouTube Thumbnail Generator - AI-Powered',
  description: 'Create eye-catching YouTube thumbnails using AI with DALL-E 3',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
