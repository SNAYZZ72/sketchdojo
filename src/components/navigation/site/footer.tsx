"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail, AlertCircle, Check, ArrowRight, ExternalLink, Shield } from "lucide-react"

// Updated social links with better accessibility
const socialLinks = [
  {
    name: "TikTok",
    url: "https://tiktok.com/@sketchdojo",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    )
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@sketchdojo",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
  {
    name: "Instagram",
    url: "https://instagram.com/sketchdojo.ai",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  },
  {
    name: "Twitter",
    url: "https://twitter.com/sketchdojo_ai",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 14-7.496 14-13.986 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59l-.047-.02z"/>
      </svg>
    )
  },
  {
    name: "Discord",
    url: "https://discord.gg/sketchdojo",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
      </svg>
    )
  }
];

// Legal and important links with enhanced information
const legalLinks = [
  { 
    name: "Terms of Service", 
    href: "/site/legal/terms",
    description: "The rules and guidelines for using SketchDojo"
  },
  { 
    name: "Privacy Policy", 
    href: "/site/legal/privacy",
    description: "How we collect, use, and protect your personal data"
  },
  { 
    name: "Cookie Policy", 
    href: "/site/legal/cookies",
    description: "Information about the cookies we use on our website"
  },
  { 
    name: "Cookie Preferences", 
    href: "#cookie-preferences",
    description: "Manage your cookie settings",
    isModal: true
  },
  { 
    name: "GDPR Compliance", 
    href: "/site/legal/gdpr",
    description: "How we comply with EU data protection regulations"
  },
  { 
    name: "Accessibility", 
    href: "/site/legal/accessibility",
    description: "Our commitment to making SketchDojo accessible to all"
  },
  { 
    name: "Content Policy", 
    href: "/site/legal/content-policy",
    description: "Guidelines for creating appropriate content"
  }
];

// News banner component that shows above the footer
const NewsBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  return isVisible ? (
    <div className="bg-sketchdojo-primary/20 backdrop-blur-sm border-t border-b border-sketchdojo-primary/30 py-3 px-4 text-center relative">
      <button 
        className="absolute right-4 top-3 text-white/60 hover:text-white"
        onClick={() => setIsVisible(false)}
        aria-label="Close announcement"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <p className="text-white text-sm">
        🚀 Our new content guidelines are now live! 
        <Link href="/site/legal/content-policy" className="underline ml-2 hover:text-sketchdojo-primary transition-colors">
          Read more here
        </Link>
      </p>
    </div>
  ) : null;
};

// Newsletter Form Component with enhanced validation and privacy notice
const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscribed(true);
      setEmail("");
      setIsLoading(false);
      
      // Reset after 5 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mb-16 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold mb-3">Stay in the loop</h3>
      <p className="text-white/70 mb-6 text-sm">
        Get manga creation tips and updates directly to your inbox
      </p>
      
      {subscribed ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center"
        >
          <Check className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-white font-medium">Thank you for subscribing!</p>
          <p className="text-white/70 text-sm mt-1">We've sent a confirmation to your email</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubscribe} className="relative">
          <div className="flex items-center">
            <div className="absolute left-3 text-white/40">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full py-3 px-5 pl-11 pr-32 rounded-lg bg-white/10 border border-white/20 focus:border-sketchdojo-primary focus:outline-none focus:ring-1 focus:ring-sketchdojo-primary/50 transition-all duration-300 text-white placeholder-white/40"
              aria-label="Email address"
              aria-invalid={!!error}
              aria-describedby={error ? "email-error" : undefined}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-1.5 top-1.5 py-2 px-4 rounded-md font-medium transition-all duration-300 bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:shadow-lg hover:shadow-sketchdojo-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </span>
              ) : (
                <span className="flex items-center">
                  Subscribe <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              )}
            </button>
          </div>
          
          {error && (
            <div
              id="email-error"
              className="text-red-400 text-sm mt-2 flex items-center"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </div>
          )}
          
          <p className="text-white/40 text-xs mt-3">
            By subscribing, you agree to our <Link href="/site/legal/privacy" className="underline hover:text-white transition-colors">Privacy Policy</Link> and consent to receive updates from SketchDojo.
          </p>
        </form>
      )}
    </div>
  );
};

