"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/providers/auth-provider';
import { ThemeToggle } from '@/components/global/theme-toggle';
import { sidebarNavigation } from '@/components/constants/navigation';

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
  PanelLeft,
  PanelRight
} from 'lucide-react';

// UI Components
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Local storage key for sidebar state
const SIDEBAR_STATE_KEY = 'sketchdojo-sidebar-collapsed';

export function MainSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Load sidebar state from local storage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);
  
  // Save sidebar state to local storage when it changes
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STATE_KEY, String(isCollapsed));
  }, [isCollapsed]);
  
  // Check if we're on mobile on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    
    // Set on mount
    checkMobile();
    
    // Set up listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
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

  // Helper function to get the icon component based on icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Home': return <Home className="h-5 w-5" />;
      case 'Layers': return <Layers className="h-5 w-5" />;
      case 'Users': return <Users className="h-5 w-5" />;
      case 'ImageIcon': return <ImageIcon className="h-5 w-5" />;
      case 'Wand2': return <Wand2 className="h-5 w-5" />;
      case 'Palette': return <Palette className="h-5 w-5" />;
      case 'Sparkles': return <Sparkles className="h-5 w-5" />;
      case 'BookOpen': return <BookOpen className="h-5 w-5" />;
      case 'Settings': return <Settings className="h-5 w-5" />;
      case 'HelpCircle': return <HelpCircle className="h-5 w-5" />;
      case 'User': return <User className="h-5 w-5" />;
      default: return <div className="h-5 w-5" />;
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
        "flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/5 rounded-md transition-colors",
        active && "text-gray-900 dark:text-white bg-gray-200 dark:bg-white/10"
      )}
      onClick={onClick}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
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
                  "flex items-center justify-center w-10 h-10 my-1 text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/5 rounded-md transition-colors",
                  active && "text-gray-900 dark:text-white bg-gray-200 dark:bg-white/10"
                )}
                onClick={onClick}
              >
                {icon}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
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
  
  // The sidebar content - reused in both desktop and mobile views
  const SidebarContent = ({ isMobileView = false, onNavClick }: { isMobileView?: boolean, onNavClick?: () => void }) => (
    <>
      {/* Logo */}
      <div className={cn(
        "px-4 py-5 flex items-center",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        <Link href="/studio" className={cn(
          "flex items-center gap-2",
          isCollapsed && "justify-center"
        )}>
          <div className="flex shrink-0 items-center justify-center rounded-full">
            <Image
              src="/logo/logo.svg"
              alt="SketchDojo.ai"
              width={32}
              height={32}
              className="h-8 w-8 dark:invert-0 invert" 
            />
          </div>
          {!isCollapsed && (
            <span className="font-italianno text-2xl font-bold text-black dark:text-white">SketchDojo.ai</span>
          )}
        </Link>
        
        {/* Close button - only shown in mobile drawer */}
        {isMobileView && (
          <button 
            onClick={onNavClick}
            className="text-white/70 hover:text-white p-1"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {/* Main Navigation */}
      <div className="mt-2 px-2 flex-1 overflow-y-auto">
        {/* Render navigation groups from constants */}
        {sidebarNavigation.map((group, groupIndex) => (
          <div key={groupIndex} className={cn("mb-4", isCollapsed && "flex flex-col items-center")}>
            {/* Render group title if it exists and sidebar is not collapsed */}
            {group.title && !isCollapsed && (
              <div className="mt-4 mb-2 px-4 text-xs text-gray-600 dark:text-white/40 uppercase">{group.title}</div>
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
                  onClick={onNavClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* User section with upgrade button */}
      <div className="mt-auto border-t border-gray-200 dark:border-white/10">
        {/* Profile section with theme toggle */}
        <div className={cn(
          "px-4 py-3",
          isCollapsed ? "flex flex-col items-center space-y-3" : "flex items-center justify-between"
        )}>
          {isCollapsed ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/studio/profile">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Profile</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <ThemeToggle />
            </>
          ) : (
            <>
              <Link 
                href="/studio/profile" 
                className={cn(
                  "flex items-center gap-3 text-sm text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors",
                  isActive('/studio/profile') && "text-gray-900 dark:text-white"
                )}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <span>Profile</span>
              </Link>
              <ThemeToggle />
            </>
          )}
        </div>
        
        {/* Upgrade section - only shown when not collapsed */}
        {!isCollapsed && (
          <div className="p-4">
            <div className="bg-white dark:bg-[#1A1E2C] border border-gray-200 dark:border-transparent rounded-md p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Upgrade to Pro</p>
              <p className="text-xs text-gray-600 dark:text-white/60 mb-3">Unlock all AI features and more</p>
              <Button 
                className="w-full bg-gradient-to-r from-[#9333EA] to-[#C026D3] hover:from-[#A855F7] hover:to-[#D946EF] text-white border-0"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Upgrade
              </Button>
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
                    className="w-10 h-10 p-0 rounded-full bg-gradient-to-r from-[#9333EA] to-[#C026D3] hover:from-[#A855F7] hover:to-[#D946EF] text-white border-0"
                  >
                    <CreditCard className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Upgrade to Pro</TooltipContent>
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
            className="w-full flex items-center justify-center gap-2"
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

  // Mobile menu toggle button - only shown on mobile
  const MobileMenuToggle = () => (
    <Button 
      variant="ghost" 
      size="icon" 
      className="md:hidden fixed top-4 left-4 z-50 bg-[#0F1729]/80 backdrop-blur-sm text-white border border-white/10"
      onClick={() => setIsMobileMenuOpen(true)}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );

  // For desktop: render the sidebar directly
  // For mobile: render the toggle button and the Sheet component
  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <MobileMenuToggle />
      
      {/* Mobile Drawer (Sheet) */}
      <Sheet open={isMobileMenuOpen && isMobile} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent 
          side="left" 
          className="p-0 w-[280px] border-r border-white/5 bg-[#0F1729]"
        >
          {/* SheetTitle is required for accessibility, but we can hide it visually */}
          <div className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </div>
          
          <div className="w-full h-full flex flex-col">
            <SidebarContent isMobileView={true} onNavClick={() => setIsMobileMenuOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className={cn(
        "hidden md:flex h-screen flex-col sticky top-0 border-r border-gray-200 dark:border-white/5 bg-white dark:bg-[#0F1729] transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <SidebarContent />
      </div>
    </>
  );
}