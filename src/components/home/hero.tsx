"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

// Sample prompt examples for the landing page
const promptExamples = [
  { id: 1, text: "Aventure futuriste", prompt: "Un samouraï cybernétique dans un Tokyo futuriste" },
  { id: 2, text: "Romance historique", prompt: "Une rencontre romantique dans le Japon féodal" },
  { id: 3, text: "Fantasy épique", prompt: "Un combat entre un ninja et un dragon ancestral" },
  { id: 4, text: "Slice of life", prompt: "Une journée tranquille dans un café de quartier" },
  { id: 5, text: "Action intense", prompt: "Un duel de sabre sous la pluie" }
];

// Component for the landing page prompt input
const PromptInput = () => {
  const [promptValue, setPromptValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptValue.trim()) return;
    
    setIsLoading(true);
    // Redirect to the proper authentication path in the studio/(auth) structure
    // This ensures the user is properly authenticated before accessing the studio
    window.location.href = "/studio/sign-in?redirect=studio&prompt=" + encodeURIComponent(promptValue);
    
    // Note: The authentication system will handle redirecting authenticated users
    // directly to the studio with their prompt
  };
  
  const selectExample = (prompt: string) => {
    setPromptValue(prompt);
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto animate-on-scroll">
      <form onSubmit={handlePromptSubmit} className="relative prompt-input">
        <Input
          type="text"
          placeholder="Décrivez votre idée de manga..."
          value={promptValue}
          onChange={(e) => setPromptValue(e.target.value)}
          className="w-full h-14 px-6 text-lg rounded-full border-2 border-sketchdojo-primary/30 bg-black/20 backdrop-blur-sm focus-visible:border-sketchdojo-primary focus-visible:ring-sketchdojo-primary/30"
        />
        <button 
          type="submit" 
          className="absolute right-2 top-2 bg-sketchdojo-primary hover:bg-sketchdojo-primary/90 text-white h-10 px-6 rounded-full transition-all duration-300 flex items-center justify-center"
          disabled={isLoading || !promptValue.trim()}
        >
          {isLoading ? (
            <span className="animate-pulse">Chargement...</span>
          ) : (
            <span>Créer</span>
          )}
        </button>
      </form>
      
      <div className="mt-6 flex flex-wrap gap-2 justify-center stagger-children">
        {promptExamples.map((example) => (
          <button
            key={example.id}
            onClick={() => selectExample(example.prompt)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm transition-all duration-300 animate-on-scroll"
          >
            {example.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export const Hero = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 py-32">
      <div className="container mx-auto text-center z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent animate-on-scroll">
          SketchDojo
        </h1>
        
        <h2 className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto animate-on-scroll">
          Votre assistant superhuman de création manga
        </h2>
        
        <PromptInput />
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-24 w-64 h-64 bg-sketchdojo-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-24 w-64 h-64 bg-sketchdojo-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-transparent to-black/80 opacity-50"></div>
      </div>
    </section>
  );
};