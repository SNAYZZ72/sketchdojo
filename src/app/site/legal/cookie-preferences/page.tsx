"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/providers/auth-provider";

export default function CookiePreferencesPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [preferences, setPreferences] = useState({
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
      
      const allEnabled = Object.entries(preferences).every(([key, value]) => 
        key === "necessary" || value === true
      );

      // Save to localStorage
      if (allEnabled) {
        localStorage.setItem("cookieConsent", "all");
      } else {
        localStorage.setItem("cookieConsent", "custom");
        localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
      }
      
      // Save to user metadata if logged in
      if (user) {
        const { error } = await supabase.auth.updateUser({
          data: { 
            cookiePreferences: preferences,
            cookiePreferencesUpdated: new Date().toISOString()
          }
        });
        
        if (error) {
          throw error;
        }
      }

      // Show confirmation message
      alert("Your cookie preferences have been saved");
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("There was an error saving your preferences. Please try again.");
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