"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import ProtectedRoute from '@/components/global/protected-route';

// Components
import CoverDesignInterface from '@/components/cover-design/CoverDesignInterface';

// Icons
import { Book, Settings, Image as ImageIcon } from 'lucide-react';

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CoverDesignPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const supabase = createClient();

  return (
    <ProtectedRoute>
      <div className="container max-w-full px-4 py-8">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Cover Designer <Badge variant="outline" className="text-xs ml-2 bg-primary/10 border-primary/20 text-primary">AI</Badge>
              </h1>
              <Button 
                variant="outline" 
                size="icon" 
                className="hover:border-primary hover:text-primary transition-colors duration-300"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-white/60 mb-8">
              Design professional manga covers with AI assistance. Describe what you want or start with a template.
            </p>
            
            <CoverDesignInterface />
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}