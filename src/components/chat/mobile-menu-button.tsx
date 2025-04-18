'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

interface MobileMenuButtonProps {
  onClick: () => void;
  className?: string;
}

/**
 * Floating action button for mobile to toggle the chat sidebar
 */
export function MobileMenuButton({ onClick, className = '' }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`md:hidden fixed bottom-4 right-4 z-20 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg shadow-purple-700/20 transition-all ${className}`}
      aria-label="Toggle chat sidebar"
    >
      <MessageSquare className="h-5 w-5" />
    </button>
  );
}