"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/navigation/site/header"
import { Footer } from '@/components/navigation/site/footer'
import { features, communityGallery, pricingPlans } from "@/components/constants/navigation"

// Import our modular components for the home
import { 
  HeroSection,
  FeaturesSection,
  CommunitySection,
  PricingSection,
  FAQSection,
  Newsletter
} from "@/components/home"

// Custom cursor effect for enhanced interactivity
const CustomCursor = () => {
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };
    
    window.addEventListener('mousemove', moveCursor);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.body.removeChild(cursor);
    };
  }, []);
  
  return null;
};

// Enhanced scroll animations
const ScrollAnimations = () => {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach(element => {
        const elementTop = (element as HTMLElement).getBoundingClientRect().top;
        const elementHeight = (element as HTMLElement).offsetHeight;
        const windowHeight = window.innerHeight;
        
        if (elementTop <= windowHeight - elementHeight / 4) {
          element.classList.add('animate-fadeIn');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on load
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return null;
};

export default function Home() {
  return (
    <main className="min-h-screen bg-sketchdojo-bg overflow-hidden">
      {/* Add custom styles */}
      <style jsx global>{`
        .custom-cursor {
          position: fixed;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(194, 63, 220, 0.2);
          transform: translate(-50%, -50%);
          pointer-events: none;
          mix-blend-mode: difference;
          z-index: 9999;
          transition: width 0.3s, height 0.3s, background 0.3s;
        }
        
        .custom-cursor:active {
          width: 25px;
          height: 25px;
          background: rgba(194, 63, 220, 0.5);
        }
        
        /* Page transition animation */
        @keyframes fadeInPage {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        main {
          animation: fadeInPage 0.5s ease-out forwards;
        }
        
        /* Hide elements before they're animated */
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-on-scroll.animate-fadeIn {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Staggered animation delays for children */
        .stagger-children > *:nth-child(1) { transition-delay: 0.1s; }
        .stagger-children > *:nth-child(2) { transition-delay: 0.2s; }
        .stagger-children > *:nth-child(3) { transition-delay: 0.3s; }
        .stagger-children > *:nth-child(4) { transition-delay: 0.4s; }
        .stagger-children > *:nth-child(5) { transition-delay: 0.5s; }
      `}</style>
      
      {/* Custom effects */}
      <CustomCursor />
      <ScrollAnimations />
      
      {/* Header Navigation */}
      <Header />
      
      {/* Page Sections */}
      <HeroSection />
      
      <div className="animate-on-scroll">
        <FeaturesSection features={features} />
      </div>
      
      <div className="animate-on-scroll">
        <CommunitySection communityGallery={communityGallery} />
      </div>
      
      <div className="animate-on-scroll">
        <PricingSection pricingPlans={pricingPlans} />
      </div>
      
      <div className="animate-on-scroll">
        <FAQSection />
      </div>
      
      <div className="animate-on-scroll">
        <Newsletter />
      </div>
      
      {/* Footer */}
      <Footer />
    </main>
  )
}