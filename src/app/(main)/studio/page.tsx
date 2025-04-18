"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function StudioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Redirect to main page after a brief delay, preserving any query parameters
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Check if there's a prompt parameter in the URL
      const promptParam = searchParams.get('prompt');
      
      // Redirect to the chat interface, forwarding the prompt parameter if it exists
      if (promptParam) {
        router.push(`/studio/chat?prompt=${encodeURIComponent(promptParam)}`);
      } else {
        router.push("/studio/chat");
      }
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [router, searchParams]);
  
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-sketchdojo-primary animate-pulse mr-3"></div>
        <div className="text-xl font-medium">Loading SketchDojo Studio...</div>
      </div>
    </div>
  );
} 