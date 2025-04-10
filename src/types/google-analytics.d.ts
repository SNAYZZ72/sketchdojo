// Type definitions for Google Analytics gtag.js

interface GtagConsentParams {
  'analytics_storage'?: 'granted' | 'denied';
  'functionality_storage'?: 'granted' | 'denied';
  'personalization_storage'?: 'granted' | 'denied';
  'ad_storage'?: 'granted' | 'denied';
  [key: string]: string | undefined;
}

interface Gtag {
  (command: 'consent', action: 'update', params: GtagConsentParams): void;
  (command: 'config', targetId: string, config?: Record<string, any>): void;
  (command: 'event', eventName: string, eventParams?: Record<string, any>): void;
  (command: string, ...args: any[]): void;
}

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: Gtag;
  }
}

export {}; // This export statement is needed to make this file a module