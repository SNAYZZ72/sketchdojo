"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Social Links Data
const socialLinks = [
  {
    name: "TikTok",
    url: "#",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="transition-transform duration-300 group-hover:scale-110">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    )
  },
  {
    name: "YouTube",
    url: "#",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="transition-transform duration-300 group-hover:scale-110">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
  {
    name: "Instagram",
    url: "#",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="transition-transform duration-300 group-hover:scale-110">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  },
  {
    name: "Twitter",
    url: "#",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="transition-transform duration-300 group-hover:scale-110">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 14-7.496 14-13.986 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59l-.047-.02z"/>
      </svg>
    )
  },
  {
    name: "Discord",
    url: "#",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="transition-transform duration-300 group-hover:scale-110">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
      </svg>
    )
  }
];

// Footer Link Sections
const footerLinkSections = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Community", href: "#community" },
      { name: "Updates", href: "#updates" }
    ]
  },
  {
    title: "Resources",
    links: [
      { name: "Tutorials", href: "#tutorials" },
      { name: "Documentation", href: "#docs" },
      { name: "Blog", href: "#blog" },
      { name: "Support", href: "#support" }
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "#careers" },
      { name: "Contact", href: "#contact" },
      { name: "Press", href: "#press" }
    ]
  },
  {
    title: "Legal",
    links: [
      { name: "Terms of Service", href: "#terms" },
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Cookie Policy", href: "#cookies" },
      { name: "GDPR", href: "#gdpr" }
    ]
  }
];

export function Footer() {
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (emailInput.trim()) {
      // In a real application, you would send this to your API
      console.log("Subscribed with email:", emailInput);
      setSubscribed(true);
      setEmailInput("");
      
      // Reset the subscribed state after 5 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };

  // Smooth scroll function
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
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
    <footer className="pt-20 pb-10 bg-gradient-to-b from-sketchdojo-bg to-sketchdojo-bg-light text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="mb-16 max-w-3xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-semibold mb-3">Stay in the loop</h3>
          <p className="text-white/60 mb-6">Get manga creation tips and updates directly to your inbox</p>
          
          <form onSubmit={handleSubscribe} className="relative max-w-md mx-auto">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Your email address"
              className="w-full py-3 px-5 pr-36 rounded-full bg-white/10 border border-white/20 focus:border-sketchdojo-primary focus:outline-none focus:ring-2 focus:ring-sketchdojo-primary/50 transition-all duration-300 text-white placeholder-white/40"
              required
            />
            <button
              type="submit"
              className={`absolute right-1.5 top-1.5 py-1.5 px-4 rounded-full font-medium transition-all duration-300 transform ${
                subscribed 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:shadow-lg hover:shadow-sketchdojo-primary/20'
              }`}
            >
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-16">
          {/* Logo and Social Media Links */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-5 group">
              <Link 
                href="/"
                className="flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="relative overflow-hidden mr-3">
                  <Image 
                    src="/logo/logo.svg" 
                    alt="SketchDojo Logo" 
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
            
            <p className="text-white/60 mb-6 max-w-xs">
              AI-powered manga creation platform for everyone, from beginners to professionals.
            </p>
            
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url}
                  aria-label={social.name}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-gradient-to-r hover:from-sketchdojo-primary hover:to-sketchdojo-accent hover:text-white transition-all duration-300 group"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Footer Links */}
          {footerLinkSections.map((section, sIndex) => (
            <div key={sIndex}>
              <h4 className="font-semibold text-lg mb-5">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, lIndex) => (
                  <li key={lIndex}>
                    <a 
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="text-white/60 hover:text-white transition-colors duration-200 block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-white/60 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} SketchDojo.ai — All rights reserved
          </p>
          
          <div className="flex flex-wrap gap-6 justify-center">
            <a href="#privacy" className="text-sm text-white/60 hover:text-white transition-colors duration-200">
              Privacy
            </a>
            <a href="#terms" className="text-sm text-white/60 hover:text-white transition-colors duration-200">
              Terms
            </a>
            <a href="#cookies" className="text-sm text-white/60 hover:text-white transition-colors duration-200">
              Cookies
            </a>
            <a href="#sitemap" className="text-sm text-white/60 hover:text-white transition-colors duration-200">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}