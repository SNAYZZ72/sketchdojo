"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/providers/auth-provider';
import { ThemeToggle } from '@/components/global/theme-toggle';

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
  X
} from 'lucide-react';

// UI Components
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function MainSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
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

  const NavItem = ({ href, icon: Icon, label, active, onClick }: { 
    href: string; 
    icon: React.ElementType; 
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
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
  
  // The sidebar content - reused in both desktop and mobile views
  const SidebarContent = ({ isMobileView = false, onNavClick }: { isMobileView?: boolean, onNavClick?: () => void }) => (
    <>
      {/* Logo */}
      <div className="px-4 py-5 flex items-center justify-between">
        <Link href="/studio" className="flex items-center gap-2">
          <div className="flex shrink-0 items-center justify-center">
            <Image
              src="/logo/logo.svg"
              alt="SketchDojo.ai"
              width={32}
              height={32}
              className="h-8 w-8"
            />
          </div>
          <span className="font-italianno text-2xl text-gray-900 dark:text-white">SketchDojo.ai</span>
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
        {/* Core Navigation */}
        <NavItem 
          href="/studio" 
          icon={Home} 
          label="Dashboard" 
          active={isActive('/studio') && pathname === '/studio'} 
          onClick={onNavClick}
        />
        <NavItem 
          href="/studio/projects" 
          icon={Layers} 
          label="Projects" 
          active={isActive('/studio/projects')} 
          onClick={onNavClick}
        />
        <NavItem 
          href="/studio/characters" 
          icon={Users} 
          label="Characters" 
          active={isActive('/studio/characters')} 
          onClick={onNavClick}
        />
        <NavItem 
          href="/studio/scenes" 
          icon={ImageIcon} 
          label="Scenes" 
          active={isActive('/studio/scenes')} 
          onClick={onNavClick}
        />
        
        {/* AI Tools */}
        <div className="mt-4 mb-2 px-4 text-xs text-white/40 uppercase">AI Tools</div>
        <NavItem 
          href="/studio/tools/generator" 
          icon={Wand2} 
          label="Image Generator" 
          active={isActive('/studio/tools/generator')} 
          onClick={onNavClick}
        />
        <NavItem 
          href="/studio/tools/inpainting" 
          icon={Palette} 
          label="Inpainting" 
          active={isActive('/studio/tools/inpainting')} 
          onClick={onNavClick}
        />
        <NavItem 
          href="/studio/tools/training" 
          icon={Sparkles} 
          label="Character Training" 
          active={isActive('/studio/tools/training')} 
          onClick={onNavClick}
        />
        
        {/* Resources */}
        <div className="mt-4 mb-2 px-4 text-xs text-white/40 uppercase">Resources</div>
        <NavItem 
          href="/studio/templates" 
          icon={BookOpen} 
          label="Templates" 
          active={isActive('/studio/templates')} 
          onClick={onNavClick}
        />
        
        {/* Settings */}
        <div className="mt-6 mb-2 border-t border-white/10"></div>
        <NavItem 
          href="/studio/settings" 
          icon={Settings} 
          label="Settings" 
          active={isActive('/studio/settings')} 
          onClick={onNavClick}
        />
        <NavItem 
          href="/studio/help" 
          icon={HelpCircle} 
          label="Help" 
          active={isActive('/studio/help')} 
          onClick={onNavClick}
        />
        {/* Theme Toggle */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-center px-4 py-2 rounded-md">
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      {/* User section with upgrade button */}
      <div className="mt-auto border-t border-white/10">
        {/* Profile section */}
        <Link 
          href="/studio/profile" 
          className={cn(
            "flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/5 transition-colors",
            isActive('/studio/profile') && "text-gray-900 dark:text-white bg-gray-200 dark:bg-white/10"
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

        {/* Upgrade section */}
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
      <div className="hidden md:flex w-64 h-screen bg-[#0F1729] flex-col sticky top-0 border-r border-white/5">
        <SidebarContent />
      </div>
    </>
  );
}