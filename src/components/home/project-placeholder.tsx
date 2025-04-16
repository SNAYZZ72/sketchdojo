"use client";

import React, { useMemo } from 'react';

interface ProjectPlaceholderProps {
  id?: string;
  title?: string;
  className?: string;
  aspectRatio?: "video" | "square" | "wide" | "tall";
}

/**
 * A simple component that generates a colorful gradient background for project thumbnails
 * when no real images are available.
 */
export const ProjectPlaceholder: React.FC<ProjectPlaceholderProps> = ({
  id,
  title,
  className = "",
  aspectRatio = "video",
}) => {
  // Generate a pseudo-random gradient based on the id or title
  const gradient = useMemo(() => {
    const seed = id || title || Math.random().toString(36).substring(2, 8);
    
    // Generate color values using a hash of the seed
    const hash = Array.from(seed).reduce(
      (acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0
    );
    
    // Generate colors within the purple/blue palette to match SketchDojo theme
    const hue1 = 260 + (hash % 40); // Purple-blue range
    const hue2 = (hue1 + 40) % 360; // Complementary-ish within theme
    
    // Create color stops with proper saturation and lightness
    const color1 = `hsl(${hue1}, 80%, 50%)`;
    const color2 = `hsl(${hue2}, 70%, 40%)`;
    
    // Return linear gradient
    return `linear-gradient(135deg, ${color1}, ${color2})`;
  }, [id, title]);

  // Set aspect ratio based on prop
  const aspectRatioClass = useMemo(() => {
    switch (aspectRatio) {
      case "square": return "aspect-square";
      case "wide": return "aspect-[16/9]";
      case "tall": return "aspect-[9/16]";
      case "video":
      default: return "aspect-video";
    }
  }, [aspectRatio]);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${aspectRatioClass} ${className}`}
      style={{
        background: gradient,
      }}
    >
      {title && (
        <div className="text-white font-medium text-center p-4 bg-black/30 backdrop-blur-sm rounded-md">
          {title}
        </div>
      )}
      
      {/* Simple decorative elements */}
      <div className="absolute w-20 h-20 rounded-full bg-white/10 -top-10 -left-10 blur-xl"></div>
      <div className="absolute w-16 h-16 rounded-full bg-white/10 -bottom-8 -right-8 blur-lg"></div>
      
      {/* Manga style corner accents */}
      <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden opacity-40">
        <div className="absolute top-0 right-0 w-4 h-12 bg-white/30"></div>
        <div className="absolute top-0 right-0 w-12 h-4 bg-white/30"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-12 h-12 overflow-hidden opacity-40">
        <div className="absolute bottom-0 left-0 w-4 h-12 bg-white/30"></div>
        <div className="absolute bottom-0 left-0 w-12 h-4 bg-white/30"></div>
      </div>
    </div>
  );
};

export default ProjectPlaceholder;