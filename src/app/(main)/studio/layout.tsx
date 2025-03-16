"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/providers/auth-provider';
import { Toaster } from 'sonner';
import { MainSidebar } from '@/components/studio/main-sidebar';

const StudioLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  
  // Check if current path is an auth path (sign-in, sign-up, or reset-password)
  const isAuthPath = pathname.includes('/sign-in') || pathname.includes('/sign-up') || pathname.includes('/reset-password');

  return (
    <AuthProvider>
      {/* Toast notifications */}
      <Toaster position="top-center" />
      
      {isAuthPath ? (
        // For auth pages, just show the content without sidebar
        <div className="min-h-screen">
          {children}
        </div>
      ) : (
        // For non-auth pages, show the responsive sidebar layout
        <div className="flex min-h-screen bg-background">
          <MainSidebar />
          <main className="flex-1 overflow-auto w-full">
            {/* Content with padding for mobile menu button */}
            <div className="md:pl-0 pt-16 md:pt-0">
              {children}
            </div>
          </main>
        </div>
      )}
    </AuthProvider>
  );
};

export default StudioLayout;