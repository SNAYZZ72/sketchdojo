import React from 'react';
import { motion } from "framer-motion";
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History } from 'lucide-react';

interface GenerationHistoryProps {
  history: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  generationParams: {
    width: number;
    height: number;
  };
  type: 'background' | 'character';
}

const GenerationHistory: React.FC<GenerationHistoryProps> = ({
  history,
  currentIndex,
  setCurrentIndex,
  generationParams,
  type
}) => {
  if (history.length <= 1) return null;

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-md dark:bg-white/[0.02] shadow-md overflow-hidden">
      <CardHeader className="pb-3 border-b border-white/10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-white">Generation History</CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10 gap-1 h-8"
          >
            <History className="h-4 w-4" />
            <span className="text-xs">View All</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
          <style jsx global>{`
            .scrollbar-thin::-webkit-scrollbar {
              height: 6px;
            }
            
            .scrollbar-thin::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.05);
              border-radius: 3px;
            }
            
            .scrollbar-thin::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 3px;
            }
            
            .scrollbar-thin::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.2);
            }
          `}</style>
          
          {history.map((imageUrl, index) => (
            <motion.div 
              key={index} 
              className={cn(
                "relative border rounded-md cursor-pointer group overflow-hidden transition-all duration-300",
                currentIndex === index 
                  ? "ring-2 ring-primary border-primary/50" 
                  : "border-white/10 hover:border-white/30",
                type === 'character' 
                  ? "min-w-[150px] h-[200px]" 
                  : "min-w-[200px] aspect-video"
              )}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end justify-start p-2">
                <div className="flex gap-1 items-center text-white/90">
                  <span className="text-xs">{index + 1}</span>
                </div>
              </div>
              
              <img 
                src={imageUrl} 
                alt={`Generated ${type} ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                width={generationParams.width}
                height={generationParams.height}
              />
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GenerationHistory;