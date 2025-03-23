"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Image as ImageIcon, 
  Paintbrush, 
  PenTool,
  Users, 
  Layout, 
  ArrowUpRight, 
  Book,
  Mic,
  Languages,
  Maximize,
  Layers,
  PanelTop,
  Search
} from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  category: "creation" | "enhancement" | "management";
  isNew?: boolean;
  isBeta?: boolean;
}

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");
  
  const tools: Tool[] = [
    {
      id: "image-generator",
      name: "Image Generator",
      description: "Create stunning manga-style images using text prompts.",
      icon: <ImageIcon className="h-6 w-6" />,
      path: "/studio/tools/image-generator",
      category: "creation",
    },
    {
      id: "inpainting",
      name: "Inpainting",
      description: "Perfect your manga art by editing specific areas with AI assistance.",
      icon: <Paintbrush className="h-6 w-6" />,
      path: "/studio/tools/inpainting",
      category: "enhancement",
    },
    {
      id: "character-training",
      name: "Character Training",
      description: "Train AI to draw your characters consistently across different scenes.",
      icon: <Users className="h-6 w-6" />,
      path: "/studio/tools/character-training",
      category: "creation",
      isNew: true,
    },
    {
      id: "layout-creator",
      name: "Layout Creator",
      description: "Create professional manga page layouts with customizable panels.",
      icon: <Layout className="h-6 w-6" />,
      path: "/studio/tools/layout-creator",
      category: "creation",
    },
    {
      id: "cover-design",
      name: "Cover Design",
      description: "Design eye-catching covers for your manga or comic books.",
      icon: <Book className="h-6 w-6" />,
      path: "/studio/tools/cover-design",
      category: "creation",
    },
    {
      id: "upscale",
      name: "Upscale",
      description: "Enhance image quality and resolution for publishing or printing.",
      icon: <Maximize className="h-6 w-6" />,
      path: "/studio/tools/upscale",
      category: "enhancement",
    },
    {
      id: "translation",
      name: "Translation",
      description: "Translate your manga to multiple languages while maintaining context.",
      icon: <Languages className="h-6 w-6" />,
      path: "/studio/tools/translation",
      category: "enhancement",
      isBeta: true,
    },
    {
      id: "voice-acting",
      name: "Voice Acting",
      description: "Generate voice lines for your characters using AI voice synthesis.",
      icon: <Mic className="h-6 w-6" />,
      path: "/studio/tools/voice-acting",
      category: "enhancement",
      isBeta: true,
    },
    {
      id: "storyboard",
      name: "Storyboard",
      description: "Plan your manga scenes with an intuitive storyboarding system.",
      icon: <PanelTop className="h-6 w-6" />,
      path: "/studio/tools/storyboard",
      category: "creation",
    },
    {
      id: "chapters",
      name: "Chapters",
      description: "Organize and manage chapters and pages for your manga series.",
      icon: <Layers className="h-6 w-6" />,
      path: "/studio/tools/chapters",
      category: "management",
    },
    {
      id: "pose-creator",
      name: "Pose Creator",
      description: "Create dynamic character poses for your manga scenes.",
      icon: <PenTool className="h-6 w-6" />,
      path: "/studio/tools/pose-creator",
      category: "creation",
    },
  ];

  useEffect(() => {
    if (projectId) {
      const updatedTools = tools.map(tool => ({
        ...tool,
        path: `${tool.path}${tool.path.includes('?') ? '&' : '?'}project=${projectId}`
      }));
      setFilteredTools(updatedTools);
    } else {
      setFilteredTools(tools);
    }
  }, [projectId]);
  
  const [filteredTools, setFilteredTools] = useState<Tool[]>(tools);
  
  const displayedTools = filteredTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Creative Tools</h1>
          <p className="text-muted-foreground mt-1">
            {projectId 
              ? "Tools for your project - changes will be saved to your project" 
              : "Powerful AI-powered tools to enhance your manga creation workflow"}
          </p>
        </div>
        
        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tools..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList>
          <TabsTrigger value="all">All Tools</TabsTrigger>
          <TabsTrigger value="creation">Creation</TabsTrigger>
          <TabsTrigger value="enhancement">Enhancement</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {displayedTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTools.map((tool) => (
            <Card key={tool.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                    {tool.icon}
                  </div>
                  <div className="space-x-2">
                    {tool.isNew && (
                      <Badge variant="default" className="bg-green-500 hover:bg-green-600">New</Badge>
                    )}
                    {tool.isBeta && (
                      <Badge variant="outline" className="text-orange-500 border-orange-500">Beta</Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="mt-4">{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-3">
                <Link href={tool.path} className="w-full">
                  <Button className="w-full group">
                    Open Tool
                    <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No tools found</h2>
          <p className="text-muted-foreground">
            No tools match your search. Try adjusting your search terms.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
} 