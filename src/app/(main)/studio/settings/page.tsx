'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/providers/auth-provider';

import {
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  Mail,
  Monitor,
  Moon,
  Save,
  Settings,
  Sparkles,
  Sun,
  User,
  Volume2,
} from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [language, setLanguage] = useState('english');
  const [isSaving, setIsSaving] = useState(false);
  
  // Get initials for user avatar
  const getInitials = () => {
    if (!user?.email) return 'U';
    const parts = user.email.split('@')[0].split('.');
    return parts.map(part => part[0]?.toUpperCase() || '').join('');
  };
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/studio/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };
  
  // Handle save settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-white/60">Customize your experience and manage your preferences</p>
        </motion.div>
        
        {/* Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - App Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="md:col-span-2 space-y-6"
          >
            {/* Appearance Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <Monitor className="h-5 w-5 mr-2 text-sketchdojo-primary" />
                  Appearance
                </h3>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Theme */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-white/70 mb-3">Theme</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {darkMode ? 
                        <Moon className="h-5 w-5 text-gray-700 dark:text-white/70" /> : 
                        <Sun className="h-5 w-5 text-gray-700 dark:text-white/70" />
                      }
                      <span className="text-sm text-gray-700 dark:text-white/80">
                        {darkMode ? 'Dark Mode' : 'Light Mode'}
                      </span>
                    </div>
                    <Switch 
                      checked={darkMode} 
                      onCheckedChange={setDarkMode} 
                      className="data-[state=checked]:bg-sketchdojo-primary"
                    />
                  </div>
                </div>
                
                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Language</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Notifications & Sounds */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-sketchdojo-primary" />
                  Notifications & Sounds
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/5">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-white/80">Email Notifications</p>
                    <p className="text-xs text-gray-500 dark:text-white/40">Receive updates about your manga creations</p>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications} 
                    className="data-[state=checked]:bg-sketchdojo-primary"
                  />
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-white/80">Sound Effects</p>
                    <p className="text-xs text-gray-500 dark:text-white/40">Play sounds when actions are completed</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-4 w-4 text-gray-500 dark:text-white/40" />
                    <Switch 
                      checked={soundEffects} 
                      onCheckedChange={setSoundEffects} 
                      className="data-[state=checked]:bg-sketchdojo-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Editor Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-sketchdojo-primary" />
                  Editor Settings
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/5">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-white/80">Auto-Save</p>
                    <p className="text-xs text-gray-500 dark:text-white/40">Automatically save your work every 5 minutes</p>
                  </div>
                  <Switch 
                    checked={autoSave} 
                    onCheckedChange={setAutoSave} 
                    className="data-[state=checked]:bg-sketchdojo-primary"
                  />
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-white/80">Default Export Format</p>
                    <p className="text-xs text-gray-500 dark:text-white/40">Choose the default format for exporting your manga</p>
                  </div>
                  <Select defaultValue="png">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpg">JPG</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right Column - Account & Support */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Account Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <User className="h-5 w-5 mr-2 text-sketchdojo-primary" />
                  Account
                </h3>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800 shadow-sm">
                    <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                    <AvatarFallback className="bg-gradient-to-br from-sketchdojo-primary to-sketchdojo-accent text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {user?.email?.split('@')[0] || 'User'}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-white/50">{user?.email}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    variant="outline"
                    className="w-full justify-start border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70"
                    onClick={() => router.push('/studio/profile')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full justify-start border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Subscription */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-sketchdojo-primary" />
                  Subscription
                </h3>
              </div>
              
              <div className="p-6">
                <div className="bg-gradient-to-r from-sketchdojo-primary/5 to-sketchdojo-accent/5 border border-sketchdojo-primary/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Free Plan</h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sketchdojo-primary/10 text-sketchdojo-primary">
                      Current
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-white/60 mb-3">Basic features with limited generations</p>
                  <Button 
                    className="w-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Help & Support */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-sketchdojo-primary" />
                  Help & Support
                </h3>
              </div>
              
              <div className="p-6 space-y-3">
                <Button 
                  variant="outline"
                  className="w-full justify-start border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Documentation
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full justify-start border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-8 flex justify-end"
        >
          <Button 
            onClick={handleSaveSettings}
            className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white shadow-md hover:shadow-lg transition-all duration-300 px-6"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></span>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}