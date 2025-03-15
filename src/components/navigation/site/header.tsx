"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { siteNavigation } from "@/components/constants/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="relative px-4 sm:px-16 py-2 sm:py-4">
        {/* Main Container */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Image
                src="/logo/logo.svg"
                alt="SketchDojo.ai"
                width={40}
                height={40}
                className="mr-2 cursor-pointer"
              />
            </Link>
            <span className="font-italianno text-xl sm:text-3xl text-white">SketchDojo.ai</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden text-white text-3xl focus:outline-none transition-transform duration-300 ease-in-out"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>

          {/* Desktop Navigation and Auth Links */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* Center Navigation Container */}
            <div className="absolute left-1/2 top-4 transform -translate-x-1/2 bg-[#272727]/40 backdrop-blur-md rounded-full px-8 py-2">
              <nav className="flex items-center space-x-12">
                {siteNavigation.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="font-italianno text-2xl text-white/80 hover:text-[#C23FDC] transition-colors duration-300 ease-in-out"
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Auth Links */}
            <div className="flex items-center space-x-4">
            <Link 
              href="/studio/sign-in" 
              className="font-italianno text-3xl text-white/80 hover:text-[#C23FDC] transition-colors"
            >
              Login
            </Link>
            <span className="text-white text-2xl">/</span>
            <Link 
              href="/studio/sign-up" 
              className="font-italianno text-3xl text-white/80 hover:text-[#C23FDC] transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } sm:hidden mt-4 rounded-lg p-4 transition-all duration-300 ease-in-out overflow-hidden`}
          style={{
            maxHeight: isMenuOpen ? "500px" : "0",
            opacity: isMenuOpen ? "1" : "0",
            background: "transparent", // Fully transparent background
            backdropFilter: "blur(10px)", // Optional blur effect for better readability
          }}
        >
          <nav className="flex flex-col items-center space-y-4">
            {siteNavigation.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="font-italianno text-lg text-white/80 hover:text-[#C23FDC] transition-colors duration-300 ease-in-out"
                onClick={() => setIsMenuOpen(false)} // Close menu after clicking a link
              >
                {item.title}
              </a>
            ))}
          </nav>

          {/* Separator Line */}
          <div className="w-full h-[1px] bg-white/20 my-4"></div>

          {/* Mobile Auth Links */}
          <div className="flex flex-col items-center space-y-4">
            <Link
              href="/studio/sign-in"
              className="font-italianno text-lg text-white/80 hover:text-[#C23FDC] transition-colors"
              onClick={() => setIsMenuOpen(false)} // Close menu after clicking a link
            >
              Login
            </Link>
            <span className="text-white text-lg">/</span>
            <Link
              href="/studio/sign-up"
              className="font-italianno text-lg text-white/80 hover:text-[#C23FDC] transition-colors"
              onClick={() => setIsMenuOpen(false)} // Close menu after clicking a link
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}