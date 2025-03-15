"use client";

import { useEffect, useState } from "react";

/**
 * A hook that returns true if the current device is mobile.
 * It uses a simple window size check and defaults to false on the server.
 */
export function useIsMobile(): boolean {
  // Default to desktop (false) when rendering on the server
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window exists (client-side only)
    if (typeof window === "undefined") return;

    // Function to update state based on window width
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set the initial value
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
}