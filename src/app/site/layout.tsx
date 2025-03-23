"use client";

import React, { useState, useEffect } from 'react'
import { ThemeProvider } from '@/providers/theme-provider'
import { CookieConsent } from '@/components/global/cookie-consent'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { AuthProvider } from '@/providers/auth-provider'

const PrivacyAlertBanner = () => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Only show if they've accepted cookies but haven't visited preferences page
    const hasConsent = localStorage.getItem("cookieConsent");
    const hasVisitedPreferences = localStorage.getItem("visitedCookiePreferences");
    
    if (hasConsent && !hasVisitedPreferences) {
      // Show the alert after a delay
      const timer = setTimeout(() => {
        setShowAlert(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissAlert = () => {
    setShowAlert(false);
    // Remember that they dismissed the alert
    localStorage.setItem("visitedCookiePreferences", "true");
  };

  if (!showAlert) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md bg-background border shadow-lg rounded-lg p-4 animate-in fade-in zoom-in duration-300">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium">Customize your privacy settings</h4>
          <p className="text-sm text-muted-foreground mt-1">
            You've accepted cookies, but you can still customize which types of cookies we use.
          </p>
          <div className="flex gap-3 mt-3">
            <Link 
              href="/site/legal/cookie-preferences"
              className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-2.5 py-1.5"
            >
              Manage Settings
            </Link>
            <button 
              onClick={dismissAlert}
              className="text-xs bg-muted hover:bg-muted/90 text-muted-foreground rounded-md px-2.5 py-1.5"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <AuthProvider>
        <main className="h-full">
          {children}
          <CookieConsent />
          <PrivacyAlertBanner />
        </main>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default layout
