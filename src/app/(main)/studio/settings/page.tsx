"use client";

import { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useTheme } from 'next-themes';

// UI Components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Settings, 
  Moon, 
  Sun, 
  Monitor, 
  Bell, 
  Eye, 
  EyeOff, 
  Shield, 
  Share2, 
  Save, 
  Lock, 
  Zap, 
  FileBox, 
  Smartphone, 
  Palette, 
  Sliders, 
  Check,
  Mail,
  BellRing,
  BellOff,
  Loader2,
  Globe,
  Languages,
  BookOpenCheck,
  Info,
  MessageSquareText,
  Megaphone,
  RefreshCw,
  Database,
  Cookie
} from "lucide-react";
import ProtectedRoute from '@/components/global/protected-route';

// Settings form schema
const settingsFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Please select a theme",
  }),
  animationsEnabled: z.boolean().default(true),
  highQualityPreviews: z.boolean().default(true),
  autoSave: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  pushNotifications: z.boolean().default(true),
  soundEffects: z.boolean().default(true),
  language: z.string().default("en"),
  dataCollection: z.boolean().default(true),
  saveHistory: z.boolean().default(true),
  imageQuality: z.number().min(1).max(3).default(2),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isUpdating, setIsUpdating] = useState(false);
  const supabase = createClient();

  // Default values for the form
  const defaultValues: Partial<SettingsFormValues> = {
    theme: (theme as "light" | "dark" | "system") || "system",
    animationsEnabled: true,
    highQualityPreviews: true,
    autoSave: true,
    emailNotifications: true,
    marketingEmails: false,
    pushNotifications: true,
    soundEffects: true,
    language: "en",
    dataCollection: true,
    saveHistory: true,
    imageQuality: 2,
  };
  
  // Initialize settings form
  const settingsForm = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  });

  // Handle settings update
  async function onSubmitSettings(data: SettingsFormValues) {
    try {
      setIsUpdating(true);
      
      // Set the theme
      setTheme(data.theme);
      
      // Save settings to user metadata
      if (user) {
        const { error } = await supabase.auth.updateUser({
          data: { 
            settings: {
              ...data,
              lastUpdated: new Date().toISOString(),
            }
          }
        });
        
        if (error) {
          throw error;
        }
      }
      
      // Show success message
      toast.success("Settings updated successfully", {
        description: "Your preferences have been saved.",
        icon: <Check className="h-5 w-5 text-green-500" />,
      });
      
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast.error("Failed to update settings", {
        description: "Please try again later or contact support.",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  // Image quality slider values
  const qualityOptions = [
    { value: 1, label: "Standard", description: "Faster load times, lower data usage" },
    { value: 2, label: "High", description: "Balance of quality and performance" },
    { value: 3, label: "Ultra", description: "Maximum quality, higher data usage" },
  ];

  // Get the current quality option label
  const currentQuality = qualityOptions.find(
    option => option.value === settingsForm.watch("imageQuality")
  )?.label || "High";

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-sketchdojo-bg to-sketchdojo-bg-light">
        {/* Background effects */}
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-sketchdojo-primary rounded-full filter blur-[100px] opacity-10"></div>
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-sketchdojo-accent rounded-full filter blur-[120px] opacity-10"></div>
        
        <div className="container max-w-5xl py-10 px-4 sm:px-6">
          {/* Page Header */}
          <div className="flex flex-col mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="h-7 w-7 text-sketchdojo-primary" />
              <h1 className="text-3xl font-bold">Settings</h1>
            </div>
            <p className="text-muted-foreground">
              Customize your SketchDojo experience and manage your preferences
            </p>
          </div>

          {/* Main Content */}
          <Form {...settingsForm}>
            <form onSubmit={settingsForm.handleSubmit(onSubmitSettings)} className="space-y-8">
              <Tabs defaultValue="appearance" className="w-full">
                <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-6">
                  <TabsTrigger value="appearance" className="flex gap-2 items-center">
                    <Palette className="h-4 w-4" />
                    <span className="hidden sm:inline">Appearance</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex gap-2 items-center">
                    <Bell className="h-4 w-4" />
                    <span className="hidden sm:inline">Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="flex gap-2 items-center">
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Privacy</span>
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="flex gap-2 items-center">
                    <Zap className="h-4 w-4" />
                    <span className="hidden sm:inline">Performance</span>
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="flex gap-2 items-center">
                    <Sliders className="h-4 w-4" />
                    <span className="hidden sm:inline">Advanced</span>
                  </TabsTrigger>
                </TabsList>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-sketchdojo-primary" />
                        Theme & Display
                      </CardTitle>
                      <CardDescription>
                        Customize how SketchDojo looks and feels
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={settingsForm.control}
                        name="theme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Theme</FormLabel>
                            <div className="flex flex-col space-y-1.5">
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a theme" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="light" className="flex items-center">
                                    <div className="flex items-center gap-2">
                                      <Sun className="h-4 w-4" />
                                      <span>Light</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="dark">
                                    <div className="flex items-center gap-2">
                                      <Moon className="h-4 w-4" />
                                      <span>Dark</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="system">
                                    <div className="flex items-center gap-2">
                                      <Monitor className="h-4 w-4" />
                                      <span>System</span>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <FormDescription>
                              Choose between light, dark, or system-matched theme
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <FormField
                        control={settingsForm.control}
                        name="animationsEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel>Interface Animations</FormLabel>
                              <FormDescription>
                                Enable smooth transitions and animations throughout the app
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={settingsForm.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <div className="flex flex-col space-y-1.5">
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a language" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="en">
                                    <div className="flex items-center gap-2">
                                      <Globe className="h-4 w-4" />
                                      <span>English</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="fr">
                                    <div className="flex items-center gap-2">
                                      <Globe className="h-4 w-4" />
                                      <span>Français</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="es">
                                    <div className="flex items-center gap-2">
                                      <Globe className="h-4 w-4" />
                                      <span>Español</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="de">
                                    <div className="flex items-center gap-2">
                                      <Globe className="h-4 w-4" />
                                      <span>Deutsch</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="ja">
                                    <div className="flex items-center gap-2">
                                      <Globe className="h-4 w-4" />
                                      <span>日本語</span>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <FormDescription>
                              Choose your preferred language for the interface
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-sketchdojo-primary" />
                        Notifications & Alerts
                      </CardTitle>
                      <CardDescription>
                        Manage how SketchDojo communicates with you
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={settingsForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email Notifications
                              </FormLabel>
                              <FormDescription>
                                Receive important updates, completed generations, and project reminders via email
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <FormField
                        control={settingsForm.control}
                        name="pushNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="flex items-center gap-2">
                                <BellRing className="h-4 w-4" />
                                Push Notifications
                              </FormLabel>
                              <FormDescription>
                                Receive real-time alerts and updates in your browser or device
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <FormField
                        control={settingsForm.control}
                        name="soundEffects"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="flex items-center gap-2">
                                <Megaphone className="h-4 w-4" />
                                Sound Effects
                              </FormLabel>
                              <FormDescription>
                                Play audio cues for notifications and important events
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <FormField
                        control={settingsForm.control}
                        name="marketingEmails"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="flex items-center gap-2">
                                <Info className="h-4 w-4" />
                                Marketing Communications
                              </FormLabel>
                              <FormDescription>
                                Receive updates about new features, tips, and special offers
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Privacy Tab */}
                <TabsContent value="privacy" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-sketchdojo-primary" />
                        Privacy & Security
                      </CardTitle>
                      <CardDescription>
                        Manage how your data is used and protected
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-1.5">
                        <h3 className="text-base font-medium">Cookie Preferences</h3>
                        <p className="text-sm text-muted-foreground">
                          Choose which types of cookies we can use to improve your experience
                        </p>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open('/site/legal/cookie-preferences', '_blank')}
                          className="flex items-center gap-1.5"
                        >
                          <Cookie className="h-4 w-4" />
                          Manage Cookie Settings
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <FormField
                        control={settingsForm.control}
                        name="dataCollection"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="flex items-center gap-2">
                                <Database className="h-4 w-4" />
                                Usage Data Collection
                              </FormLabel>
                              <FormDescription>
                                Allow us to collect anonymous usage data to improve the application
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <Separator />
                      
                      <FormField
                        control={settingsForm.control}
                        name="saveHistory"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="flex items-center gap-2">
                                <FileBox className="h-4 w-4" />
                                Save Activity History
                              </FormLabel>
                              <FormDescription>
                                Save your activity history for improved recommendations
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-sketchdojo-primary" />
                        Performance & Quality
                      </CardTitle>
                      <CardDescription>
                        Adjust settings that affect app speed and resource usage
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={settingsForm.control}
                        name="imageQuality"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between mb-2">
                              <FormLabel>Image Quality: <span className="font-medium text-sketchdojo-primary">{currentQuality}</span></FormLabel>
                            </div>
                            <FormControl>
                              <Slider
                                min={1}
                                max={3}
                                step={1}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                                className="w-full"
                              />
                            </FormControl>
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                              <span>Standard</span>
                              <span>High</span>
                              <span>Ultra</span>
                            </div>
                            <FormDescription className="mt-3">
                              {qualityOptions.find(option => option.value === field.value)?.description}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <FormField
                        control={settingsForm.control}
                        name="highQualityPreviews"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                High Quality Previews
                              </FormLabel>
                              <FormDescription>
                                Show high-resolution previews when browsing your creations and projects
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Advanced Tab */}
                <TabsContent value="advanced" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sliders className="h-5 w-5 text-sketchdojo-primary" />
                        Advanced Options
                      </CardTitle>
                      <CardDescription>
                        Additional settings for power users
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={settingsForm.control}
                        name="autoSave"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                Auto Save
                              </FormLabel>
                              <FormDescription>
                                Automatically save your work while editing projects
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-medium">Data Management</h3>
                        <div className="flex flex-col md:flex-row gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <FileBox className="h-4 w-4" />
                            Export Settings
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Reset to Defaults
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Submit Button */}
              <div className="sticky bottom-0 pb-8 pt-2 bg-gradient-to-t from-sketchdojo-bg to-transparent z-10">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:opacity-90 transition-opacity"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving Settings...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Settings
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
