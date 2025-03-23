"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { createClient } from "@/utils/supabase/client";

export function CookieConsent() {
  const router = useRouter();
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const syncUserPreferences = async () => {
      if (!user) return;
      
      try {
        // Check if user has preferences stored in user metadata
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          throw error;
        }
        
        if (data.user && data.user.user_metadata?.cookiePreferences) {
          // User has preferences set in Supabase, sync to localStorage
          const userPrefs = data.user.user_metadata.cookiePreferences;
          
          // Check if all cookies are enabled
          const allEnabled = Object.entries(userPrefs).every(([key, value]) => 
            key === "necessary" || value === true
          );
          
          if (allEnabled) {
            localStorage.setItem("cookieConsent", "all");
          } else {
            localStorage.setItem("cookieConsent", "custom");
            localStorage.setItem("cookiePreferences", JSON.stringify(userPrefs));
          }
          
          // Banner shouldn't show since preferences are already set
          return false;
        }
        
        // If user is logged in but has no preferences in Supabase,
        // check if they have local preferences and sync those up to Supabase
        const localConsent = localStorage.getItem("cookieConsent");
        if (localConsent) {
          let cookiePrefs = {
            necessary: true,
            functional: localConsent === "all",
            analytics: localConsent === "all",
            marketing: localConsent === "all"
          };
          
          // If custom preferences, use those
          if (localConsent === "custom") {
            try {
              const savedPrefs = localStorage.getItem("cookiePreferences");
              if (savedPrefs) {
                cookiePrefs = { ...JSON.parse(savedPrefs), necessary: true };
              }
            } catch (e) {
              console.error("Error parsing saved preferences:", e);
            }
          }
          
          // Save to user metadata
          await supabase.auth.updateUser({
            data: { 
              cookiePreferences: cookiePrefs,
              cookiePreferencesUpdated: new Date().toISOString()
            }
          });
          
          // Banner shouldn't show since preferences are already set
          return false;
        }
        
        // If no preferences found anywhere, show the banner
        return true;
      } catch (error) {
        console.error("Error syncing user preferences:", error);
        // Fall back to checking local storage
        return localStorage.getItem("cookieConsent") === null;
      }
    };
    
    const checkConsent = async () => {
      let shouldShowBanner = false;
      
      if (user) {
        // For logged-in users, sync preferences
        const result = await syncUserPreferences();
        shouldShowBanner = result === true; // Ensure it's a boolean
      } else {
        // For non-logged-in users, just check localStorage
        shouldShowBanner = localStorage.getItem("cookieConsent") === null;
      }
      
      if (shouldShowBanner) {
        // Show the banner after a short delay
        const timer = setTimeout(() => {
          setShow(true);
        }, 1500);
        
        return () => clearTimeout(timer);
      }
    };
    
    checkConsent();
  }, [user, supabase]);

  const acceptAll = async () => {
    localStorage.setItem("cookieConsent", "all");
    
    // If logged in, also save to user metadata
    if (user) {
      try {
        await supabase.auth.updateUser({
          data: { 
            cookiePreferences: {
              necessary: true,
              functional: true,
              analytics: true,
              marketing: true
            },
            cookiePreferencesUpdated: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error("Error saving cookie preferences to user account:", error);
      }
    }
    
    setShow(false);
  };

  const acceptNecessary = async () => {
    localStorage.setItem("cookieConsent", "necessary");
    
    // If logged in, also save to user metadata
    if (user) {
      try {
        await supabase.auth.updateUser({
          data: { 
            cookiePreferences: {
              necessary: true,
              functional: false,
              analytics: false,
              marketing: false
            },
            cookiePreferencesUpdated: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error("Error saving cookie preferences to user account:", error);
      }
    }
    
    setShow(false);
  };

  const openPreferences = () => {
    // Navigate to the cookie preferences page
    router.push("/site/legal/cookie-preferences");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Animated focus ring */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 pointer-events-none flex items-end justify-center p-4"
          >
            <div className="w-full max-w-7xl h-[calc(100%-2rem)] border-2 border-sketchdojo-primary rounded-lg animate-pulse" />
          </motion.div>
          
          {/* Cookie banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-black/95 backdrop-blur-md border-t border-white/10"
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                <div className="lg:col-span-8">
                  <h3 className="text-white text-lg font-medium mb-2">We use cookies</h3>
                  <p className="text-white/70 text-sm">
                    We use cookies to personalize content, provide social media features, and analyze our traffic. 
                    We also share information about your use of our site with our social media and analytics partners.
                    You can manage your preferences by clicking "Cookie Settings".
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
                <div className="lg:col-span-4 flex flex-wrap gap-2 justify-start lg:justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openPreferences}
                    className="text-white border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    Cookie Settings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={acceptNecessary}
                    className="text-white border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    Necessary Only
                  </Button>
                  <Button
                    size="sm"
                    onClick={acceptAll}
                    className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:opacity-90 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Accept All</span>
                    <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 