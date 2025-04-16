"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { projectService } from '@/services/project-service';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ProjectTemplateCardProps {
  id: string;
  title: string;
  description: string;
  genre: string;
  artStyle: string;
  coverImageUrl?: string;
  onTemplateSelected?: () => void;
}

const ProjectTemplateCard: React.FC<ProjectTemplateCardProps> = ({
  id,
  title,
  description,
  genre,
  artStyle,
  coverImageUrl = '/placeholders/template-cover.jpg',
  onTemplateSelected,
}) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = React.useState(false);
  
  // Function to create project from template
  const createFromTemplate = async () => {
    try {
      setIsCreating(true);
      
      if (onTemplateSelected) {
        onTemplateSelected();
      }
      
      // Create new project based on template
      const result = await projectService.createProject({
        title: `${title} (Copy)`,
        description,
        metadata: {
          genre: genre as any,
          artStyle: artStyle as any,
          template_type: 'premade',
          template_id: id,
        },
      });
      
      if (result) {
        toast.success("Project created from template");
        router.push(`/studio/projects/${result.id}`);
      }
    } catch (error) {
      console.error("Error creating project from template:", error);
      toast.error("Failed to create project from template");
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image 
          src={coverImageUrl} 
          alt={title} 
          className="object-cover" 
          fill
        />
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="secondary">{artStyle}</Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <Badge variant="outline" className="mr-2">
          {genre}
        </Badge>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={createFromTemplate} 
          className="w-full"
          disabled={isCreating}
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : "Use Template"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectTemplateCard;