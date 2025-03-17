"use client";

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

// Form schema
const formSchema = z.object({
  full_name: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }).max(100),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and privacy policy.",
  }),
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

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [signUpComplete, setSignUpComplete] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  // Get password value for strength meter
  const passwordValue = form.watch("password");
  const passwordStrength = checkPasswordStrength(passwordValue);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/studio/sign-in`,
          data: {
            full_name: values.full_name,
          }
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSignUpComplete(true);
      toast.success("Check your email for the confirmation link!");
      
      // Navigate to sign-in page after successful sign up with a delay
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

  // Handle social sign up
  const handleSocialSignUp = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/studio`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-sketchdojo-bg to-sketchdojo-bg-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
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
          <h2 className="mt-2 text-2xl font-bold text-white">Create your account</h2>
          <p className="mt-2 text-sm text-white/60">
            Join thousands of manga creators and start your creative journey
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
            {signUpComplete && (
              <Alert className="bg-green-500/10 border-green-500/20 text-green-400 mb-4">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Account created successfully! Check your email to verify your account.
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            {!signUpComplete ? (
              <>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">                    
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="John Doe" 
                              className="bg-white/10 border-white/20 text-white focus:border-sketchdojo-primary focus:ring-sketchdojo-primary/20"
                              disabled={isLoading}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="you@example.com" 
                              className="bg-white/10 border-white/20 text-white focus:border-sketchdojo-primary focus:ring-sketchdojo-primary/20"
                              disabled={isLoading}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                                       
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Password</FormLabel>
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
                          <FormLabel className="text-white/80">Confirm Password</FormLabel>
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
                    
                    <FormField
                      control={form.control}
                      name="agreeTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading}
                              className="border-white/20 data-[state=checked]:bg-sketchdojo-primary data-[state=checked]:border-sketchdojo-primary"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm text-white/80 font-normal">
                              I agree to the{" "}
                              <Link href="#terms" className="text-sketchdojo-primary hover:underline">Terms of Service</Link>
                              {" "}and{" "}
                              <Link href="#privacy" className="text-sketchdojo-primary hover:underline">Privacy Policy</Link>
                            </FormLabel>
                            <FormMessage className="text-red-400" />
                          </div>
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
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        "Create account"
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-sketchdojo-bg px-2 text-white/60">
                        Or sign up with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
                      onClick={() => handleSocialSignUp('google')}
                      disabled={isLoading}
                    >
                      <svg className="mr-2 h-4 w-4" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                      </svg>
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
                      onClick={() => handleSocialSignUp('github')}
                      disabled={isLoading}
                    >
                      <svg className="mr-2 h-4 w-4" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.386-1.332-1.755-1.332-1.755-1.087-.745.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.195.69.8.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12" />
                      </svg>
                      GitHub
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-8 text-center animate-fadeIn">
                <CheckCircle2 className="h-16 w-16 mx-auto text-green-400 mb-4" />
                <h3 className="text-white text-xl font-medium mb-2">Account Created Successfully!</h3>
                <p className="text-white/60 mb-6">
                  We've sent a confirmation email to <span className="text-white font-medium">{form.getValues("email")}</span>.<br/>
                  Please check your inbox and click the verification link.
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
            {!signUpComplete && (
              <p className="text-sm text-white/60">
                Already have an account?{" "}
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