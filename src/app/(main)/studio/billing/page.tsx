"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion } from "framer-motion";

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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CreditCard, Download, Loader2, Calendar, CheckCircle, Clock, DollarSign, Gift, History, Receipt, RotateCw, User, Shield, Star, Tag, Wallet, CreditCardIcon, AlertTriangle, Trash2, HelpCircle } from "lucide-react";
import ProtectedRoute from '@/components/global/protected-route';
import { pricingPlans } from '@/components/constants/navigation';

// Billing information schema
const billingFormSchema = z.object({
  nameOnCard: z.string().min(2, "Name must be at least 2 characters"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiryMonth: z.string().min(1, "Please select expiry month"),
  expiryYear: z.string().min(1, "Please select expiry year"),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
});

type BillingFormValues = z.infer<typeof billingFormSchema>;

// Mock data for payment history
const paymentHistory = [
  {
    id: "INV-001",
    date: "2023-11-15",
    amount: "$29.00",
    status: "Paid",
    plan: "Professional"
  },
  {
    id: "INV-002",
    date: "2023-12-15",
    amount: "$29.00",
    status: "Paid",
    plan: "Professional"
  },
  {
    id: "INV-003",
    date: "2024-01-15",
    amount: "$29.00",
    status: "Paid",
    plan: "Professional"
  },
  {
    id: "INV-004",
    date: "2024-02-15",
    amount: "$29.00", 
    status: "Paid",
    plan: "Professional"
  }
];

export default function BillingPage() {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("Free");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const supabase = createClient();

  // Initialize billing form
  const billingForm = useForm<BillingFormValues>({
    resolver: zodResolver(billingFormSchema),
    defaultValues: {
      nameOnCard: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
    },
  });

  // Generate expiry month and year options
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      value: month.toString().padStart(2, '0'),
      label: month.toString().padStart(2, '0')
    };
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear + i;
    return {
      value: year.toString(),
      label: year.toString()
    };
  });

  // Handle billing info update
  async function handleBillingUpdate(data: BillingFormValues) {
    try {
      setIsUpdating(true);
      
      // This would connect to a payment gateway in a real implementation
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      toast.success("Payment method updated", {
        description: "Your billing information has been updated successfully.",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
      
      // Reset form
      billingForm.reset();
      
    } catch (error) {
      console.error("Failed to update billing information:", error);
      toast.error("Failed to update billing information", {
        description: "Please check your card details and try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  // Handle plan change
  const handlePlanChange = async (plan: string) => {
    try {
      setIsUpdating(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCurrentPlan(plan);
      
      // Show success message
      toast.success("Subscription updated", {
        description: `You've successfully switched to the ${plan} plan.`,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
      
    } catch (error) {
      console.error("Failed to change plan:", error);
      toast.error("Failed to update subscription", {
        description: "Please try again later or contact support.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
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
        
        <div className="container max-w-7xl py-10 px-4 sm:px-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-sketchdojo-primary/20 to-sketchdojo-accent/20 flex items-center justify-center">
                <CreditCard className="h-10 w-10 text-sketchdojo-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Billing & Subscription</h1>
                <p className="text-muted-foreground text-lg">
                  Manage your subscription and payment methods
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Subscription Info & Plans */}
            <div className="lg:col-span-2 space-y-8">
              {/* Current Plan Card */}
              <Card className="bg-sketchdojo-bg-light/30 border-sketchdojo-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star size={20} className="text-sketchdojo-primary" />
                    Current Subscription
                  </CardTitle>
                  <CardDescription>
                    Your active subscription plan and status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gradient-to-r from-sketchdojo-primary/5 to-sketchdojo-accent/5 rounded-lg border border-sketchdojo-primary/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          {currentPlan === "Free" ? "Free Trial" : "Professional Plan"}
                          {currentPlan !== "Free" && (
                            <Badge className="ml-2 bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent">
                              Active
                            </Badge>
                          )}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          {currentPlan === "Free" 
                            ? "Limited features and AI generations" 
                            : "Full access to all features and premium support"}
                        </p>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        {currentPlan === "Free" ? (
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">$0<span className="text-sm text-gray-500 dark:text-gray-400">/month</span></span>
                        ) : (
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">$29<span className="text-sm text-gray-500 dark:text-gray-400">/month</span></span>
                        )}
                      </div>
                    </div>
                    
                    {currentPlan !== "Free" && (
                      <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Next billing date</p>
                            <p className="font-medium text-gray-900 dark:text-white">March 15, 2024</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Payment method</p>
                            <p className="font-medium text-gray-900 dark:text-white">•••• 4242</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-6">
                      {currentPlan === "Free" ? (
                        <Button 
                          className="w-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:opacity-90 transition-opacity"
                          onClick={() => handlePlanChange("Professional")}
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <div className="flex items-center">
                              <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                              Upgrading...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Star size={16} className="mr-2" />
                              Upgrade to Professional
                            </div>
                          )}
                        </Button>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handlePlanChange("Free")}
                            disabled={isUpdating}
                          >
                            {isUpdating ? (
                              <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            ) : "Cancel Subscription"}
                          </Button>
                          <Button 
                            className="flex-1 bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:opacity-90 transition-opacity"
                            onClick={() => handlePlanChange("Studio")}
                            disabled={isUpdating}
                          >
                            {isUpdating ? (
                              <div className="flex items-center">
                                <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                                Upgrading...
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <Star size={16} className="mr-2" />
                                Upgrade to Studio
                              </div>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Available Plans */}
              <Card className="bg-sketchdojo-bg-light/30 border-sketchdojo-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag size={20} className="text-sketchdojo-primary" />
                    Available Plans
                  </CardTitle>
                  <CardDescription>
                    Choose the plan that works best for you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <RadioGroup 
                      defaultValue={billingCycle}
                      className="flex justify-end"
                      onValueChange={(value) => setBillingCycle(value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Monthly</Label>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <RadioGroupItem value="annual" id="annual" />
                        <Label htmlFor="annual">Annual <Badge className="ml-1 bg-green-600">Save 20%</Badge></Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {pricingPlans.map((plan, index) => (
                      <div 
                        key={index}
                        className={`relative p-4 rounded-lg border ${currentPlan === plan.title ? 'border-sketchdojo-primary bg-sketchdojo-primary/5' : 'border-gray-200 dark:border-gray-800'}`}
                      >
                        {currentPlan === plan.title && (
                          <Badge className="absolute -top-2 -right-2 bg-sketchdojo-primary">
                            Current
                          </Badge>
                        )}
                        <h3 className="text-lg font-semibold mb-2">{plan.title}</h3>
                        <div className="mb-4">
                          <span className="text-2xl font-bold">{billingCycle === "annual" && plan.price !== "$0" ? 
                            `$${parseInt(plan.price.replace("$", "")) * 0.8 * 12}` : 
                            plan.price}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {billingCycle === "annual" ? "/year" : "/month"}
                          </span>
                        </div>
                        <ul className="text-sm space-y-2 mb-4 min-h-[180px]">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          variant={currentPlan === plan.title ? "outline" : "default"}
                          size="sm"
                          className={`w-full ${
                            currentPlan !== plan.title && index === 1 ? 
                            "bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:opacity-90" : ""
                          }`}
                          onClick={() => handlePlanChange(plan.title)}
                          disabled={currentPlan === plan.title || isUpdating}
                        >
                          {isUpdating ? 
                            <Loader2 className="h-4 w-4 animate-spin" /> : 
                            currentPlan === plan.title ? "Current Plan" : "Select Plan"
                          }
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Payment History */}
              <Card className="bg-sketchdojo-bg-light/30 border-sketchdojo-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History size={20} className="text-sketchdojo-primary" />
                    Payment History
                  </CardTitle>
                  <CardDescription>
                    View and download your past invoices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {paymentHistory.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentHistory.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.id}</TableCell>
                            <TableCell>{formatDate(payment.date)}</TableCell>
                            <TableCell>{payment.plan}</TableCell>
                            <TableCell>{payment.amount}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                                {payment.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 px-4">
                      <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No payment history</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Your payment history will appear here once you subscribe to a plan.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Payment Methods */}
            <div className="space-y-8">
              {/* Payment Methods Card */}
              <Card className="bg-sketchdojo-bg-light/30 border-sketchdojo-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCardIcon size={20} className="text-sketchdojo-primary" />
                    Payment Methods
                  </CardTitle>
                  <CardDescription>
                    Manage your payment information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Existing cards */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-500">Expires 09/2025</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-auto mr-4">Default</Badge>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Remove card</span>
                      </Button>
                    </div>
                  </div>

                  {/* Add new card form */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Add new payment method</h3>
                    <Form {...billingForm}>
                      <form onSubmit={billingForm.handleSubmit(handleBillingUpdate)} className="space-y-4">
                        <FormField
                          control={billingForm.control}
                          name="nameOnCard"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name on card</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="John Smith"
                                  className="bg-muted/30 focus-visible:ring-sketchdojo-primary/30"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={billingForm.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="1234 5678 9012 3456"
                                  className="bg-muted/30 focus-visible:ring-sketchdojo-primary/30"
                                  maxLength={16}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={billingForm.control}
                            name="expiryMonth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Month</FormLabel>
                                <Select 
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-muted/30 focus-visible:ring-sketchdojo-primary/30">
                                      <SelectValue placeholder="MM" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {months.map((month) => (
                                      <SelectItem key={month.value} value={month.value}>
                                        {month.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={billingForm.control}
                            name="expiryYear"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Year</FormLabel>
                                <Select 
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-muted/30 focus-visible:ring-sketchdojo-primary/30">
                                      <SelectValue placeholder="YYYY" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {years.map((year) => (
                                      <SelectItem key={year.value} value={year.value}>
                                        {year.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={billingForm.control}
                            name="cvc"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVC</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="123"
                                    className="bg-muted/30 focus-visible:ring-sketchdojo-primary/30"
                                    maxLength={4}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="pt-2">
                          <Button 
                            type="submit"
                            className="w-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:opacity-90 transition-opacity"
                            disabled={isUpdating}
                          >
                            {isUpdating ? (
                              <div className="flex items-center">
                                <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                                Adding Card...
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <CreditCard size={16} className="mr-2" />
                                Add Payment Method
                              </div>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </CardContent>
              </Card>
              
              {/* FAQ Card */}
              <Card className="bg-sketchdojo-bg-light/30 border-sketchdojo-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle size={20} className="text-sketchdojo-primary" />
                    Billing FAQ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">When will I be charged?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Your subscription renews automatically on the same day each month. You'll be charged immediately when you upgrade.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">How do I cancel my subscription?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      You can cancel your subscription at any time from this page. Your benefits will continue until the end of your billing cycle.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Can I get a refund?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      We offer a 14-day money-back guarantee. Contact our support team if you're not satisfied with your purchase.
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" className="text-sketchdojo-primary">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                    <Button variant="outline" size="sm" className="text-sketchdojo-primary">
                      View Billing Policy
                    </Button>
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