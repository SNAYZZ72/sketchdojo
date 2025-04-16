"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/providers/auth-provider';
import { ThemeToggle } from '@/components/global/theme-toggle';
import { sidebarNavigation } from '@/components/constants/navigation';
import { toast } from 'sonner';

// Icons
import { 
  Home, 
  BookOpen, 
  Layers, 
  Users, 
  Image as ImageIcon, 
  Wand2, 
  Sparkles, 
  Settings, 
  HelpCircle, 
  LogOut,
  CreditCard,
  Palette,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowUp,
  LayoutGrid,
  MessageCircle as ChatBubble,
  Languages as Translate,
  Mic as Microphone,
  Film,
  UserSquare,
  Bot,
  Columns,
  BookCopy,
  Globe,
  Check
} from 'lucide-react';

// UI Components
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from 'framer-motion';

// Local storage key for sidebar state
const SIDEBAR_STATE_KEY = 'sketchdojo-sidebar-collapsed';

export function MainSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  
  // Load sidebar state from local storage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
    
    // Load saved language from localStorage if exists
    const savedLanguage = localStorage.getItem('sketchdojo-language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);
  
  // Save sidebar state to local storage when it changes
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STATE_KEY, String(isCollapsed));
  }, [isCollapsed]);
  
  // Check if we're on mobile on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      // Auto-collapse sidebar on medium screens
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setIsCollapsed(true);
      }
    };
    
    // Set on mount
    checkMobile();
    
    // Set up listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Set active group based on current path
  useEffect(() => {
    // Find which group contains the current active path
    sidebarNavigation.forEach((group, index) => {
      const hasActivePath = group.items.some(item => isActive(item.href));
      if (hasActivePath) {
        setActiveGroup(index);
      }
    });
  }, [pathname]);
  
  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    
    // Dispatch a custom event to notify other components
    const event = new CustomEvent('sidebar-state-changed');
    window.dispatchEvent(event);
  };
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user?.email) return 'SD';
    const parts = user.email.split('@')[0].split('.');
    return parts.map(part => part[0]?.toUpperCase() || '').join('');
  };
  
  // Check if a path is active
  const isActive = (path: string) => {
    if (path === '/studio' && pathname === '/studio') {
      return true;
    }
    return path !== '/studio' && pathname.startsWith(path);
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Handle mobile menu item click
  const handleMobileItemClick = () => {
    // Add a small delay to make navigation feel more natural
    setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 150);
  };

  // Handle language change
  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('sketchdojo-language', language);
    
    // In a real app, you'd want to trigger the language change in your i18n system
    // For example: i18n.changeLanguage(language);
    
    toast.success(`Language changed to ${getLanguageName(language)}`);
  };
  
  // Get language name from code
  const getLanguageName = (code: string): string => {
    const languages: Record<string, string> = {
      en: "English",
      fr: "French",
      es: "Spanish",
      de: "German",
      ja: "Japanese",
    };
    return languages[code] || "English";
  };
  
  // Get language emoji flag from code
  const getLanguageFlag = (code: string): string => {
    const flags: Record<string, string> = {
      en: "🇺🇸",
      fr: "🇫🇷",
      es: "🇪🇸",
      de: "🇩🇪",
      ja: "🇯🇵",
    };
    return flags[code] || "🇺🇸";
  };

  // Helper function to get the icon component based on icon name
  const getIconComponent = (iconName: string, isMobileView = false) => {
    const size = isMobileView ? "h-6 w-6" : "h-5 w-5";
    
    switch (iconName) {
      case 'Home': return <Home className={size} />;
      case 'Layers': return <Layers className={size} />;
      case 'Users': return <Users className={size} />;
      case 'Film': return <Film className={size} />;
      case 'Image': return <ImageIcon className={size} />;
      case 'ImageIcon': return <ImageIcon className={size} />;
      case 'Wand2': return <Wand2 className={size} />;
      case 'Palette': return <Palette className={size} />;
      case 'Sparkles': return <Sparkles className={size} />;
      case 'UserSquare': return <UserSquare className={size} />;
      case 'BookOpen': return <BookOpen className={size} />;
      case 'Settings': return <Settings className={size} />;
      case 'HelpCircle': return <HelpCircle className={size} />;
      case 'User': return <User className={size} />;
      case 'ArrowUp': return <ArrowUp className={size} />;
      case 'LayoutGrid': return <LayoutGrid className={size} />;
      case 'Bot': return <Bot className={size} />;
      case 'ChatBubble': return <ChatBubble className={size} />;
      case 'Languages': return <Translate className={size} />;
      case 'Translate': return <Translate className={size} />;
      case 'Microphone': return <Microphone className={size} />;
      case 'Columns': return <Columns className={size} />;
      case 'BookCopy': return <BookCopy className={size} />;
      case 'Globe': return <Globe className={size} />;
      default: return <div className={size} />;
    }
  };

  // Navigation item for expanded sidebar
  const NavItem = ({ href, icon, label, active, onClick }: { 
    href: string; 
    icon: React.ReactNode; 
    label: string;
    active?: boolean;
    onClick?: () => void;
  }) => (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-white/70 hover:text-sketchdojo-primary dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-md transition-colors relative",
        active && "text-sketchdojo-primary dark:text-white bg-gray-100 dark:bg-white/10 font-medium"
      )}
      onClick={onClick}
    >
      <div className="relative z-10 text-inherit">
        {icon}
      </div>
      
      {!isCollapsed && (
        <span className="relative z-10">{label}</span>
      )}
      
      {active && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sketchdojo-primary to-sketchdojo-accent rounded-r-md" />
      )}
    </Link>
  );
  
  // Navigation item with tooltip for collapsed sidebar
  const CollapsibleNavItem = ({ href, icon, label, active, onClick }: { 
    href: string; 
    icon: React.ReactNode; 
    label: string;
    active?: boolean;
    onClick?: () => void;
  }) => {
    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link 
                href={href} 
                className={cn(
                  "flex items-center justify-center w-10 h-10 my-1 text-gray-700 dark:text-white/70 hover:text-sketchdojo-primary dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-md transition-colors relative",
                  active && "text-sketchdojo-primary dark:text-white bg-gray-100 dark:bg-white/10"
                )}
                onClick={onClick}
              >
                {icon}
                
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sketchdojo-primary to-sketchdojo-accent rounded-r-md" />
                )}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" align="center" className="bg-gray-800 text-white border-gray-700">
              {label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return (
      <NavItem 
        href={href} 
        icon={icon} 
        label={label} 
        active={active} 
        onClick={onClick} 
      />
    );
  };

  // Mobile navigation item component (optimized for touch)
  const MobileNavItem = ({ href, icon, label, active, onClick }: { 
    href: string; 
    icon: React.ReactNode; 
    label: string;
    active?: boolean;
    onClick?: () => void;
  }) => (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-4 px-4 py-4 text-base text-gray-700 dark:text-white/80 hover:text-sketchdojo-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors relative",
        active && "text-sketchdojo-primary dark:text-white bg-gray-50 dark:bg-white/10 font-medium"
      )}
      onClick={onClick}
    >
      <div className="relative z-10 text-inherit">
        {icon}
      </div>
      <span className="relative z-10 font-medium">{label}</span>
      
      {active && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-sketchdojo-primary to-sketchdojo-accent rounded-r-md" />
      )}
    </Link>
  );
  
  // The desktop sidebar content
  const DesktopSidebarContent = () => (
    <>
      {/* Logo */}
      <div className={cn(
        "px-4 py-5 flex items-center",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        <Link href="/studio" className={cn(
          "flex items-center gap-2 group",
          isCollapsed && "justify-center"
        )}>
          <div className="flex shrink-0 items-center justify-center rounded-full relative overflow-hidden">
            <Image
              src="/logo/logo.svg"
              alt="SketchDojo.ai"
              width={32}
              height={32}
              className="h-8 w-8 dark:invert-0 invert z-10 relative" 
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-sketchdojo-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          {!isCollapsed && (
            <span className="font-italianno text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black to-black/80 dark:from-white dark:to-white/80 group-hover:from-sketchdojo-primary group-hover:to-sketchdojo-accent transition-all duration-300">
              SketchDojo<span className="text-sketchdojo-primary">.ai</span>
            </span>
          )}
        </Link>
      </div>
      
      {/* Main Navigation */}
      <div className="mt-2 px-2 flex-1 overflow-y-auto custom-scrollbar">
        {/* Render navigation groups from constants */}
        {sidebarNavigation.map((group, groupIndex) => (
          <div key={groupIndex} className={cn("mb-4", isCollapsed && "flex flex-col items-center")}>
            {/* Render group title if it exists and sidebar is not collapsed */}
            {group.title && !isCollapsed && (
              <div className="mt-4 mb-2 px-4 text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">
                {group.title}
              </div>
            )}
            
            {/* Add spacer when collapsed */}
            {group.title && isCollapsed && groupIndex > 0 && (
              <div className="my-4 mx-auto w-8 border-t border-gray-200 dark:border-white/10"></div>
            )}
            
            {/* Render navigation items */}
            <div className={cn(isCollapsed && "w-full flex flex-col items-center")}>
              {group.items.map((item) => (
                <CollapsibleNavItem 
                  key={item.href}
                  href={item.href} 
                  icon={getIconComponent(item.icon)} 
                  label={item.label} 
                  active={isActive(item.href)} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* User section with upgrade button */}
      <div className="mt-auto border-t border-gray-200 dark:border-white/10 pt-2">
        {/* Profile section with theme toggle */}
        <div className={cn(
          "px-4 py-3",
          isCollapsed ? "flex flex-col items-center space-y-3" : "flex items-center justify-between"
        )}>
          {isCollapsed ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative group focus:outline-none">
                    <Avatar className="h-8 w-8 border-2 border-transparent hover:border-sketchdojo-primary transition-colors duration-300">
                      <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-sketchdojo-primary to-sketchdojo-accent text-white text-xs">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sketchdojo-primary opacity-50"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-sketchdojo-primary"></span>
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/studio/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/studio/billing" className="cursor-pointer">
                      <CreditCard className="mr-2 h-4 w-4" /> Billing & Subscription
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/studio/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="flex items-center">
                    <Globe className="mr-2 h-4 w-4" /> Language
                  </DropdownMenuLabel>
                  <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => handleLanguageChange('en')}>
                    <div className="w-4 h-4 mr-2 flex items-center justify-center">🇺🇸</div> 
                    English
                    {currentLanguage === 'en' && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => handleLanguageChange('fr')}>
                    <div className="w-4 h-4 mr-2 flex items-center justify-center">🇫🇷</div> 
                    French
                    {currentLanguage === 'fr' && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => handleLanguageChange('es')}>
                    <div className="w-4 h-4 mr-2 flex items-center justify-center">🇪🇸</div> 
                    Spanish
                    {currentLanguage === 'es' && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => handleLanguageChange('de')}>
                    <div className="w-4 h-4 mr-2 flex items-center justify-center">🇩🇪</div> 
                    German
                    {currentLanguage === 'de' && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => handleLanguageChange('ja')}>
                    <div className="w-4 h-4 mr-2 flex items-center justify-center">🇯🇵</div> 
                    Japanese
                    {currentLanguage === 'ja' && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
            </>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 text-sm text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors group focus:outline-none">
                    <Avatar className="h-8 w-8 border-2 border-transparent group-hover:border-sketchdojo-primary transition-colors duration-300">
                      <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-sketchdojo-primary to-sketchdojo-accent text-white text-xs">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left">
                      <span className="font-medium leading-none">{user?.email?.split('@')[0] || 'User'}</span>
                      <span className="text-xs text-gray-500 dark:text-white/40 mt-0.5">Free plan</span>
                    </div>
                    
                    <div className="ml-auto flex h-4 w-4 items-center justify-center">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sketchdojo-primary opacity-50"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-sketchdojo-primary"></span>
                      </span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/studio/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/studio/billing" className="cursor-pointer">
                      <CreditCard className="mr-2 h-4 w-4" /> Billing & Subscription
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/studio/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="flex items-center">
                    <Globe className="mr-2 h-4 w-4" /> Language
                  </DropdownMenuLabel>
                  <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => handleLanguageChange('en')}>
                    <div className="w-4 h-4 mr-2 flex items-center justify-center">🇺🇸</div> 
                    English
                    {currentLanguage === 'en' && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => handleLanguageChange('fr')}>
                    <div className="w-4 h-4 mr-2 flex items-center justify-center">🇫🇷</div> 
                    French
                    {currentLanguage === 'fr' && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => handleLanguageChange('es')}>
                    <div className="w-4 h-4 mr-2 flex items-center justify-center">🇪🇸</div> 
                    Spanish
                    {currentLanguage === 'es' && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => handleLanguageChange('de')}>
                    <div className="w-4 h-4 mr-2 flex items-center justify-center">🇩🇪</div> 
                    German
                    {currentLanguage === 'de' && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => handleLanguageChange('ja')}>
                    <div className="w-4 h-4 mr-2 flex items-center justify-center">🇯🇵</div> 
                    Japanese
                    {currentLanguage === 'ja' && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
            </>
          )}
        </div>
        
        {/* Upgrade section - only shown when not collapsed */}
        {!isCollapsed && (
          <div className="p-4">
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-[#1A1E2C] border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-sketchdojo-primary/20 to-sketchdojo-accent/20 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-start">
                  <div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Upgrade to Pro</p>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-white/60 mb-3 mt-1">Unlock all AI features and more</p>
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent hover:opacity-90 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                  asChild
                >
                  <Link href="/studio/billing">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Collapsed upgrade button with tooltip */}
        {isCollapsed && (
          <div className="px-2 py-3 flex justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    className="w-10 h-10 p-0 rounded-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent hover:opacity-90 text-white border-0 shadow-md transition-all duration-300"
                    asChild
                  >
                    <Link href="/studio/billing">
                      <CreditCard className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">Upgrade to Pro</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        
        {/* Collapse/Expand button */}
        <div className="p-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
            className={cn(
              "w-full flex items-center justify-center gap-2 transition-colors duration-300 border-gray-200 dark:border-white/10 hover:border-sketchdojo-primary dark:hover:border-sketchdojo-primary hover:text-sketchdojo-primary dark:hover:text-sketchdojo-primary",
              isCollapsed && "w-10 p-0"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );

  // The mobile sidebar content
  const MobileSidebarContent = () => (
    <>
      {/* Mobile Header with Logo and Close button */}
      <div className="px-4 py-5 flex items-center justify-between border-b border-gray-200 dark:border-white/10">
        <Link href="/studio" className="flex items-center gap-2" onClick={handleMobileItemClick}>
          <div className="flex shrink-0 items-center justify-center rounded-full relative overflow-hidden">
            <Image
              src="/logo/logo.svg"
              alt="SketchDojo.ai"
              width={36}
              height={36}
              className="h-9 w-9 dark:invert-0 invert z-10 relative" 
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-sketchdojo-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <span className="font-italianno text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black to-black/80 dark:from-white dark:to-white/80">
            SketchDojo<span className="text-sketchdojo-primary">.ai</span>
          </span>
        </Link>
        
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-gray-500 dark:text-white/70 hover:text-gray-700 dark:hover:text-white p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sketchdojo-primary/50"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      {/* User Profile Card */}
      <div className="px-4 py-4">
        <div className="flex items-center px-2 py-3 bg-gray-50 dark:bg-white/5 rounded-lg">
          <Avatar className="h-10 w-10 border-2 border-transparent">
            <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
            <AvatarFallback className="bg-gradient-to-br from-sketchdojo-primary to-sketchdojo-accent text-white text-sm">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          
          <div className="ml-3 flex-1">
            <p className="font-medium text-gray-900 dark:text-white">{user?.email?.split('@')[0] || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-white/50">Free plan</p>
          </div>
          
          <ThemeToggle />
        </div>
      </div>
      
      {/* Mobile navigation groups with accordion style */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {sidebarNavigation.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4">
            {/* Group title */}
            {group.title && (
              <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-white/50">
                {group.title}
              </div>
            )}
            
            {/* Navigation items */}
            <div className="space-y-1">
              {group.items.map((item) => (
                <MobileNavItem
                  key={item.href}
                  href={item.href}
                  icon={getIconComponent(item.icon, true)}
                  label={item.label}
                  active={isActive(item.href)}
                  onClick={handleMobileItemClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Mobile upgrade card */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-white/10">
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-[#1A1E2C] border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-sketchdojo-primary/20 to-sketchdojo-accent/20 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-3">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-2" />
              <div>
                <p className="text-base font-semibold text-gray-900 dark:text-white">Upgrade to Pro</p>
                <p className="text-sm text-gray-600 dark:text-white/60">Unlock premium features</p>
              </div>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent hover:opacity-90 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 py-5"
              asChild
            >
              <Link href="/studio/billing">
                <CreditCard className="h-4 w-4 mr-2" />
                Upgrade Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Logout button */}
      <div className="px-4 py-4">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 text-red-500 border-gray-200 dark:border-white/10 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </Button>
      </div>
    </>
  );

  // Mobile menu toggle button - improved with animations
  const MobileMenuToggle = () => (
    <motion.div
      className="md:hidden fixed top-4 left-4 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button 
        variant="ghost" 
        size="icon" 
        className="bg-white/10 backdrop-blur-lg text-gray-800 dark:text-white border border-gray-200 dark:border-white/10 shadow-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </motion.div>
  );

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      {isMobile && <MobileMenuToggle />}
      
      {/* Mobile Drawer (Sheet) with improved animation */}
      <AnimatePresence>
        {isMobileMenuOpen && isMobile && (
          <Sheet open={true} onOpenChange={setIsMobileMenuOpen}>
            <SheetContent 
              side="left" 
              className="p-0 w-[300px] border-r border-gray-200 dark:border-white/10 bg-white dark:bg-sketchdojo-bg shadow-xl overflow-hidden"
            >
              {/* SheetTitle is required for accessibility, but we can hide it visually */}
              <div className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </div>
              
              <div className="w-full h-full flex flex-col">
                <MobileSidebarContent />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </AnimatePresence>
      
      {/* Desktop Sidebar - Hidden on mobile */}
      <motion.div 
        initial={{ width: isCollapsed ? 64 : 256 }}
        animate={{ width: isCollapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "hidden md:flex h-screen flex-col sticky top-0 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-sketchdojo-bg shadow-sm dark:shadow-none z-30"
        )}
      >
        <style jsx global>{`
          /* Custom scrollbar for sidebar */
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.3);
            border-radius: 4px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 163, 175, 0.5);
          }
          
          /* Dark mode adjustments */
          .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
          }
          
          .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        `}</style>
        <DesktopSidebarContent />
      </motion.div>
    </>
  );
}