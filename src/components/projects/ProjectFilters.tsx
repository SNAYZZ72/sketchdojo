"use client";

import React from 'react';
import { Check, ChevronsUpDown, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from '@/components/ui/badge';
import { 
  genreOptions, 
  projectStatusOptions, 
  projectSortOptions 
} from '@/components/constants/projects';
import { ProjectFilters } from '@/types/projects';

interface ProjectFiltersComponentProps {
  filters: ProjectFilters;
  setFilters: (filters: ProjectFilters) => void;
  onSubmit?: () => void;
}

const ProjectFiltersComponent: React.FC<ProjectFiltersComponentProps> = ({
  filters,
  setFilters,
  onSubmit,
}) => {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState(filters.search || '');
  
  // Handle input search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  
  // Submit search when Enter key is pressed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setFilters({ ...filters, search: searchValue });
      if (onSubmit) onSubmit();
    }
  };
  
  // Submit search button click
  const handleSearchSubmit = () => {
    setFilters({ ...filters, search: searchValue });
    if (onSubmit) onSubmit();
  };
  
  // Clear search
  const handleClearSearch = () => {
    setSearchValue('');
    setFilters({ ...filters, search: '' });
    if (onSubmit) onSubmit();
  };
  
  // Handle filter change
  const handleFilterChange = (key: keyof ProjectFilters, value: any) => {
    setFilters({ ...filters, [key]: value });
    if (onSubmit) onSubmit();
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: searchValue, // keep the search
      sortBy: 'updated_at',
      sortDirection: 'desc',
    });
    if (onSubmit) onSubmit();
  };
  
  // Count active filters (excluding search, sort)
  const activeFiltersCount = [
    filters.status,
    filters.genre,
  ].filter(Boolean).length;
  
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search projects..."
            value={searchValue}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            className="w-full"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-8 top-0 h-full"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={handleSearchSubmit}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-search"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[150px] justify-between">
                <div className="flex items-center gap-1">
                  <Filter className="h-4 w-4 mr-1" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-1 bg-primary text-primary-foreground text-xs h-5 px-1 rounded-full">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </div>
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0" align="end">
              <Command>
                <CommandList>
                  <CommandGroup heading="Status">
                    <CommandItem 
                      onSelect={() => handleFilterChange('status', undefined)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span>All Statuses</span>
                      {!filters.status && <Check className="h-4 w-4" />}
                    </CommandItem>
                    {projectStatusOptions.map(status => (
                      <CommandItem
                        key={status.value}
                        onSelect={() => handleFilterChange('status', status.value)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center">
                          <div className={`h-2 w-2 rounded-full ${status.bgColor} mr-2`} />
                          <span>{status.label}</span>
                        </div>
                        {filters.status === status.value && <Check className="h-4 w-4" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  
                  <CommandSeparator />
                  
                  <CommandGroup heading="Genre">
                    <CommandItem 
                      onSelect={() => handleFilterChange('genre', undefined)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span>All Genres</span>
                      {!filters.genre && <Check className="h-4 w-4" />}
                    </CommandItem>
                    <CommandInput placeholder="Search genres..." />
                    <CommandEmpty>No genres found.</CommandEmpty>
                    {genreOptions.map(genre => (
                      <CommandItem
                        key={genre.value}
                        onSelect={() => handleFilterChange('genre', genre.value)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <span>{genre.label}</span>
                        {filters.genre === genre.value && <Check className="h-4 w-4" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  
                  <CommandSeparator />
                  
                  <CommandGroup heading="Sort">
                    {projectSortOptions.map(option => (
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          // Toggle sort direction if selecting the same field
                          if (filters.sortBy === option.value) {
                            handleFilterChange('sortDirection', 
                              filters.sortDirection === 'asc' ? 'desc' : 'asc'
                            );
                          } else {
                            // Set new sort field with default desc direction
                            handleFilterChange('sortBy', option.value);
                            handleFilterChange('sortDirection', 'desc');
                          }
                        }}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <span>{option.label}</span>
                        {filters.sortBy === option.value && (
                          <div className="flex items-center">
                            <span className="text-xs mr-1">
                              {filters.sortDirection === 'asc' ? 'Asc' : 'Desc'}
                            </span>
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
                
                <CommandSeparator />
                
                <div className="p-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full text-xs"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.status && (
            <Badge variant="outline" className="flex gap-1 items-center">
              Status: {projectStatusOptions.find(s => s.value === filters.status)?.label}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => handleFilterChange('status', undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.genre && (
            <Badge variant="outline" className="flex gap-1 items-center">
              Genre: {genreOptions.find(g => g.value === filters.genre)?.label}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => handleFilterChange('genre', undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.sortBy && (
            <Badge variant="outline" className="flex gap-1 items-center">
              Sort: {projectSortOptions.find(o => o.value === filters.sortBy)?.label} 
              ({filters.sortDirection === 'asc' ? 'Asc' : 'Desc'})
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => {
                  handleFilterChange('sortBy', 'updated_at');
                  handleFilterChange('sortDirection', 'desc');
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectFiltersComponent;