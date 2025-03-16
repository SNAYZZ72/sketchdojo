"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

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
import { Copy, Shield, User, LogOut, Check, Key, AlertTriangle } from "lucide-react";
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

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const supabase = createClient();

  // Email display (could be null if not available)
  const userEmail = user?.email || "No email available";

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

  // Simulate loading user data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <ProtectedRoute>
      <div className="container max-w-4xl py-10 px-4 sm:px-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-sketchdojo-primary/20">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-sketchdojo-primary to-sketchdojo-accent text-white">
                {user?.email?.[0].toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}</h1>
              <p className="text-muted-foreground">{userEmail}</p>
            </div>
          </div>
          <div className="md:ml-auto">
            {user?.email_confirmed_at && (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <Check size={12} className="mr-1" /> Email Verified
              </Badge>
            )}
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield size={16} />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
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
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Email Address</h3>
                  <div className="flex items-center justify-between gap-2 bg-muted/30 p-3 rounded-md">
                    <p className="text-sm">{userEmail}</p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => copyToClipboard(userEmail)}
                      className="h-8 w-8"
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
                      className="h-8 w-8"
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Account Details</h3>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-6 bg-muted/30 p-3 rounded-md">
                    <div>
                      <p className="text-xs text-muted-foreground">Created On</p>
                      <p className="text-sm">{formatDate(user?.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Sign In</p>
                      <p className="text-sm">{formatDate(user?.last_sign_in_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email Verified</p>
                      <p className="text-sm">{user?.email_confirmed_at ? formatDate(user?.email_confirmed_at) : "Not verified"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Auth Provider</p>
                      <p className="text-sm capitalize">{user?.app_metadata?.provider || "Email"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 flex justify-between pt-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You will need to sign in again to access your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => signOut()}>
                        Sign Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
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
                                <Input 
                                  type="password" 
                                  placeholder="••••••••"
                                  className="bg-muted/30" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Separator />
                        
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
                                  className="bg-muted/30" 
                                  {...field} 
                                />
                              </FormControl>
                              
                              {/* Password strength meter */}
                              {watchNewPassword && (
                                <div className="space-y-2 mt-2">
                                  <div className="flex justify-between text-xs">
                                    <span>Password Strength</span>
                                    <span className="font-medium">{getStrengthLabel(passwordStrength)}</span>
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
                              
                              {/* Password requirements list - moved outside FormDescription */}
                              <div className="text-xs mt-2 text-muted-foreground">
                                <ul className="list-disc list-inside space-y-1">
                                  <li className={`${/^.{8,}$/.test(watchNewPassword) ? "text-green-600" : ""}`}>
                                    Be at least 8 characters
                                  </li>
                                  <li className={`${/[A-Z]/.test(watchNewPassword) ? "text-green-600" : ""}`}>
                                    Include an uppercase letter
                                  </li>
                                  <li className={`${/[a-z]/.test(watchNewPassword) ? "text-green-600" : ""}`}>
                                    Include a lowercase letter
                                  </li>
                                  <li className={`${/[0-9]/.test(watchNewPassword) ? "text-green-600" : ""}`}>
                                    Include a number
                                  </li>
                                  <li className={`${/[^A-Za-z0-9]/.test(watchNewPassword) ? "text-green-600" : ""}`}>
                                    Include a special character
                                  </li>
                                </ul>
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
                                  className="bg-muted/30" 
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
                            className="w-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white"
                            disabled={isUpdating}
                          >
                            {isUpdating ? (
                              <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
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
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}