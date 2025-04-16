"use client";

import React, { useMemo } from 'react';

interface PlaceholderImageProps {
  title?: string;
  width?: string;
  height?: string;
  className?: string;
}

/**
 * A placeholder component that generates a colorful SVG gradient background
 * with optional title text. Use this in development until real images are available.
 */
export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  title,
  width = "100%",
  height = "100%",
  className = "",
}) => {
  // Generate a random gradient based on the title or a random seed
  const gradient = useMemo(() => {
    const seed = title || Math.random().toString(36).substring(2, 8);
    
    // Generate two colors based on the seed
    const colors = [
      `hsl(${(seed.charCodeAt(0) || 0) % 360}, 70%, 60%)`,
      `hsl(${(seed.charCodeAt(seed.length - 1) || 0) % 360}, 70%, 40%)`,
    ];
    
    return `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
  }, [title]);

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        background: gradient,
        width,
        height,
        overflow: 'hidden',
      }}
    >
      {title && (
        <div className="text-white font-medium text-center p-4 bg-black/30 backdrop-blur-sm rounded">
          {title}
        </div>
      )}
    </div>
  );
};

export default PlaceholderImage;