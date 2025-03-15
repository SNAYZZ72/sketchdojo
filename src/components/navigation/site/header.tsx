"use client"

import Link from "next/link"
import Image from "next/image"
import { siteNavigation } from "@/components/constants/navigation"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="relative px-16 py-4">
        {/* Center Navigation Container */}
        <div className="absolute left-1/2 top-4 transform -translate-x-1/2 bg-[#272727]/40 backdrop-blur-md rounded-full px-8 py-2">
          <nav className="flex items-center space-x-12">
                    {/* Navigation */}
            {siteNavigation.map((item, index) => (
              <a 
                key={index}
                href={item.href} 
                className="font-italianno text-2xl text-white/80 hover:text-[#C23FDC] transition-colors"
              >
                {item.title}
              </a>
            ))}
          </nav>
        </div>

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
            <span className="font-italianno text-3xl text-white">SketchDojo.ai</span>
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
    </header>
  );
}