// Cookie Banner Component
const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if user has already made cookie choices
    const hasCookieConsent = localStorage.getItem('cookieConsent');
    if (!hasCookieConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    setIsVisible(false);
  };
  
  const acceptEssential = () => {
    localStorage.setItem('cookieConsent', 'essential');
    setIsVisible(false);
  };
  
  const openPreferences = () => {
    // Would open a more detailed cookie preferences modal
    console.log('Open cookie preferences modal');
    localStorage.setItem('cookieConsent', 'custom');
    setIsVisible(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 p-4 z-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-white font-medium mb-2 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-sketchdojo-primary" />
              Cookie Consent
            </h3>
            <p className="text-white/70 text-sm">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
              By clicking "Accept All", you consent to our use of cookies as described in our 
              <Link href="/site/legal/cookies" className="underline text-white ml-1 hover:text-sketchdojo-primary transition-colors">
                Cookie Policy
              </Link>.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              onClick={acceptEssential}
              className="px-4 py-2 bg-transparent border border-white/20 rounded-md text-white/90 hover:bg-white/10 transition-colors text-sm"
            >
              Essential Only
            </button>
            <button
              onClick={openPreferences}
              className="px-4 py-2 bg-transparent border border-white/20 rounded-md text-white/90 hover:bg-white/10 transition-colors text-sm"
            >
              Preferences
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent rounded-md text-white hover:shadow-lg hover:shadow-sketchdojo-primary/20 transition-all text-sm"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function Footer() {
  // Smooth scroll function
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If it's an external link or not a hash link, don't intercept
    if (!href.startsWith('#')) {
      return;
    }
    
    e.preventDefault();
    
    if (href === '#cookie-preferences') {
      // Open cookie preferences modal
      console.log('Open cookie preferences modal');
      return;
    }
    
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 100,
        behavior: 'smooth'
      });
      
      // Update the URL without a page refresh
      window.history.pushState({}, '', href);
    }
  };

  return (
    <>
      <NewsBanner />
      
      <footer className="pt-20 pb-10 bg-gradient-to-b from-sketchdojo-bg to-black text-white relative" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">Footer</h2>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* Company Info and Social Links */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-5 group">
                <Link 
                  href="/"
                  className="flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  aria-label="SketchDojo.ai - Back to homepage"
                >
                  <div className="relative overflow-hidden mr-3">
                    <Image 
                      src="/logo/logo.svg" 
                      alt="" 
                      width={40} 
                      height={40}
                      className="transform transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-sketchdojo-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <span className="font-italianno text-2xl sm:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 group-hover:from-sketchdojo-primary group-hover:to-sketchdojo-accent transition-all duration-300">
                    SketchDojo<span className="text-sketchdojo-primary">.ai</span>
                  </span>
                </Link>
              </div>
              
              <p className="text-white/70 mb-6 max-w-xs">
                AI-powered manga creation platform for everyone, from beginners to professionals.
              </p>
              
              <div className="flex gap-3 mb-8">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.name} - Opens in a new tab`}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-gradient-to-r hover:from-sketchdojo-primary hover:to-sketchdojo-accent hover:text-white transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-sketchdojo-primary/50"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              
              <div className="text-white/50 text-sm">
                <div className="flex items-center mb-2">
                  <Shield className="w-4 h-4 mr-2 text-green-400" />
                  <span>SSL Secured & GDPR Compliant</span>
                </div>
                <div className="flex items-center">
                  <svg 
                    viewBox="0 0 24 24" 
                    width="16" 
                    height="16" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="mr-2 text-blue-400"
                  >
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" />
                    <path d="M7.5 11.5L10.5 14.5L16.5 8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Privacy Verified by TrustArc</span>
                </div>
              </div>
            </div>
            
            {/* Newsletter Subscription */}
            <div className="md:col-span-1">
              <NewsletterForm />
            </div>
            
            {/* Legal Links Section */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-sketchdojo-primary" />
                Legal Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {legalLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    onClick={(e) => link.isModal ? scrollToSection(e, link.href) : undefined}
                    className="group relative"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-white group-hover:text-sketchdojo-primary transition-colors">
                          {link.name}
                        </span>
                        <p className="text-white/50 text-sm mt-1">{link.description}</p>
                      </div>
                      {!link.isModal && (
                        <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-sketchdojo-primary transition-colors mt-1" />
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-white/10 group-hover:bg-sketchdojo-primary/30 transition-colors"></div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Bottom Section with Copyright and Links */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 mb-6 md:mb-0">
                <p className="text-sm text-white/60">
                  &copy; {new Date().getFullYear()} SketchDojo.ai — All rights reserved
                </p>
                <a href="mailto:support@sketchdojo.ai" className="text-sm text-white/60 hover:text-white transition-colors flex items-center">
                  <Mail className="w-4 h-4 mr-1" /> support@sketchdojo.ai
                </a>
              </div>
              
              <div className="flex gap-6 flex-wrap justify-center">
                {legalLinks.slice(0, 4).map((link, index) => (
                  <a 
                    key={index}
                    href={link.href}
                    onClick={(e) => link.isModal ? scrollToSection(e, link.href) : undefined}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="text-center text-xs text-white/40 mt-6">
              SketchDojo is a product of Pixel Innovations Ltd., registered in Tokyo, Japan. Registration No. 1234567890.
            </div>
          </div>
        </div>
      </footer>
      
      <CookieBanner />
    </>
  );
}