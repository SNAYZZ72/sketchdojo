// src/app/(main)/studio/editor/[id]/components/LoadingState.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <div className="absolute inset-0 blur-xl bg-gradient-to-r from-primary/30 to-accent/30 animate-pulse rounded-full"></div>
        </div>
        <h2 className="text-xl font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Loading editor...</h2>
      </div>
    </div>
  );
}