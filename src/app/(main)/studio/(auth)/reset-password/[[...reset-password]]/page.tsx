"use client";

import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Loader2, 
  LockKeyhole,
  X
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Custom modal component
const RequestLinkModal = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  isLoading 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (email: string) => void;
  isLoading: boolean;
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setError("");
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !z.string().email().safeParse(email).success) {
      setError("Please enter a valid email address.");
      return;
    }
    
    // Submit if valid
    onSubmit(email);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-sketchdojo-bg-light border border-white/10 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
        <div className="p-4 flex justify-between items-center border-b border-white/10">
          <h3 className="text-white text-lg font-medium">Request Password Reset Link</h3>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-white/80 mb-4">
            Please enter your email address to receive a new password reset link:
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-white/10 border-white/20 text-white focus:border-sketchdojo-primary focus:ring-sketchdojo-primary/20"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-transparent text-white border-white/20 hover:bg-white/10"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Form schema
const formSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Password strength checker
const checkPasswordStrength = (password: string): {strength: number, feedback: string} => {
  if (!password) return { strength: 0, feedback: "" };
  
  let strength = 0;
  let feedback = "";
  
  // Length check
  if (password.length >= 6) strength += 1;
  if (password.length >= 10) strength += 1;
  
  // Character variety checks
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  switch (true) {
    case (strength <= 2):
      feedback = "Weak password";
      break;
    case (strength <= 4):
      feedback = "Moderate password";
      break;
    default:
      feedback = "Strong password";
  }
  
  return { strength, feedback };
};

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetComplete, setResetComplete] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [tokenMissing, setTokenMissing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Get password value for strength meter
  const passwordValue = form.watch("password");
  const passwordStrength = checkPasswordStrength(passwordValue);

  // Extract reset token from URL on page load
  useEffect(() => {
    // Check for token in hash params (Supabase often puts it there)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hashToken = hashParams.get('token') || hashParams.get('access_token');
    
    // Check for token in URL query params
    const urlToken = searchParams.get('token');
    
    // Use token from hash or URL
    const token = hashToken || urlToken;
    
    if (token) {
      setResetToken(token);
    } else {
      setTokenMissing(true);
      setErrorMessage("Password reset token is missing. Please use the link from your email.");
    }
  }, [searchParams]);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!resetToken) {
        setErrorMessage("Reset token is missing. Please use the link from your email.");
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);
      
      // Update user's password using the reset token
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setResetComplete(true);
      toast.success("Password reset successful!");
      
      // Navigate to sign-in page after successful reset with a delay
      setTimeout(() => {
        router.push('/studio/sign-in');
      }, 3000);
      
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle requesting a new reset link
  const handleRequestNewLink = (email: string) => {
    const requestReset = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/studio/reset-password`,
        });
        
        if (error) {
          setErrorMessage(error.message);
          return;
        }
        
        toast.success("A new password reset link has been sent to your email!");
        setIsModalOpen(false);
        
      } catch (error) {
        setErrorMessage("An unexpected error occurred. Please try again.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    requestReset();
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-sketchdojo-bg to-sketchdojo-bg-light py-12 px-4 sm:px-6 lg:px-8">
      {/* Background elements */}
      <div className="absolute top-20 left-1/4 w-32 h-32 bg-sketchdojo-primary rounded-full filter blur-[100px] opacity-10"></div>
      <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-sketchdojo-accent rounded-full filter blur-[120px] opacity-10"></div>
      
      {/* Custom Modal */}
      <RequestLinkModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleRequestNewLink}
        isLoading={isLoading}
      />
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo and Heading */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Link href="/" className="inline-flex items-center group">
              <div className="relative overflow-hidden mr-3">
                <Image 
                  src="/logo/logo.svg" 
                  alt="SketchDojo Logo" 
                  width={50} 
                  height={50}
                  className="transform transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-sketchdojo-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="font-italianno text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 group-hover:from-sketchdojo-primary group-hover:to-sketchdojo-accent transition-all duration-300">
                SketchDojo<span className="text-sketchdojo-primary">.ai</span>
              </span>
            </Link>
          </div>
          <h2 className="mt-2 text-2xl font-bold text-white">Reset your password</h2>
          <p className="mt-2 text-sm text-white/60">
            Create a new secure password for your account
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="space-y-0 pb-2">
            {errorMessage && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400 mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            {resetComplete && (
              <Alert className="bg-green-500/10 border-green-500/20 text-green-400 mb-4">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Password reset successfully! You'll be redirected to sign in.
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            {!resetComplete ? (
              <>
                {tokenMissing ? (
                  <div className="py-8 text-center">
                    <LockKeyhole className="h-16 w-16 mx-auto text-sketchdojo-primary mb-4" />
                    <h3 className="text-white text-xl font-medium mb-2">Missing Reset Token</h3>
                    <p className="text-white/60 mb-6">
                      The password reset link appears to be invalid or expired. Please request a new reset link.
                    </p>
                    <Button 
                      onClick={() => setIsModalOpen(true)}
                      className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:shadow-lg hover:shadow-sketchdojo-primary/30"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        "Request New Link"
                      )}
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80">New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="••••••••" 
                                  className="bg-white/10 border-white/20 text-white pr-10 focus:border-sketchdojo-primary focus:ring-sketchdojo-primary/20"
                                  disabled={isLoading}
                                  {...field} 
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-1 top-1 h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                                  onClick={() => setShowPassword(!showPassword)}
                                  disabled={isLoading}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">
                                    {showPassword ? "Hide password" : "Show password"}
                                  </span>
                                </Button>
                              </div>
                            </FormControl>
                            
                            {/* Password strength meter */}
                            {passwordValue && (
                              <div className="mt-2">
                                <div className="flex items-center gap-2">
                                  <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full transition-all duration-300 ${
                                        passwordStrength.strength <= 2 
                                          ? 'bg-red-500' 
                                          : passwordStrength.strength <= 4 
                                            ? 'bg-yellow-500' 
                                            : 'bg-green-500'
                                      }`}
                                      style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className={`text-xs ${
                                    passwordStrength.strength <= 2 
                                      ? 'text-red-400' 
                                      : passwordStrength.strength <= 4 
                                        ? 'text-yellow-400' 
                                        : 'text-green-400'
                                  }`}>
                                    {passwordStrength.feedback}
                                  </span>
                                </div>
                                <FormDescription className="text-white/40 text-xs mt-1">
                                  Use at least 6 characters, including uppercase, lowercase, numbers, and symbols for a stronger password.
                                </FormDescription>
                              </div>
                            )}
                            
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80">Confirm New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showConfirmPassword ? "text" : "password"} 
                                  placeholder="••••••••" 
                                  className="bg-white/10 border-white/20 text-white pr-10 focus:border-sketchdojo-primary focus:ring-sketchdojo-primary/20"
                                  disabled={isLoading}
                                  {...field} 
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-1 top-1 h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  disabled={isLoading}
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">
                                    {showConfirmPassword ? "Hide password" : "Show password"}
                                  </span>
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent hover:shadow-lg hover:shadow-sketchdojo-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Resetting password...</span>
                          </div>
                        ) : (
                          "Reset Password"
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </>
            ) : (
              <div className="py-8 text-center animate-fadeIn">
                <CheckCircle2 className="h-16 w-16 mx-auto text-green-400 mb-4" />
                <h3 className="text-white text-xl font-medium mb-2">Password Reset Complete!</h3>
                <p className="text-white/60 mb-6">
                  Your password has been successfully reset.<br/>
                  You can now sign in with your new password.
                </p>
                <Button 
                  onClick={() => router.push('/studio/sign-in')}
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  Go to Sign In
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t border-white/10 pt-6">
            {!resetComplete && (
              <p className="text-sm text-white/60">
                Remember your password?{" "}
                <Link href="/studio/sign-in" className="text-sketchdojo-primary hover:text-sketchdojo-primary-light hover:underline transition-colors">
                  Sign in
                </Link>
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}