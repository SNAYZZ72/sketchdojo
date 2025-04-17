"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StudioPage() {
  const router = useRouter();
  
  // Redirect to main page after a brief delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/studio");
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [router]);
  
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-sketchdojo-primary animate-pulse mr-3"></div>
        <div className="text-xl font-medium">Loading SketchDojo Studio...</div>
      </div>
    </div>
  );
} 