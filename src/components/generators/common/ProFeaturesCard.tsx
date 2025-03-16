import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ProFeaturesCardProps {
  type: 'character' | 'background';
  features: string[];
  className?: string;
}

const ProFeaturesCard: React.FC<ProFeaturesCardProps> = ({ 
  type, 
  features,
  className
}) => {
  return (
    <Card className={`border border-white/10 bg-gradient-to-r from-background to-background/90 overflow-hidden relative ${className}`}>
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
      
      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Upgrade to Pro</h3>
            </div>
            <p className="text-white/80 mb-4">Unlock advanced features to create even more amazing {type}s:</p>
            
            <ul className="space-y-2 mb-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-5 w-5 flex-shrink-0 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-white/80">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 border-0 text-white gap-2"
            >
              Upgrade to Pro
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-shrink-0 w-full max-w-[200px] mx-auto md:mx-0">
            <div className="aspect-square rounded-xl overflow-hidden border-2 border-white/20 shadow-xl relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
              <img 
                src={`https://source.unsplash.com/random/400x400/?anime,${type},pro`}
                alt={`Pro ${type} example`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-2 py-1 rounded-full">
                PRO
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProFeaturesCard;