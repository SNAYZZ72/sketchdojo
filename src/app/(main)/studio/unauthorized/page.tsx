"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Unauthorized from '@/components/unauthorized';

/**
 * Enhanced Unauthorized Page Component
 * Displays an unauthorized message with an optional auto-redirect
 */
const UnauthorizedPage = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [redirecting, setRedirecting] = useState(true);
  
  // Auto redirect countdown
  useEffect(() => {
    if (!redirecting) return;
    
    if (countdown <= 0) {
      router.push('/');
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, redirecting, router]);
  
  return (
    <>
      <Unauthorized 
        title="Studio Access Restricted"
        description={
          redirecting
            ? `You don't have permission to access this area. Redirecting to home page in ${countdown} seconds...`
            : "You don't have permission to access this area. Contact your administrator for access."
        }
        linkText={redirecting ? "Go to Home Now" : "Return to Home"}
        showBranding={true}
      />
      
      {redirecting && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setRedirecting(false)}
            className="text-xs text-white/50 hover:text-white underline"
          >
            Stop redirect
          </button>
        </div>
      )}
    </>
  );
};

export default UnauthorizedPage;