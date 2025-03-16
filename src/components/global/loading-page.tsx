"use client";

import Loading from '@/components/global/loading';
import React, { useEffect, useState } from 'react';
import { LoaderIcon } from 'lucide-react';

interface LoadingPageProps {
  /** Optional custom message to display while loading */
  message?: string;
  
  /** Optional secondary message */
  subMessage?: string;
  
  /** Optional timeout in milliseconds before showing the loading state (prevents flash) */
  delayMs?: number;
  
  /** Optional timeout in milliseconds to show a "taking longer than expected" message */
  timeoutMs?: number;
  
  /** Optional className to apply to the container */
  className?: string;
  
  /** Size of the loading spinner */
  spinnerSize?: 'sm' | 'default' | 'lg' | 'xl';
  
  /** Brand colors theme */
  theme?: 'default' | 'primary' | 'subtle';
}

/**
 * A full-screen loading page component with customizable messages and timeouts
 */
const LoadingPage: React.FC<LoadingPageProps> = ({
  message = "Loading...",
  subMessage,
  delayMs = 0,
  timeoutMs = 10000,
  className = "",
  spinnerSize = "lg",
  theme = "default",
}) => {
  const [showLoading, setShowLoading] = useState(delayMs === 0);
  const [showTimeout, setShowTimeout] = useState(false);
  
  useEffect(() => {
    // Only show loading indicator after delay to prevent flash
    if (delayMs > 0) {
      const delayTimer = setTimeout(() => setShowLoading(true), delayMs);
      return () => clearTimeout(delayTimer);
    }
  }, [delayMs]);
  
  useEffect(() => {
    // Show timeout message if loading takes too long
    if (timeoutMs > 0) {
      const timeoutTimer = setTimeout(() => setShowTimeout(true), timeoutMs);
      return () => clearTimeout(timeoutTimer);
    }
  }, [timeoutMs]);
  
  if (!showLoading) {
    return null;
  }
  
  // Theme styles
  const themeStyles = {
    default: {
      bg: "bg-background",
      text: "text-foreground",
      subText: "text-muted-foreground",
      accent: "from-sketchdojo-primary to-sketchdojo-accent",
    },
    primary: {
      bg: "bg-gradient-to-b from-sketchdojo-bg to-sketchdojo-bg-light",
      text: "text-white",
      subText: "text-white/60",
      accent: "from-sketchdojo-primary to-sketchdojo-accent",
    },
    subtle: {
      bg: "bg-muted/50 backdrop-blur-md",
      text: "text-foreground",
      subText: "text-muted-foreground",
      accent: "from-primary/70 to-primary",
    },
  };
  
  const currentTheme = themeStyles[theme];
  
  return (
    <div 
      className={`fixed inset-0 h-screen w-screen flex flex-col justify-center items-center ${currentTheme.bg} z-50 ${className}`}
      role="status"
      aria-label="Loading content"
    >
      {/* Background decorative elements for primary theme */}
      {theme === 'primary' && (
        <>
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-sketchdojo-primary rounded-full filter blur-[100px] opacity-10"></div>
          <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-sketchdojo-accent rounded-full filter blur-[120px] opacity-10"></div>
        </>
      )}
      
      <div className="flex flex-col items-center justify-center space-y-6 relative z-10">
        {/* Use different loading styles based on theme */}
        {theme === 'primary' ? (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent opacity-20 blur-xl rounded-full"></div>
            <Loading size={spinnerSize} className="relative z-10" />
          </div>
        ) : (
          <Loading size={spinnerSize} />
        )}
        
        <div className="flex flex-col items-center text-center space-y-1 max-w-xs px-4">
          <p className={`text-lg font-medium animate-pulse ${currentTheme.text}`}>
            {message}
          </p>
          
          {subMessage && (
            <p className={`text-sm ${currentTheme.subText}`}>
              {subMessage}
            </p>
          )}
          
          {showTimeout && (
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-amber-500 flex items-center">
                <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                This is taking longer than expected. Please wait a moment...
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Branding for primary theme */}
      {theme === 'primary' && (
        <div className="absolute bottom-8 text-center">
          <p className="text-white/40 text-sm">
            SketchDojo.ai
          </p>
        </div>
      )}
    </div>
  );
};

export default LoadingPage;