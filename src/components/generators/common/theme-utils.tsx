import { useEffect, useState } from 'react';

/**
 * Utility hook for determining the current theme
 */
export const useThemeDetector = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if document is available (client-side only)
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      // Initial check
      setIsDarkMode(document.documentElement.classList.contains('dark'));
      
      // Create observer for theme changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.attributeName === 'class' &&
            mutation.target === document.documentElement
          ) {
            const isDark = document.documentElement.classList.contains('dark');
            setIsDarkMode(isDark);
          }
        });
      });
      
      // Start observing
      observer.observe(document.documentElement, { attributes: true });
      
      // Cleanup
      return () => observer.disconnect();
    }
  }, []);
  
  return isDarkMode;
};

/**
 * Utility functions for generating theme-aware styles
 */
export const themeAwareStyles = {
  // Text colors
  text: {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-700 dark:text-white/80',
    muted: 'text-gray-600 dark:text-white/60',
    inverted: 'text-white dark:text-gray-900',
  },
  
  // Background colors
  bg: {
    card: 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10',
    input: 'bg-white dark:bg-white/5 border-gray-300 dark:border-white/20',
    muted: 'bg-gray-100 dark:bg-white/5',
    accent: 'bg-primary-100 dark:bg-white/10',
  },
  
  // Button styles
  button: {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-white dark:bg-white/10 text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/20',
    outline: 'bg-transparent text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10',
  },
  
  // Form element styles
  form: {
    label: 'text-gray-700 dark:text-white/80',
    input: 'bg-white dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40',
    select: 'bg-white dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white',
    checkbox: 'border-gray-300 dark:border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary',
  }
};