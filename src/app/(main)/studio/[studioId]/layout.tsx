"use client";

import React from 'react';
import ProtectedRoute from '@/components/protected-route';

const StudioIdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col">
        {/* You can add studio navigation here */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default StudioIdLayout;