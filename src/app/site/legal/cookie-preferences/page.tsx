"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/providers/auth-provider";
import { CookiePreferences, CookieConsentUpdateParams } from "@/types/cookie-preferences";

export default function CookiePreferencesPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always enabled
    functional: false,
    analytics: false,
    marketing: false
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Mark that the user has visited the preferences page
    localStorage.setItem("visitedCookiePreferences", "true");
    
    // Load saved preferences from localStorage
    const loadLocalPreferences = () => {
      const savedConsent = localStorage.getItem("cookieConsent");
      const savedPreferences = localStorage.getItem("cookiePreferences");
      
      if (savedConsent === "all") {
        setPreferences({
          necessary: true,
          functional: true,
          analytics: true,
          marketing: true
        });
      } else if (savedConsent === "custom" && savedPreferences) {
        try {
          const parsedPreferences = JSON.parse(savedPreferences);
          setPreferences({
            ...parsedPreferences,
            necessary: true // Always ensure necessary is true
          });
        } catch (error) {
          console.error("Error parsing saved preferences:", error);
        }
      }
    };
    
    // Load saved preferences from Supabase for logged-in users
    const loadUserPreferences = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          throw error;
        }
        
        if (data.user && data.user.user_metadata?.cookiePreferences) {
          setPreferences({
            ...data.user.user_metadata.cookiePreferences,
            necessary: true // Always ensure necessary is true
          });
        } else {
          // Fall back to local preferences if no user preferences found
          loadLocalPreferences();
        }
      } catch (error) {
        console.error("Error loading user preferences:", error);
        // Fall back to local preferences
        loadLocalPreferences();
      }
    };
    
    if (user) {
      loadUserPreferences();
    } else {
      loadLocalPreferences();
    }
  }, [user, supabase]);

  const handleToggle = (type: keyof typeof preferences) => {
    if (type === "necessary") return; // Can't toggle necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const savePreferences = async () => {
    try {
      setIsSaving(true);
      
      // Ensure necessary cookies are always enabled
      const securePreferences = {
        ...preferences,
        necessary: true // Always ensure necessary is true
      };
      
      const allEnabled = Object.entries(securePreferences).every(([key, value]) => 
        key === "necessary" || value === true
      );

      // Save to localStorage with try-catch for security
      try {
        if (allEnabled) {
          localStorage.setItem("cookieConsent", "all");
        } else {
          localStorage.setItem("cookieConsent", "custom");
          localStorage.setItem("cookiePreferences", JSON.stringify(securePreferences));
        }
        
        // Set a secure cookie with HttpOnly and SameSite attributes (handled server-side)
        // This is just a client-side marker that the server-side cookie was set
        document.cookie = "cookieConsentSet=true; path=/; max-age=31536000; SameSite=Lax";
      } catch (storageError) {
        console.error("Error accessing localStorage:", storageError);
        // Continue execution even if localStorage fails
      }
      
      // Apply consent settings to tracking services
      if (typeof window !== 'undefined' && window.gtag) {
        const consentParams: CookieConsentUpdateParams = {
          'analytics_storage': securePreferences.analytics ? 'granted' : 'denied',
          'functionality_storage': securePreferences.functional ? 'granted' : 'denied',
          'personalization_storage': securePreferences.functional ? 'granted' : 'denied',
          'ad_storage': securePreferences.marketing ? 'granted' : 'denied'
        };
        window.gtag('consent', 'update', consentParams);
      }
      
      // Remove non-essential cookies if they're disabled
      if (!allEnabled) {
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
          
          // Skip functional cookies if enabled
          if (securePreferences.functional && 
              (name === "user_preferences" || name.startsWith("functional_"))) {
            continue;
          }
          
          // Skip analytics cookies if enabled
          if (securePreferences.analytics && 
              (name === "_ga" || name === "_gid" || name === "_gat" || name.startsWith("analytics_"))) {
            continue;
          }
          
          // Skip marketing cookies if enabled
          if (securePreferences.marketing && name.startsWith("marketing_")) {
            continue;
          }
          
          // Remove disabled cookies
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
        }
      }
      
      // Save to user metadata if logged in with enhanced security
      if (user) {
        const { error } = await supabase.auth.updateUser({
          data: { 
            cookiePreferences: securePreferences,
            cookiePreferencesUpdated: new Date().toISOString(),
            cookiePreferencesIP: "redacted" // Don't store actual IP, just a marker that consent was given
          }
        });
        
        if (error) {
          throw error;
        }
      }

      // Show confirmation message with a more professional approach
      // Replace alert with a more modern notification approach
      const successMessage = document.createElement("div");
      successMessage.className = "fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50";
      successMessage.innerHTML = `
        <div class="flex items-center">
          <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span>Your cookie preferences have been saved successfully.</span>
        </div>
      `;
      document.body.appendChild(successMessage);
      
      // Remove the message after 3 seconds
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 3000);
      
    } catch (error) {
      console.error("Error saving preferences:", error);
      
      // Show error message with a more professional approach
      const errorMessage = document.createElement("div");
      errorMessage.className = "fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50";
      errorMessage.innerHTML = `
        <div class="flex items-center">
          <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <span>There was an error saving your preferences. Please try again.</span>
        </div>
      `;
      document.body.appendChild(errorMessage);
      
      // Remove the message after 3 seconds
      setTimeout(() => {
        if (document.body.contains(errorMessage)) {
          document.body.removeChild(errorMessage);
        }
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const cookieTypes = [
    {
      id: "necessary",
      name: "Necessary Cookies",
      description: "These cookies are essential for the website to function properly and cannot be disabled."
    },
    {
      id: "functional",
      name: "Functional Cookies",
      description: "These cookies enable personalized features and functionality."
    },
    {
      id: "analytics",
      name: "Analytics Cookies",
      description: "These cookies help us understand how visitors interact with our website."
    },
    {
      id: "marketing",
      name: "Marketing Cookies",
      description: "These cookies are used to track visitors across websites for advertising purposes."
    }
  ];

  return (
    <>
      <h1>Cookie Preferences</h1>
      <p className="lead">Manage your cookie settings</p>
      
      <div className="mb-6">
        <Link href="/site/legal/cookies" className="text-sketchdojo-primary hover:underline inline-flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Cookie Policy</span>
        </Link>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Manage Cookie Preferences</h2>
          <p className="text-muted-foreground">
            You can choose which cookies you want to allow. You can change these settings at any time, 
            although this might affect the functionality of the website.
          </p>
          {user && (
            <div className="mt-2 text-sm text-primary">
              You are logged in. Your preferences will be saved to your account and applied across all devices.
            </div>
          )}
        </div>

        <div className="space-y-6">
          {cookieTypes.map((cookie) => (
            <div key={cookie.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{cookie.name}</h3>
                  <p className="text-sm text-muted-foreground">{cookie.description}</p>
                </div>
                <Switch 
                  checked={preferences[cookie.id as keyof typeof preferences]}
                  onCheckedChange={() => handleToggle(cookie.id as keyof typeof preferences)}
                  disabled={cookie.id === "necessary"}
                  className="data-[state=checked]:bg-sketchdojo-primary"
                />
              </div>
              <Separator />
            </div>
          ))}
        </div>

        <div className="pt-4 flex justify-end">
          <Button 
            onClick={savePreferences}
            disabled={isSaving}
            className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:opacity-90"
          >
            {isSaving ? (
              <>
                <span className="mr-2">Saving...</span>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </>
            ) : "Save Preferences"}
          </Button>
        </div>
      </div>
    </>
  );
}