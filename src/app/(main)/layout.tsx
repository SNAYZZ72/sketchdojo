"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/providers/auth-provider';
import { Toaster } from 'sonner';

const StudioLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  
  // Check if current path is an auth path (sign-in or sign-up)
  const isAuthPath = pathname.includes('/sign-in') || pathname.includes('/sign-up');

  return (
    <AuthProvider>
      {/* Toast notifications */}
      <Toaster position="top-center" />
      
      {/* Main content */}
      {children}
    </AuthProvider>
  );
};

export default StudioLayout;