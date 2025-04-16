// src/app/(main)/studio/editor/[id]/components/ErrorState.tsx
import React from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  const router = useRouter();
  
  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 md:px-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.push('/studio/projects')} 
          className="flex items-center gap-2 border-white/20 hover:bg-white/5 hover:text-primary transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Button>
      </div>
      
      <Alert variant="destructive" className="my-8 border border-white/10 bg-white/5 backdrop-blur-sm">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || "Project not found"}
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-center mt-8">
        <Button onClick={() => router.push('/studio/projects')}>
          View All Projects
        </Button>
      </div>
    </div>
  );
}