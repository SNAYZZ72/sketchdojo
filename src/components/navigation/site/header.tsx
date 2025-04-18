"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { Search, Menu, X, Moon, Sun, ChevronDown, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { createClient } from "@/utils/supabase/client";

// Navigation items
const navigationItems = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Showcase", href: "#showcase" },
  { name: "Community", href: "#community" },
];

// Skip to content component for accessibility
const SkipToContent = () => (
  <a 
    href="#main-content" 
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-sketchdojo-primary text-white px-4 py-2 rounded-md z-50"
  >
    Skip to content
  </a>
);

// User dropdown menu component
const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { signOut, user } = useAuth();

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.user_metadata?.full_name) return "U";
    
    const fullName = user.user_metadata.full_name as string;
    const nameParts = fullName.split(' ');
    
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    
    return fullName.slice(0, 2).toUpperCase();
  };

  return (
    <div className="relative user-dropdown">
      <button
        className="flex items-center space-x-1 text-white/90 hover:text-white transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-sketchdojo-primary/20 flex items-center justify-center text-white">
          <span className="text-xs">{getUserInitials()}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black/90 backdrop-blur-lg border border-white/10 overflow-hidden z-50"
          >
            <div className="py-1">
              <Link
                href="/studio"
                className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-sketchdojo-primary/20 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/studio/settings"
                className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-sketchdojo-primary/20 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
              <div className="border-t border-white/10 my-1"></div>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-sketchdojo-primary/20 transition-colors duration-200"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    if (window.scrollY > 20) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, []);

  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    
    const throttledScroll = () => {
      // Only run the function if there's no active timer
      if (!scrollTimer) {
        scrollTimer = setTimeout(() => {
          handleScroll();
          scrollTimer = null;
        }, 100); // 100ms throttle time
      }
    };

    window.addEventListener('scroll', throttledScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [handleScroll]);

  // Handle body scroll locking
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would implement the actual theme switching logic
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    if (href === "/") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState({}, '', '/');
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState({}, '', href);
      }
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-2 bg-black/80 backdrop-blur-lg shadow-lg shadow-black/10 border-b border-white/5' 
          : 'py-4 bg-transparent'
      }`}
      aria-label="Main navigation"
    >
      <SkipToContent />
      
      <div className="relative px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        {/* Main navbar container */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center group">
            <Link 
              href="/" 
              className="relative flex items-center"
              onClick={(e) => scrollToSection(e, "/")}
              aria-label="SketchDojo.ai - Go to homepage"
            >
              <div className="relative overflow-hidden">
                <Image
                  src="/logo/logo.svg"
                  alt=""
                  width={40}
                  height={40}
                  className="mr-3 transform transition-transform duration-300 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-sketchdojo-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              </div>
              <span className="font-italianno text-2xl sm:text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 group-hover:from-sketchdojo-primary group-hover:to-sketchdojo-accent transition-all duration-300">
                SketchDojo<span className="text-sketchdojo-primary">.ai</span>
              </span>
            </Link>
          </div>

          {/* Main navigation - desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="relative px-3 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 group rounded-md"
              >
                <span className="relative z-10">{item.name}</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-white/80 hover:text-white transition-colors duration-200 rounded-full hover:bg-white/5"
              aria-label={isSearchOpen ? "Close search" : "Open search"}
            >
              <Search className="w-5 h-5" />
            </button>
            
            {/* Theme toggle button */}
            <button
              onClick={toggleDarkMode}
              className="hidden sm:flex p-2 text-white/80 hover:text-white transition-colors duration-200 rounded-full hover:bg-white/5"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Conditional rendering based on login status */}
            {isLoading ? (
              <div className="w-8 h-8 relative">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            ) : user ? (
              <UserDropdown />
            ) : (
              /* Auth Links - Desktop */
              <div className="hidden sm:flex items-center space-x-3">
                <Link 
                  href="/studio/sign-in" 
                  className="relative overflow-hidden py-2 px-3 text-white/90 hover:text-white transition-colors duration-300 group text-sm"
                >
                  <span className="relative z-10">Login</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></span>
                </Link>
                <Link 
                  href="/studio/sign-up" 
                  className="py-2 px-4 bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white rounded-full font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-sketchdojo-primary/30 transform hover:-translate-y-0.5 hover:brightness-110"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-sketchdojo-primary/50 transition-all duration-300 relative z-50 hover:bg-white/5"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="w-6 h-6 relative">
                <span 
                  className={`absolute h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45 top-3' : 'rotate-0 top-1'
                  }`}
                ></span>
                <span 
                  className={`absolute h-0.5 w-6 bg-white rounded-full top-3 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                ></span>
                <span 
                  className={`absolute h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${
                    isMenuOpen ? '-rotate-45 top-3' : 'rotate-0 top-5'
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Search bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full mt-2 mx-4 bg-black/80 backdrop-blur-lg rounded-xl border border-white/10 shadow-xl overflow-hidden"
            >
              <div className="flex items-center p-2">
                <Search className="w-5 h-5 text-white/50 ml-2" />
                <input
                  type="text"
                  placeholder="Search for manga styles, tutorials..."
                  className="w-full bg-transparent border-none text-white px-3 py-2 focus:outline-none placeholder:text-white/50"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-white/70 hover:text-white"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            id="mobile-menu"
            className="md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-lg"
            aria-label="Mobile navigation"
          >
            <div className="min-h-screen flex flex-col justify-center items-center px-4 py-24 space-y-8">
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col items-center space-y-6 mb-8 w-full">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className="text-xl text-white/90 hover:text-sketchdojo-primary transition-colors duration-200 py-2 w-full text-center"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              
              {/* Mobile Auth Links - conditionally rendered */}
              <div className="flex flex-col items-center space-y-6 w-full">
                {isLoading ? (
                  <div className="py-4">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : user ? (
                  <>
                    <Link
                      href="/studio"
                      className="text-xl text-white/90 hover:text-sketchdojo-primary transition-colors duration-300 w-full text-center py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/studio/settings"
                      className="text-xl text-white/90 hover:text-sketchdojo-primary transition-colors duration-300 w-full text-center py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      className="text-xl text-white/90 hover:text-sketchdojo-primary transition-colors duration-300 w-full text-center py-2"
                      onClick={async () => {
                        setIsMenuOpen(false);
                        await signOut();
                        router.push('/');
                      }}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/studio/sign-in"
                      className="text-xl text-white/90 hover:text-sketchdojo-primary transition-colors duration-300 w-full text-center py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/studio/sign-up"
                      className="py-3 px-8 bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg hover:shadow-sketchdojo-primary/30 w-full max-w-xs text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up Free
                    </Link>
                  </>
                )}
              </div>
              
              {/* Theme toggle - Mobile */}
              <button
                onClick={toggleDarkMode}
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 py-2"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-5 h-5" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}