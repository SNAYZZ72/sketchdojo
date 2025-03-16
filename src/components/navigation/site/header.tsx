"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { siteNavigation } from "@/components/constants/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      // Update header background based on scroll position
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Update active section based on scroll position
      const sections = siteNavigation.map(item => item.href.replace('#', ''));
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle document body scroll locking when mobile menu is open
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

  // Improved smooth scroll function that works with your section structure
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    // Extract the section ID from the href
    const targetId = href.replace('#', '');
    
    // Try to find the element by ID first (ideal case)
    let targetElement = document.getElementById(targetId);
    
    // If not found by ID, try to find a section that might match
    if (!targetElement) {
      // Look for sections with matching text content or class names
      const allSections = document.querySelectorAll('section');
      
      allSections.forEach(section => {
        // Check if section title/heading contains the target text
        const headings = section.querySelectorAll('h2, h3, h4, .font-italianno');
        
        headings.forEach(heading => {
          if (heading.textContent?.toLowerCase().includes(targetId.toLowerCase())) {
            targetElement = section;
          }
        });
        
        // Also check for class names that might match
        if (section.className.toLowerCase().includes(targetId.toLowerCase())) {
          targetElement = section;
        }
      });
    }
    
    if (targetElement) {
      // Scroll to the element with offset for the header
      window.scrollTo({
        top: targetElement.offsetTop - 100,
        behavior: 'smooth'
      });
      
      // Update the URL without a page refresh
      window.history.pushState({}, '', href);
      setActiveSection(href);
    } else {
      console.log(`Section "${targetId}" not found, adding fallback navigation`);
      
      // As a last resort, try to scroll approximately where the section should be
      // Based on common section ordering: features, community, pricing
      const approximatePositions = {
        'features': 0.3, // About 30% down the page
        'community': 0.6, // About 60% down the page
        'pricing': 0.8,   // About 80% down the page
      };
      
      if (approximatePositions[targetId as keyof typeof approximatePositions]) {
        const pageHeight = document.body.scrollHeight;
        const targetPosition = pageHeight * approximatePositions[targetId as keyof typeof approximatePositions];
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        window.history.pushState({}, '', href);
        setActiveSection(href);
      }
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2 bg-sketchdojo-bg/80 backdrop-blur-lg shadow-lg shadow-black/10' : 'py-4'
      }`}
    >
      <div className="relative px-4 sm:px-8 md:px-16 mx-auto max-w-7xl">
        {/* Main Container */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center group">
            <Link 
              href="/" 
              className="relative flex items-center"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveSection("");
                window.history.pushState({}, '', '/');
              }}
            >
              <div className="relative overflow-hidden">
                <Image
                  src="/logo/logo.svg"
                  alt="SketchDojo.ai"
                  width={40}
                  height={40}
                  className="mr-3 transform transition-transform duration-300 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-sketchdojo-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="font-italianno text-2xl sm:text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 group-hover:from-sketchdojo-primary group-hover:to-sketchdojo-accent transition-all duration-300">
                SketchDojo<span className="text-sketchdojo-primary">.ai</span>
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-sketchdojo-primary/50 transition-all duration-300 relative z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
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

          {/* Desktop Navigation and Auth Links */}
          <div className="hidden sm:flex items-center space-x-6">
            {/* Center Navigation Container */}
            <div className={`absolute left-1/2 transform -translate-x-1/2 ${
              scrolled 
                ? 'top-2 transition-all duration-500 ease-out' 
                : 'top-4 transition-all duration-500 ease-out'
            }`}>
              <nav className="flex items-center px-8 py-2 rounded-full bg-white/10 backdrop-blur-md shadow-lg shadow-black/5 border border-white/10">
                <ul className="flex space-x-6 md:space-x-10">
                  {siteNavigation.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={(e) => scrollToSection(e, item.href)}
                        className={`relative py-1 px-2 font-medium text-sm md:text-base transition-all duration-300 group ${
                          activeSection === item.href 
                            ? 'text-sketchdojo-primary font-semibold' 
                            : 'text-white/90 hover:text-white'
                        }`}
                      >
                        {item.title}
                        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent transform origin-left transition-transform duration-300 ${
                          activeSection === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}></span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Auth Links */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/studio/sign-in" 
                className="relative overflow-hidden py-2 px-3 text-white/90 hover:text-white transition-colors duration-300 group"
              >
                <span className="relative z-10">Login</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></span>
              </Link>
              <Link 
                href="/studio/sign-up" 
                className="py-2 px-5 bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white rounded-full font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-sketchdojo-primary/30 transform hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Full screen overlay */}
        <div
          className={`sm:hidden fixed inset-0 z-40 bg-sketchdojo-bg/95 backdrop-blur-lg transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="min-h-screen flex flex-col justify-center items-center px-4 py-24">
            <nav className="flex flex-col items-center space-y-6 mb-12">
              {siteNavigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`relative text-xl font-medium transition-colors duration-300 ${
                    activeSection === item.href 
                      ? 'text-sketchdojo-primary' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {item.title}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent transform origin-left transition-transform duration-300 ${
                    activeSection === item.href ? 'scale-x-100' : 'scale-x-0'
                  }`}></span>
                </a>
              ))}
            </nav>

            {/* Mobile Auth Links */}
            <div className="flex flex-col items-center space-y-6">
              <Link
                href="/studio/sign-in"
                className="text-xl text-white/90 hover:text-sketchdojo-primary transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                href="/studio/sign-up"
                className="py-3 px-8 bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg hover:shadow-sketchdojo-primary/30"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}