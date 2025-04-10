// Type definitions for cookie preferences

/**
 * Interface for cookie preferences structure
 * Used across cookie consent components and pages
 */
export interface CookiePreferences {
  necessary: boolean; // Always true, essential cookies
  functional: boolean; // Personalization features
  analytics: boolean;  // Analytics/tracking cookies
  marketing: boolean;  // Advertising cookies
  [key: string]: boolean; // Allow for additional cookie types
}

/**
 * Cookie consent types
 */
export type CookieConsentType = 'all' | 'necessary' | 'custom';

/**
 * Interface for cookie consent update parameters
 * Used when updating Google Analytics consent settings
 */
export interface CookieConsentUpdateParams {
  analytics_storage: 'granted' | 'denied';
  functionality_storage: 'granted' | 'denied';
  personalization_storage: 'granted' | 'denied';
  ad_storage: 'granted' | 'denied';
  [key: string]: string;
}