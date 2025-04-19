'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion} from 'framer-motion';
import { 
  User, 
  LogOut, 
  Edit, 
  Camera, 
  Save,
  ChevronRight,
  Shield,
  CreditCard,
  Bell,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.email?.split('@')[0] || 'User');
  const [emailNotifications, setEmailNotifications] = useState(true);
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
  
  // Handle save profile
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
          <p className="text-gray-600 dark:text-white/60">Manage your account settings and preferences</p>
        </motion.div>
        
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-white/10 overflow-hidden mb-6"
        >
          {/* Profile Header with Background */}
          <div className="relative h-32 sm:h-40 bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/30 to-transparent"></div>
            
            {/* Camera icon for changing background */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full h-8 w-8"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Change cover image</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Avatar - positioned to overflow the header */}
            <div className="absolute -bottom-12 left-6 sm:left-8">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-md">
                  <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                  <AvatarFallback className="bg-gradient-to-br from-sketchdojo-primary to-sketchdojo-accent text-white text-xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Camera icon overlay for avatar */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-white/70 rounded-full h-8 w-8 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="pt-14 pb-6 px-6 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                {isEditing ? (
                  <Input 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="font-semibold text-lg sm:text-xl max-w-[250px]"
                  />
                ) : (
                  <h2 className="font-semibold text-lg sm:text-xl text-gray-900 dark:text-white">
                    {displayName}
                  </h2>
                )}
                <p className="text-gray-500 dark:text-white/50 text-sm mt-1">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-sketchdojo-primary/10 to-sketchdojo-accent/10 text-sketchdojo-primary border border-sketchdojo-primary/20">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Free Plan
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                {isEditing ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      className="text-gray-600 dark:text-white/70 border-gray-200 dark:border-white/10"
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveProfile}
                      className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white shadow-md hover:shadow-lg transition-all duration-300"
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
                          Save Changes
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-white/80 border border-gray-200 dark:border-white/10"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Account Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="md:col-span-2 space-y-6"
          >
            {/* Account Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <User className="h-5 w-5 mr-2 text-sketchdojo-primary" />
                  Account Settings
                </h3>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Email Address</label>
                  <Input 
                    value={user?.email || ''} 
                    disabled 
                    className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-white/50"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-white/40">Your email address is used for login and notifications</p>
                </div>
                
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Password</label>
                  <div className="flex items-center gap-3">
                    <Input 
                      type="password" 
                      value="••••••••••••" 
                      disabled 
                      className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-white/50"
                    />
                    <Button 
                      variant="outline"
                      className="shrink-0 border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70"
                      onClick={() => router.push('/studio/reset-password')}
                    >
                      Change
                    </Button>
                  </div>
                </div>
                
                {/* Notifications */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-white/70 mb-3">Notification Preferences</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-700 dark:text-white/80">Email Notifications</p>
                        <p className="text-xs text-gray-500 dark:text-white/40">Receive updates about your manga creations</p>
                      </div>
                      <Switch 
                        checked={emailNotifications} 
                        onCheckedChange={setEmailNotifications} 
                        className="data-[state=checked]:bg-sketchdojo-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Privacy & Security */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-sketchdojo-primary" />
                  Privacy & Security
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/5">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-white/80">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500 dark:text-white/40">Add an extra layer of security to your account</p>
                  </div>
                  <Button 
                    variant="outline"
                    className="border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70"
                  >
                    Setup
                  </Button>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/5">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-white/80">Data Privacy</p>
                    <p className="text-xs text-gray-500 dark:text-white/40">Manage how your data is used and stored</p>
                  </div>
                  <Button 
                    variant="ghost"
                    className="text-gray-700 dark:text-white/70"
                    onClick={() => router.push('/site/legal/privacy')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-white/80">Delete Account</p>
                    <p className="text-xs text-gray-500 dark:text-white/40">Permanently delete your account and all data</p>
                  </div>
                  <Button 
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/10"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right Column - Subscription & Support */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="space-y-6"
          >
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
                
                <div className="text-xs text-gray-500 dark:text-white/40">
                  <p>Your free plan includes:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>10 manga generations per day</li>
                    <li>Basic editing tools</li>
                    <li>Standard resolution outputs</li>
                  </ul>
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
                  <Bell className="h-4 w-4 mr-2" />
                  Documentation
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full justify-start border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Contact Support
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}