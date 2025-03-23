"use client";

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Shield, 
  User, 
  LogOut, 
  Check, 
  Key, 
  AlertTriangle,
  Edit,
  UserCircle,
  Mail,
  Calendar,
  Clock,
  Lock,
  CreditCard,
  Bell,
  Settings,
  HelpCircle,
  ChevronRight,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import ProtectedRoute from '@/components/global/protected-route';

// Password change schema with strength validation
const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Profile update schema
const profileFormSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),
});

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Email display (could be null if not available)
  const userEmail = user?.email || "No email available";

  // Check if profiles table exists, create if not
  useEffect(() => {
    const checkProfilesTable = async () => {
      if (!user) return;
      
      try {
        // Try to fetch profile - this will fail if table doesn't exist
        const { error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();
          
        if (error && error.code === '42P01') {
          console.log("Profiles table doesn't exist, creating...");
          
          // Execute raw SQL to create the profiles table
          const createTableSQL = `
            CREATE TABLE IF NOT EXISTS profiles (
              id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
              full_name TEXT,
              username TEXT UNIQUE,
              avatar_url TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Create a trigger to set updated_at on update
            CREATE OR REPLACE FUNCTION set_updated_at()
            RETURNS TRIGGER AS $$
            BEGIN
              NEW.updated_at = NOW();
              RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
            
            DROP TRIGGER IF EXISTS set_profiles_updated_at ON profiles;
            CREATE TRIGGER set_profiles_updated_at
            BEFORE UPDATE ON profiles
            FOR EACH ROW
            EXECUTE FUNCTION set_updated_at();
          `;
          
          // Check if we can run SQL (requires admin privileges)
          const { error: sqlError } = await supabase.rpc('exec_sql', { 
            sql: createTableSQL 
          });
          
          if (sqlError) {
            console.warn("Could not create profiles table via RPC:", sqlError);
            
            // Fallback to just insert into profiles and let Supabase handle errors
            const { error: insertError } = await supabase
              .from('profiles')
              .upsert({
                id: user.id,
                full_name: user.user_metadata?.full_name,
                username: user.user_metadata?.username,
                avatar_url: user.user_metadata?.avatar_url,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
              
            // If this also fails with 42P01, we can't create the table
            if (insertError && insertError.code === '42P01') {
              console.warn("Could not create profiles table, insufficient permissions");
            }
          } else {
            console.log("Successfully created profiles table");
            
            // Insert current user's profile
            await supabase
              .from('profiles')
              .upsert({
                id: user.id,
                full_name: user.user_metadata?.full_name,
                username: user.user_metadata?.username,
                avatar_url: user.user_metadata?.avatar_url,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
          }
        } else if (error && error.code !== '42P01') {
          console.warn("Error checking profiles table:", error);
        } else {
          // Table exists and we have a row for this user
          console.log("Profiles table exists and has user entry");
        }
      } catch (error) {
        console.error("Error in profile table setup:", error);
      }
    };
    
    checkProfilesTable();
  }, [user, supabase]);

  // Initialize password change form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Initialize profile update form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: user?.user_metadata?.full_name || "",
      username: user?.user_metadata?.username || "",
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      profileForm.setValue('full_name', user.user_metadata?.full_name || "");
      profileForm.setValue('username', user.user_metadata?.username || "");
    }
  }, [user, profileForm]);

  // Get password value for strength meter
  const watchNewPassword = passwordForm.watch("newPassword");

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (!password) return score;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character type checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    return Math.min(score, 5);
  };

  const passwordStrength = getPasswordStrength(watchNewPassword);
  const strengthPercentage = (passwordStrength / 5) * 100;

  const getStrengthLabel = (strength: number) => {
    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    return labels[strength] || "Very Weak";
  };
  
  const getStrengthColor = (strength: number) => {
    const colors = ["bg-destructive", "bg-destructive", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-green-600"];
    return colors[strength] || "bg-destructive";
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // Trigger file input click
  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle avatar file change
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("File is too large. Maximum size is 5MB");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      console.log("Starting avatar upload process...");

      // Create a unique file name using timestamp and random string
      const fileExt = file.name.split('.').pop();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const fileName = `${Date.now()}_${randomStr}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      console.log(`Generated file path: ${filePath}`);

      // First check if the bucket exists
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        console.log("Available buckets:", buckets);
        
        // Check which bucket to use
        let bucketName = 'avatars';
        if (buckets) {
          const defaultBucket = buckets.find(b => b.name === 'avatars');
          if (!defaultBucket) {
            // If 'avatars' doesn't exist, use the first bucket or default to 'avatars'
            bucketName = buckets.length > 0 ? buckets[0].name : 'avatars';
            console.log(`Using bucket '${bucketName}' as fallback`);
          }
        }
        
        // Delete old avatar files to keep storage clean
        try {
          // Get the current avatar URL
          let currentAvatarPath = null;
          if (user.user_metadata?.avatar_url) {
            // Extract path from URL if it exists
            const avatarUrl = user.user_metadata.avatar_url;
            // Parse user ID from the URL
            const pathMatch = avatarUrl.match(/\/([^\/]+)\/([^\/]+)$/);
            if (pathMatch && pathMatch[1] === user.id) {
              currentAvatarPath = `${user.id}/${pathMatch[2]}`;
              console.log(`Found existing avatar path: ${currentAvatarPath}`);
            }
          }
          
          // List existing avatar files for this user
          const { data: existingFiles } = await supabase.storage
            .from(bucketName)
            .list(user.id);
            
          if (existingFiles && existingFiles.length > 0) {
            // Files to delete (all except the current one, if known)
            const filesToDelete = existingFiles
              .map(file => `${user.id}/${file.name}`)
              .filter(path => path !== currentAvatarPath);
              
            if (filesToDelete.length > 0) {
              console.log(`Cleaning up ${filesToDelete.length} old avatar files`);
              await supabase.storage
                .from(bucketName)
                .remove(filesToDelete);
            }
          }
        } catch (cleanupError) {
          // Don't fail the upload if cleanup fails
          console.warn("Failed to clean up old avatar files:", cleanupError);
        }
        
        // Upload to Supabase Storage
        console.log(`Uploading to bucket: ${bucketName}`);
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error details:", uploadError);
          if (uploadError.message.includes('bucket not found')) {
            toast.error("Storage bucket not configured", {
              description: "Please contact support to setup the avatar storage."
            });
          } else if (uploadError.message.includes('permission denied')) {
            toast.error("Permission denied", {
              description: "You don't have permission to upload files."
            });
          } else {
            toast.error("Failed to upload file", {
              description: uploadError.message
            });
          }
          return;
        }

        console.log("Upload successful:", uploadData);

        // Get the public URL
        const { data: publicURL } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        console.log("Public URL data:", publicURL);

        if (!publicURL) {
          toast.error("Failed to get file URL", {
            description: "The file was uploaded but we couldn't get its public URL."
          });
          return;
        }

        // Update user metadata with avatar URL
        const { error: updateError } = await supabase.auth.updateUser({
          data: { avatar_url: publicURL.publicUrl }
        });

        if (updateError) {
          console.error("User metadata update error:", updateError);
          toast.error("Failed to update profile", {
            description: updateError.message
          });
          return;
        }

        // Also update profile table if exists
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              avatar_url: publicURL.publicUrl,
              updated_at: new Date().toISOString()
            });

          if (profileError) {
            console.warn("Profile table update error:", profileError);
            if (profileError.code !== '42P01') { // Ignore if table doesn't exist
              console.warn("Failed to update profile table:", profileError);
            }
          }
        } catch (profileError) {
          // Just log profile table errors, don't fail the whole operation
          console.warn("Error updating profile table:", profileError);
        }

        toast.success("Avatar updated successfully", {
          description: "Your profile picture has been updated.",
          icon: <Check className="h-5 w-5 text-green-500" />,
        });

        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Force a refresh to show new avatar
        window.location.reload();
      } catch (bucketError: any) {
        console.error("Bucket operation error:", bucketError);
        toast.error("Storage configuration error", {
          description: bucketError?.message || "Could not access storage buckets."
        });
      }
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      toast.error("Failed to upload avatar", {
        description: error?.message || "Please try again later or contact support.",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Handle profile update
  async function handleProfileUpdate(values: z.infer<typeof profileFormSchema>) {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          full_name: values.full_name,
          username: values.username
        }
      });
      
      if (updateError) {
        throw updateError;
      }
      
      // Also update profile table if exists
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: values.full_name,
          username: values.username,
          updated_at: new Date().toISOString()
        });

      if (profileError && profileError.code !== '42P01') { // Ignore if table doesn't exist
        console.warn("Failed to update profile table:", profileError);
      }
      
      toast.success("Profile updated successfully", {
        description: "Your profile information has been updated.",
        icon: <Check className="h-5 w-5 text-green-500" />,
      });
      
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile", {
        description: "Please try again later or contact support.",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  // Handle password change
  async function handlePasswordChange(values: z.infer<typeof passwordFormSchema>) {
    try {
      setIsUpdating(true);
      
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: values.currentPassword,
      });
      
      if (signInError) {
        toast.error("Current password is incorrect", {
          description: "Please try again with your current password",
          icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
        });
        return;
      }
      
      // If verification succeeded, update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.newPassword,
      });
      
      if (updateError) {
        toast.error("Failed to update password", {
          description: updateError.message,
          icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
        });
        return;
      }
      
      toast.success("Password updated successfully", {
        description: "Your password has been changed. Please use your new password for future logins.",
        icon: <Check className="h-5 w-5 text-green-500" />,
      });
      passwordForm.reset();
      
    } catch (error) {
      toast.error("An unexpected error occurred", {
        description: "Please try again later or contact support if the issue persists.",
      });
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  }

  // Format date function
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PPP");
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((name: string) => name[0])
        .join('')
        .toUpperCase();
    }
    
    return user?.email?.[0].toUpperCase() || "U";
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-sketchdojo-bg to-sketchdojo-bg-light">
        {/* Background effects */}
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-sketchdojo-primary rounded-full filter blur-[100px] opacity-10"></div>
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-sketchdojo-accent rounded-full filter blur-[120px] opacity-10"></div>
        
        {/* Hidden file input for avatar upload */}
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          accept="image/*"
          className="hidden"
        />
        
        <div className="container max-w-7xl py-10 px-4 sm:px-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-sketchdojo-primary/20 group-hover:border-sketchdojo-primary transition-colors duration-300 relative">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-sketchdojo-primary to-sketchdojo-accent text-white text-xl">
                  {getInitials()}
                </AvatarFallback>
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  </div>
                )}
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold">{user?.user_metadata?.full_name || user?.user_metadata?.username || user?.email?.split("@")[0] || "User"}</h1>
                <p className="text-muted-foreground text-lg">
                  {user?.user_metadata?.username ? `@${user.user_metadata.username}` : userEmail}
                </p>
              </div>
            </div>
            <div className="md:ml-auto flex items-center gap-3">
              {user?.email_confirmed_at && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1">
                  <Check size={14} className="mr-1" /> Email Verified
                </Badge>
              )}
              <Button 
                variant="outline" 
                size="sm"
                className="border-sketchdojo-primary/30 text-sketchdojo-primary hover:bg-sketchdojo-primary/10"
                onClick={handleAvatarButtonClick}
                disabled={isUploadingAvatar}
              >
                {isUploadingAvatar ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" />
                    Upload Avatar
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-sketchdojo-bg-light/30 border-sketchdojo-primary/10 hover:border-sketchdojo-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-sketchdojo-primary/10">
                    <Calendar className="h-6 w-6 text-sketchdojo-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="text-lg font-semibold">{formatDate(user?.created_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-sketchdojo-bg-light/30 border-sketchdojo-primary/10 hover:border-sketchdojo-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-sketchdojo-primary/10">
                    <Clock className="h-6 w-6 text-sketchdojo-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Sign In</p>
                    <p className="text-lg font-semibold">{formatDate(user?.last_sign_in_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-sketchdojo-bg-light/30 border-sketchdojo-primary/10 hover:border-sketchdojo-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-sketchdojo-primary/10">
                    <Mail className="h-6 w-6 text-sketchdojo-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email Status</p>
                    <p className="text-lg font-semibold">
                      {user?.email_confirmed_at ? "Verified" : "Pending"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-sketchdojo-bg-light/30 border-sketchdojo-primary/10 hover:border-sketchdojo-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-sketchdojo-primary/10">
                    <Lock className="h-6 w-6 text-sketchdojo-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Auth Provider</p>
                    <p className="text-lg font-semibold capitalize">
                      {user?.app_metadata?.provider || "Email"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-sketchdojo-bg-light/30 border-sketchdojo-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User size={20} className="text-sketchdojo-primary" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Manage your account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your full name"
                                className="bg-muted/30 focus-visible:ring-sketchdojo-primary/30"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              This is your public display name.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="username"
                                className="bg-muted/30 focus-visible:ring-sketchdojo-primary/30"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Your unique username for identification.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-2">
                        <Button 
                          type="submit"
                          className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:opacity-90 transition-opacity"
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <div className="flex items-center">
                              <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                              Updating Profile...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Check size={16} className="mr-2" />
                              Save Changes
                            </div>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>

                  <Separator className="bg-sketchdojo-primary/10" />

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Email Address</h3>
                    <div className="flex items-center justify-between gap-2 bg-muted/30 p-3 rounded-md">
                      <p className="text-sm">{userEmail}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => copyToClipboard(userEmail)}
                        className="h-8 w-8 hover:bg-sketchdojo-primary/10 hover:text-sketchdojo-primary"
                      >
                        <Copy size={16} />
                      </Button>
                    </div>
                    {!user?.email_confirmed_at && (
                      <div className="flex items-center gap-2 text-xs text-amber-600 mt-1">
                        <AlertTriangle size={14} />
                        <span>Email verification pending. Check your inbox.</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Account ID</h3>
                    <div className="flex items-center justify-between gap-2 bg-muted/30 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground font-mono truncate">{user?.id}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => user?.id && copyToClipboard(user.id)}
                        className="h-8 w-8 hover:bg-sketchdojo-primary/10 hover:text-sketchdojo-primary"
                      >
                        <Copy size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Card */}
              <Card className="bg-sketchdojo-bg-light/30 border-sketchdojo-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield size={20} className="text-sketchdojo-primary" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your password and account security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Change Password</h3>
                      <Form {...passwordForm}>
                        <form 
                          onSubmit={passwordForm.handleSubmit(handlePasswordChange)} 
                          className="space-y-5"
                        >
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex justify-between">
                                  <FormLabel>Current Password</FormLabel>
                                </div>
                                <FormControl>
                                  <div className="relative">
                                    <Input 
                                      type={showPassword ? "text" : "password"}
                                      placeholder="••••••••"
                                      className="bg-muted/30 focus-visible:ring-sketchdojo-primary/30 pr-10" 
                                      {...field} 
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                      onClick={() => setShowPassword(!showPassword)}
                                    >
                                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </Button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Separator className="bg-sketchdojo-primary/10" />
                          
                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="••••••••"
                                    className="bg-muted/30 focus-visible:ring-sketchdojo-primary/30" 
                                    {...field} 
                                  />
                                </FormControl>
                                
                                {/* Password strength meter */}
                                {watchNewPassword && (
                                  <div className="space-y-2 mt-2">
                                    <div className="flex justify-between text-xs">
                                      <span>Password Strength</span>
                                      <span className={`font-medium ${
                                        passwordStrength >= 4 ? 'text-green-500' : 
                                        passwordStrength >= 2 ? 'text-yellow-500' : 
                                        'text-red-500'
                                      }`}>
                                        {getStrengthLabel(passwordStrength)}
                                      </span>
                                    </div>
                                    <Progress 
                                      value={strengthPercentage} 
                                      className={`h-2 ${getStrengthColor(passwordStrength)}`} 
                                    />
                                  </div>
                                )}
                                
                                <FormDescription>
                                  Password must meet the requirements below.
                                </FormDescription>
                                
                                {/* Password requirements list */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mt-2 text-muted-foreground">
                                  <div className={`flex items-center gap-1 ${/^.{8,}$/.test(watchNewPassword) ? "text-green-600" : ""}`}>
                                    {/^.{8,}$/.test(watchNewPassword) ? <Check size={12} /> : <AlertTriangle size={12} />}
                                    <span>8+ characters</span>
                                  </div>
                                  <div className={`flex items-center gap-1 ${/[A-Z]/.test(watchNewPassword) ? "text-green-600" : ""}`}>
                                    {/[A-Z]/.test(watchNewPassword) ? <Check size={12} /> : <AlertTriangle size={12} />}
                                    <span>Uppercase letter</span>
                                  </div>
                                  <div className={`flex items-center gap-1 ${/[a-z]/.test(watchNewPassword) ? "text-green-600" : ""}`}>
                                    {/[a-z]/.test(watchNewPassword) ? <Check size={12} /> : <AlertTriangle size={12} />}
                                    <span>Lowercase letter</span>
                                  </div>
                                  <div className={`flex items-center gap-1 ${/[0-9]/.test(watchNewPassword) ? "text-green-600" : ""}`}>
                                    {/[0-9]/.test(watchNewPassword) ? <Check size={12} /> : <AlertTriangle size={12} />}
                                    <span>Number</span>
                                  </div>
                                  <div className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(watchNewPassword) ? "text-green-600" : ""}`}>
                                    {/[^A-Za-z0-9]/.test(watchNewPassword) ? <Check size={12} /> : <AlertTriangle size={12} />}
                                    <span>Special character</span>
                                  </div>
                                </div>
                                
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="••••••••"
                                    className="bg-muted/30 focus-visible:ring-sketchdojo-primary/30" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="pt-2">
                            <Button 
                              type="submit"
                              className="w-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:opacity-90 transition-opacity"
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <div className="flex items-center">
                                  <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                                  Updating Password...
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <Key size={16} className="mr-2" />
                                  Update Password
                                </div>
                              )}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Quick Actions & Settings */}
            <div className="space-y-8">
              {/* Quick Actions Card */}
              <Card className="bg-sketchdojo-bg-light/30 border-sketchdojo-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings size={20} className="text-sketchdojo-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start hover:bg-sketchdojo-primary/10"
                    >
                      <Bell size={16} className="mr-2" />
                      Notification Settings
                      <ChevronRight size={16} className="ml-auto" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start hover:bg-sketchdojo-primary/10"
                    >
                      <CreditCard size={16} className="mr-2" />
                      Billing & Subscription
                      <ChevronRight size={16} className="ml-auto" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start hover:bg-sketchdojo-primary/10"
                    >
                      <HelpCircle size={16} className="mr-2" />
                      Help & Support
                      <ChevronRight size={16} className="ml-auto" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone Card */}
              <Card className="bg-sketchdojo-bg-light/30 border-red-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-500">
                    <AlertTriangle size={20} />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          className="w-full bg-red-500/80 hover:bg-red-500 text-white"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-sketchdojo-bg-light border-red-500/20">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-red-500">Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="hover:bg-muted/20">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-red-500/80 hover:bg-red-500 text-white"
                          >
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          className="w-full bg-red-500/80 hover:bg-red-500 text-white"
                        >
                          <LogOut size={16} className="mr-2" />
                          Sign Out
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-sketchdojo-bg-light border-sketchdojo-primary/20">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                          <AlertDialogDescription>
                            You will need to sign in again to access your account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="hover:bg-muted/20">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => signOut()}
                            className="bg-red-500/80 hover:bg-red-500 text-white"
                          >
                            Sign Out
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}