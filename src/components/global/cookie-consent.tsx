"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { createClient } from "@/utils/supabase/client";
import { CookiePreferences, CookieConsentUpdateParams } from "@/types/cookie-preferences";

export function CookieConsent() {
  const router = useRouter();
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Function to validate and sanitize cookie preferences
    const validatePreferences = (prefs: Partial<CookiePreferences>): CookiePreferences => {
      // Ensure necessary cookies are always enabled
      const validatedPrefs = { ...prefs, necessary: true } as CookiePreferences;
      
      // Ensure all expected properties exist with boolean values
      const expectedKeys = ['necessary', 'functional', 'analytics', 'marketing'];
      expectedKeys.forEach(key => {
        if (typeof validatedPrefs[key as keyof CookiePreferences] !== 'boolean') {
          validatedPrefs[key as keyof CookiePreferences] = key === 'necessary' ? true : false;
        }
      });
      
      return validatedPrefs;
    };
    
    // Function to apply consent to tracking services
    const applyConsentToServices = (prefs: CookiePreferences): void => {
      if (typeof window !== 'undefined' && window.gtag) {
        const consentParams: CookieConsentUpdateParams = {
          'analytics_storage': prefs.analytics ? 'granted' : 'denied',
          'functionality_storage': prefs.functional ? 'granted' : 'denied',
          'personalization_storage': prefs.functional ? 'granted' : 'denied',
          'ad_storage': prefs.marketing ? 'granted' : 'denied'
        };
        window.gtag('consent', 'update', consentParams);
      }
    };
    
    const syncUserPreferences = async () => {
      if (!user) return;
      
      try {
        // Check if user has preferences stored in user metadata with proper error handling
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          throw error;
        }
        
        if (data.user && data.user.user_metadata?.cookiePreferences) {
          // User has preferences set in Supabase, validate and sync to localStorage
          const userPrefs = validatePreferences(data.user.user_metadata.cookiePreferences);
          
          // Check if all cookies are enabled
          const allEnabled = Object.entries(userPrefs).every(([key, value]) => 
            key === "necessary" || value === true
          );
          
          // Set localStorage with secure values
          if (allEnabled) {
            localStorage.setItem("cookieConsent", "all");
          } else {
            localStorage.setItem("cookieConsent", "custom");
            localStorage.setItem("cookiePreferences", JSON.stringify(userPrefs));
          }
          
          // Apply consent settings to services
          applyConsentToServices(userPrefs);
          
          // Banner shouldn't show since preferences are already set
          return false;
        }
        
        // If user is logged in but has no preferences in Supabase,
        // check if they have local preferences and sync those up to Supabase
        const localConsent = localStorage.getItem("cookieConsent");
        if (localConsent) {
          let cookiePrefs: CookiePreferences = {
            necessary: true,
            functional: localConsent === "all",
            analytics: localConsent === "all",
            marketing: localConsent === "all"
          };
          
          // If custom preferences, use those with proper validation
          if (localConsent === "custom") {
            try {
              const savedPrefs = localStorage.getItem("cookiePreferences");
              if (savedPrefs) {
                const parsedPrefs = JSON.parse(savedPrefs);
                cookiePrefs = validatePreferences(parsedPrefs);
              }
            } catch (e) {
              console.error("Error parsing saved preferences:", e);
              // Continue with default preferences if parsing fails
            }
          }
          
          // Save to user metadata with security enhancements
          const { error: updateError } = await supabase.auth.updateUser({
            data: { 
              cookiePreferences: cookiePrefs,
              cookiePreferencesUpdated: new Date().toISOString(),
              cookiePreferencesIP: "redacted" // Don't store actual IP
            }
          });
          
          if (updateError) {
            console.error("Error updating user preferences:", updateError);
          } else {
            // Apply consent settings to services
            applyConsentToServices(cookiePrefs);
          }
          
          // Banner shouldn't show since preferences are already set
          return false;
        }
        
        // If no preferences found anywhere, show the banner
        return true;
      } catch (error) {
        console.error("Error syncing user preferences:", error);
        // Fall back to checking local storage with additional security check
        try {
          return localStorage.getItem("cookieConsent") === null;
        } catch (storageError) {
          console.error("Error accessing localStorage:", storageError);
          return true; // Show banner if localStorage access fails
        }
      }
    };
    
    const checkConsent = async () => {
      try {
        let shouldShowBanner = false;
        
        if (user) {
          // For logged-in users, sync preferences
          const result = await syncUserPreferences();
          shouldShowBanner = result === true; // Ensure it's a boolean
        } else {
          // For non-logged-in users, check localStorage with error handling
          try {
            shouldShowBanner = localStorage.getItem("cookieConsent") === null;
          } catch (storageError) {
            console.error("Error accessing localStorage:", storageError);
            shouldShowBanner = true; // Show banner if localStorage access fails
          }
        }
        
        if (shouldShowBanner) {
          // Show the banner after a short delay
          const timer = setTimeout(() => {
            setShow(true);
          }, 1500);
          
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Error checking consent:", error);
        // Show banner in case of error to ensure compliance
        setShow(true);
      }
    };
    
    checkConsent();
  }, [user, supabase]);

  const acceptAll = async () => {
    try {
      // Set secure flag for localStorage
      localStorage.setItem("cookieConsent", "all");
      
      // Set a secure cookie with HttpOnly and SameSite attributes (handled server-side)
      // This is just a client-side marker that the server-side cookie was set
      document.cookie = "cookieConsentSet=true; path=/; max-age=31536000; SameSite=Lax";
      
      // If logged in, also save to user metadata with additional security measures
      if (user) {
        const { error } = await supabase.auth.updateUser({
          data: { 
            cookiePreferences: {
              necessary: true,
              functional: true,
              analytics: true,
              marketing: true
            },
            cookiePreferencesUpdated: new Date().toISOString(),
            cookiePreferencesIP: "redacted" // Don't store actual IP, just a marker that consent was given
          }
        });
        
        if (error) throw error;
      }
      
      // Trigger any analytics or tracking that requires consent
      if (typeof window !== 'undefined' && window.gtag) {
        const consentParams: CookieConsentUpdateParams = {
          'analytics_storage': 'granted',
          'functionality_storage': 'granted',
          'personalization_storage': 'granted',
          'ad_storage': 'granted'
        };
        window.gtag('consent', 'update', consentParams);
      }
    } catch (error) {
      console.error("Error saving cookie preferences:", error);
      // Still hide the banner but log the error
    } finally {
      setShow(false);
    }
  };

  const acceptNecessary = async () => {
    try {
      // Set secure flag for localStorage
      localStorage.setItem("cookieConsent", "necessary");
      
      // Set a secure cookie with HttpOnly and SameSite attributes (handled server-side)
      // This is just a client-side marker that the server-side cookie was set
      document.cookie = "cookieConsentSet=true; path=/; max-age=31536000; SameSite=Lax";
      
      // If logged in, also save to user metadata with additional security measures
      if (user) {
        const { error } = await supabase.auth.updateUser({
          data: { 
            cookiePreferences: {
              necessary: true,
              functional: false,
              analytics: false,
              marketing: false
            },
            cookiePreferencesUpdated: new Date().toISOString(),
            cookiePreferencesIP: "redacted" // Don't store actual IP, just a marker that consent was given
          }
        });
        
        if (error) throw error;
      }
      
      // Explicitly deny consent for non-necessary cookies
      if (typeof window !== 'undefined' && window.gtag) {
        const consentParams: CookieConsentUpdateParams = {
          'analytics_storage': 'denied',
          'functionality_storage': 'denied',
          'personalization_storage': 'denied',
          'ad_storage': 'denied'
        };
        window.gtag('consent', 'update', consentParams);
      }
      
      // Remove any non-essential cookies that might already exist
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        
        // Skip essential cookies
        if (name === "sketchdojo_session" || name === "sketchdojo_auth" || 
            name === "cookieConsent" || name === "cookieConsentSet") {
          continue;
        }
        
        // Remove non-essential cookies
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
      }
    } catch (error) {
      console.error("Error saving cookie preferences:", error);
      // Still hide the banner but log the error
    } finally {
      setShow(false);
    }
  };

  const openPreferences = () => {
    // Navigate to the cookie preferences page
    router.push("/site/legal/cookie-preferences");
    setShow(false);
  };

  return (
    <>
      {show && (
        <div id="cookie-consent-container" className="fixed bottom-0 left-0 right-0 z-[100000]" style={{ position: 'fixed' }}>
          <div className="mx-auto p-4 max-w-7xl">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="bg-black/95 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 md:p-6">
                <div className="lg:col-span-8">
                  <h3 className="text-white text-lg font-medium mb-2">We use cookies</h3>
                  <p className="text-white/70 text-sm">
                    We use cookies to personalize content, provide social media features, and analyze our traffic. 
                    We also share information about your use of our site with our social media and analytics partners.
                    You can manage your preferences by clicking &quot;Cookie Settings&quot;.
                  </p>
                  <div className="mt-2">
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-xs text-sketchdojo-primary hover:underline"
                      onClick={() => router.push("/site/legal/cookies")}
                    >
                      Learn more about our Cookie Policy
                    </Button>
                  </div>
                </div>
                <div className="lg:col-span-4 flex flex-wrap gap-2 mt-4 lg:mt-0 justify-center lg:justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openPreferences}
                    className="text-white border-white/20 hover:bg-white/10 hover:text-white min-w-[120px]"
                  >
                    Cookie Settings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={acceptNecessary}
                    className="text-white border-white/20 hover:bg-white/10 hover:text-white min-w-[120px]"
                  >
                    Necessary Only
                  </Button>
                  <Button
                    size="sm"
                    onClick={acceptAll}
                    className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:opacity-90 relative overflow-hidden group min-w-[120px]"
                  >
                    <span className="relative z-10">Accept All</span>
                    <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
}