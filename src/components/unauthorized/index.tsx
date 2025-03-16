import Link from 'next/link';
import React from 'react';
import { LockIcon, HomeIcon, AlertTriangleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UnauthorizedProps {
  /** Custom title for the unauthorized message */
  title?: string;
  
  /** Custom description message */
  description?: string;
  
  /** Custom link text */
  linkText?: string;
  
  /** Custom link destination */
  linkHref?: string;
  
  /** Whether to show studio/company branding */
  showBranding?: boolean;
}

/**
 * A component to display when a user tries to access a page they're not authorized to view
 */
const Unauthorized: React.FC<UnauthorizedProps> = ({
  title = "Unauthorized Access",
  description = "You don't have permission to access this page. Please contact support or your studio owner for assistance.",
  linkText = "Return to Home",
  linkHref = "/",
  showBranding = true,
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-b from-sketchdojo-bg to-sketchdojo-bg-light">
      {/* Background elements */}
      <div className="absolute top-20 left-1/4 w-32 h-32 bg-sketchdojo-primary rounded-full filter blur-[100px] opacity-10"></div>
      <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-sketchdojo-accent rounded-full filter blur-[120px] opacity-10"></div>
      
      <div className="relative z-10 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6">
            <LockIcon className="h-10 w-10 text-red-500" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h1>
          
          <div className="flex items-center justify-center mb-4">
            <AlertTriangleIcon className="h-5 w-5 text-amber-500 mr-2" />
            <p className="text-amber-500 font-medium">
              Access Denied
            </p>
          </div>
          
          <p className="text-white/70 text-lg mb-8">
            {description}
          </p>
          
          <Link href={linkHref}>
            <Button 
              className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white px-8 py-2 rounded-full shadow-lg hover:shadow-sketchdojo-primary/30 transition-all duration-300"
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              {linkText}
            </Button>
          </Link>
        </div>
        
        {showBranding && (
          <div className="text-center mt-12">
            <p className="text-white/40 text-sm">
              SketchDojo.ai — Manage access in your account settings
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Unauthorized;