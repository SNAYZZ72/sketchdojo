'use client';

import React from 'react';

interface ChatLoadingStateProps {
  message?: string;
  className?: string;
}

/**
 * Loading state component for the chat page
 */
export function ChatLoadingState({ 
  message = 'Loading your manga experience...', 
  className = ''
}: ChatLoadingStateProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Glow effect behind spinner */}
          <div className="absolute inset-0 bg-purple-600/30 blur-xl rounded-full"></div>
          
          {/* Animated spinner */}
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin relative"></div>
        </div>
        
        <p className="text-white text-center max-w-xs">
          {message}
        </p>
      </div>
    </div>
  );
}