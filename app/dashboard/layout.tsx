import React from 'react';
import { Toaster } from 'sonner';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <main className="flex-1 flex flex-col items-center justify-start p-8 overflow-y-auto">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
