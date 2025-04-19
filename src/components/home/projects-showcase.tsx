"use client";

import React, { useState, useEffect } from 'react';
import { ProjectCard } from './project-card';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Filter, LayoutGrid } from 'lucide-react';
import { SAMPLE_PROJECTS, getProjects, Project } from '@/components/constants/projects-data';

// Filter types for the project showcase
type FilterType = 'my-projects' | 'latest' | 'featured';

export const ProjectsShowcase = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('my-projects');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  // State to hold the projects, initialized with empty array
  const [projects, setProjects] = useState<Project[]>([]);
  // Loading state for initial data fetch
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch projects on component mount
  useEffect(() => {
    // Get projects from localStorage via our getProjects function
    const userProjects = getProjects();
    
    // If we have user projects, use those; otherwise fall back to sample data
    if (userProjects.length > 0) {
      setProjects(userProjects);
    } else {
      setProjects(SAMPLE_PROJECTS);
    }
    
    setIsLoading(false);
  }, []);
  
  // Get unique project types for filtering
  const projectTypes = Array.from(
    new Set(projects.map(project => project.type))
  ).filter(Boolean) as string[];
  
  // Function to filter projects based on the selected filters
  const getFilteredProjects = () => {
    let filtered = [...projects];
    
    // Apply main filter (my-projects, latest, featured)
    switch (activeFilter) {
      case 'my-projects':
        // Show all user projects
        filtered = projects;
        break;
      case 'latest':
        // Sort by most recent first using actual timestamps
        filtered = [...projects].sort((a, b) => b.updatedAt - a.updatedAt);
        break;
      case 'featured':
        filtered = projects.filter(project => project.featured);
        // If no featured projects, show most recent
        if (filtered.length === 0 && projects.length > 0) {
          filtered = [...projects].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3);
        }
        break;
    }
    
    // Apply type filter if selected
    if (selectedType) {
      filtered = filtered.filter(project => project.type === selectedType);
    }
    
    return filtered;
  };

  const filteredProjects = getFilteredProjects();
  
  // Toggle type filter
  const toggleTypeFilter = (type: string) => {
    if (selectedType === type) {
      setSelectedType(null); // Clear filter if already selected
    } else {
      setSelectedType(type); // Set new filter
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-20 -mt-1 relative bg-[#080808]" id="projects">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-sketchdojo-primary/30 border-t-sketchdojo-primary rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 -mt-1 relative bg-[#080808]" id="projects">
      {/* Enhanced Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Section transition gradient - smoothly blends with hero section */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent z-10"></div>
        
        {/* Dynamic animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/20 animate-gradient-slow"></div>
        
        {/* Large primary glow effect */}
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-sketchdojo-primary/20 rounded-full blur-3xl opacity-60 animate-pulse-slow"></div>
        
        {/* Secondary glow effect */}
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-sketchdojo-accent/20 rounded-full blur-3xl opacity-60 animate-pulse-slow animation-delay-1000"></div>
        
        {/* Tertiary glow spots */}
        <div className="absolute top-1/3 left-10 w-32 h-32 bg-purple-600/20 rounded-full blur-xl opacity-50 animate-float"></div>
        <div className="absolute bottom-1/4 right-16 w-40 h-40 bg-blue-500/20 rounded-full blur-xl opacity-40 animate-float animation-delay-2000"></div>
        
        {/* Small accent particles */}
        <div className="absolute top-1/4 right-1/3 w-6 h-6 bg-sketchdojo-primary/30 rounded-full blur-sm opacity-70 animate-float animation-delay-500"></div>
        <div className="absolute bottom-1/3 left-1/5 w-4 h-4 bg-sketchdojo-accent/40 rounded-full blur-sm opacity-60 animate-float animation-delay-1500"></div>
        <div className="absolute top-2/3 right-1/5 w-8 h-8 bg-purple-400/30 rounded-full blur-sm opacity-70 animate-float animation-delay-3000"></div>
        
        {/* Radial gradient for depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-transparent to-black/90 opacity-80"></div>
        
        {/* Subtle manga-style line pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-30 mix-blend-overlay"></div>
        
        {/* Noise texture for film grain effect */}
        <div className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-5 mix-blend-overlay"></div>
        
        {/* Optional: subtle horizontal lines like manga panels */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent bg-size-200 opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center mb-12">
          {/* Improved title with animated gradient and glow effect */}
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-sketchdojo-primary via-white to-sketchdojo-accent animate-gradient relative">
            <span className="absolute -inset-1 bg-sketchdojo-primary/10 blur-xl rounded-full opacity-75"></span>
            <span className="relative">Discover Manga Projects</span>
          </h2>
          
          <p className="text-white/80 text-center max-w-2xl mb-8 text-base md:text-lg">
            Explore a variety of AI-powered manga projects created by our community and get inspired for your next creation
          </p>
          
          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <FilterButton 
              label="My Projects" 
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              }
              isActive={activeFilter === 'my-projects'} 
              onClick={() => setActiveFilter('my-projects')}
              count={projects.length}
            />
            <FilterButton 
              label="Latest" 
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              }
              isActive={activeFilter === 'latest'} 
              onClick={() => setActiveFilter('latest')}
              count={projects.length}
            />
            <FilterButton 
              label="Featured" 
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              }
              isActive={activeFilter === 'featured'} 
              onClick={() => setActiveFilter('featured')}
              count={projects.filter(p => p.featured).length}
            />
            <FilterButton 
              label={showFilters ? "Hide Filters" : "More Filters"} 
              icon={<Filter className="w-4 h-4" />}
              isActive={showFilters} 
              onClick={() => setShowFilters(!showFilters)} 
            />
          </div>
          
          {/* Additional type filters */}
          <AnimatePresence>
            {showFilters && projectTypes.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap justify-center gap-2 mb-8 bg-white/5 rounded-xl p-4 w-full max-w-2xl"
              >
              <div className="w-full text-center mb-2 text-white/70 text-sm">Filter by Type</div>
              <div className="flex flex-wrap justify-center gap-2">
                {projectTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleTypeFilter(type)}
                    className={`px-3 py-1.5 rounded-full text-xs capitalize transition-all duration-300 ${
                      selectedType === type 
                        ? 'bg-sketchdojo-primary text-white' 
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
                {selectedType && (
                  <button
                    onClick={() => setSelectedType(null)}
                    className="px-3 py-1.5 rounded-full text-xs text-white/70 hover:text-white bg-transparent border border-white/20 hover:border-white/40 transition-all duration-300"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Projects grid with count */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <p className="text-white/60 text-sm">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
            </p>
            
            {/* Optional sorting dropdown could go here */}
          </div>
          
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  imageUrl={project.imageUrl}
                  lastEdited={project.lastEdited}
                  href={project.href}
                  featured={project.featured}
                  type={project.type}
                />
              ))}
            </div>
          ) : (
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-12 text-center border border-white/10">
              <div className="inline-block p-6 rounded-full bg-white/5 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                  <line x1="7" y1="2" x2="7" y2="22" />
                  <line x1="17" y1="2" x2="17" y2="22" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <line x1="2" y1="7" x2="7" y2="7" />
                  <line x1="2" y1="17" x2="7" y2="17" />
                  <line x1="17" y1="17" x2="22" y2="17" />
                  <line x1="17" y1="7" x2="22" y2="7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No projects found</h3>
              <p className="text-white/60 max-w-md mx-auto mb-6">
                We couldn&apos;t find any projects matching your current filters. Try adjusting your filters or create a new project.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button 
                  onClick={() => {
                    setActiveFilter('my-projects');
                    setSelectedType(null);
                  }} 
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-md transition-colors"
                >
                  Clear filters
                </button>
                <a 
                  href="/studio/chat" 
                  className="px-4 py-2 bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white rounded-md hover:shadow-lg hover:shadow-sketchdojo-primary/20 transition-all"
                >
                  Create new project
                </a>
              </div>
            </div>
          )}
        </div>
        
        {/* View all projects button */}
        <div className="flex justify-center mt-12">
          <a 
            href="/studio/chat" 
            className="relative flex items-center gap-2 py-3 px-8 rounded-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white font-medium transition-all duration-300 group hover:shadow-lg hover:shadow-sketchdojo-primary/30 hover:-translate-y-0.5"
          >
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent opacity-50 blur-sm animate-pulse"></span>
            <LayoutGrid className="w-4 h-4 relative z-10" />
            <span className="relative z-10">View All Projects</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
};

// FilterButton component with count badge
interface FilterButtonProps {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    count?: number; // Made explicitly optional with ?
  }

const FilterButton = ({ label, icon, isActive, onClick, count }: FilterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white shadow-lg shadow-sketchdojo-primary/20' 
          : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
      }`}
    >
      {icon}
      {label}
      {count !== undefined && (
        <span className={`inline-flex items-center justify-center w-5 h-5 text-xs rounded-full ${
          isActive 
            ? 'bg-white/20 text-white' 
            : 'bg-white/10 text-white/70'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
};