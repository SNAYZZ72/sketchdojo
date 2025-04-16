"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RefreshCw, Clock } from 'lucide-react';
import { ProjectPlaceholder } from './project-placeholder';

export interface ProjectCardProps {
  id: string;
  title: string;
  imageUrl: string;
  lastEdited: string;
  href: string;
  featured?: boolean;
  type?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  imageUrl,
  lastEdited,
  href,
  featured = false,
  type
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-lg overflow-hidden bg-black/40 border border-white/10 hover:border-sketchdojo-primary/30 shadow-md hover:shadow-lg hover:shadow-sketchdojo-primary/20 transition-all duration-300"
    >
      <Link href={href} className="block">
        <div className="relative aspect-video w-full overflow-hidden">
          {/* Gradients and overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
          
          {/* Featured badge */}
          {featured && (
            <div className="absolute top-3 left-3 z-20 bg-sketchdojo-primary text-white text-xs px-2 py-1 rounded-full">
              Featured
            </div>
          )}
          
          {/* Type badge */}
          {type && (
            <div className="absolute top-3 right-3 z-20 bg-black/50 text-white/80 text-xs px-2 py-1 rounded-full backdrop-blur-sm border border-white/10 capitalize">
              {type}
            </div>
          )}
          
          {/* Image with fallback */}
          {imageUrl && !imageUrl.includes('undefined') ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <ProjectPlaceholder 
              id={id} 
              title=""
              aspectRatio="video"
            />
          )}
          
          {/* Processing state (uncomment if needed) */}
          {/* {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
              <RefreshCw className="w-8 h-8 text-sketchdojo-primary animate-spin" />
              <span className="ml-2 text-white">Processing...</span>
            </div>
          )} */}
        </div>
        
        {/* Project info */}
        <div className="p-4">
          <h3 className="text-white font-medium truncate group-hover:text-sketchdojo-primary transition-colors">
            {title}
          </h3>
          <p className="text-white/60 text-xs mt-1 flex items-center">
            <Clock className="w-3 h-3 mr-1 inline" />
            {lastEdited}
          </p>
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-sketchdojo-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </Link>
    </motion.div>
  );
};