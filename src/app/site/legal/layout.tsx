import React from 'react';
import { ThemeProvider } from '@/providers/theme-provider';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SketchDojo | Legal',
  description: 'Terms of Service, Privacy Policy, and other legal information for SketchDojo',
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-12 px-4 sm:px-6">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col gap-2 sticky top-8">
              <h4 className="font-semibold mb-2">Legal Documents</h4>
              <Link 
                href="/site/legal/terms" 
                className="text-sm py-2 border-l-2 border-transparent hover:border-primary hover:text-primary pl-3 transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                href="/site/legal/privacy" 
                className="text-sm py-2 border-l-2 border-transparent hover:border-primary hover:text-primary pl-3 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/site/legal/cookies" 
                className="text-sm py-2 border-l-2 border-transparent hover:border-primary hover:text-primary pl-3 transition-colors"
              >
                Cookie Policy
              </Link>
              <Link 
                href="/site/legal/gdpr" 
                className="text-sm py-2 border-l-2 border-transparent hover:border-primary hover:text-primary pl-3 transition-colors"
              >
                GDPR Compliance
              </Link>
              <Link 
                href="/site/legal/cookie-preferences" 
                className="text-sm py-2 border-l-2 border-transparent hover:border-primary hover:text-primary pl-3 transition-colors"
              >
                Cookie Preferences
              </Link>
            </nav>
          </div>
          
          <div className="flex-1 prose prose-sm md:prose-base dark:prose-invert max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 