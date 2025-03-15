"use client"

import React, { useState } from 'react'
import ProtectedRoute from '@/components/protected-route'
import { useAuth } from '@/providers/auth-provider'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Clock, Zap, Users, BookOpen, ImageIcon, Sparkles, ChevronRight } from 'lucide-react'

// UI Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

export default function StudioPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(73);
  
  // Mock data - would be replaced with actual data from your database
  const recentProjects = [
    { id: 1, title: "Midnight Samurai", cover: "/projects/project-1.jpg", updatedAt: "2 hours ago", progress: 65 },
    { id: 2, title: "Cyber Academy", cover: "/projects/project-2.jpg", updatedAt: "Yesterday", progress: 89 },
    { id: 3, title: "Dragon's Journey", cover: "/projects/project-3.jpg", updatedAt: "3 days ago", progress: 42 },
  ];
  
  const featuredTemplates = [
    { id: 1, title: "Shonen Action", image: "/templates/shonen.jpg", pages: 24 },
    { id: 2, title: "Romance", image: "/templates/romance.jpg", pages: 18 },
    { id: 3, title: "Horror", image: "/templates/horror.jpg", pages: 22 },
    { id: 4, title: "Sci-Fi", image: "/templates/scifi.jpg", pages: 20 },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Top header with user welcome */}
        <div className="relative bg-[#0F1729] py-6 md:py-10 mb-6 md:mb-8">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome to SketchDojo</h1>
                <p className="text-white/80 mt-1 md:mt-2">
                  Hello{user?.email ? `, ${user.email.split('@')[0]}` : ''}! Ready to create your manga?
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right text-sm text-white/80">
                  <p>Free Trial</p>
                  <p className="text-xs">5 credits remaining</p>
                </div>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground whitespace-nowrap">
                  Upgrade Plan
                </Button>
              </div>
            </div>
            
            {/* Floating action cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 md:mt-8">
              <Card className="bg-card/90 backdrop-blur border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
                <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
                  <div className="h-10 md:h-12 w-10 md:w-12 rounded-full bg-primary/20 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-primary/30 transition-colors">
                    <Plus className="h-5 md:h-6 w-5 md:w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">New Project</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">Start creating your manga</p>
                  <Button size="sm" className="w-full">Create Project</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-card/90 backdrop-blur hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
                  <div className="h-10 md:h-12 w-10 md:w-12 rounded-full bg-muted flex items-center justify-center mb-3 md:mb-4 group-hover:bg-muted/70 transition-colors">
                    <ImageIcon className="h-5 md:h-6 w-5 md:w-6 text-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Characters</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">Design & manage characters</p>
                  <Button variant="outline" size="sm" className="w-full">Open Characters</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-card/90 backdrop-blur hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
                  <div className="h-10 md:h-12 w-10 md:w-12 rounded-full bg-muted flex items-center justify-center mb-3 md:mb-4 group-hover:bg-muted/70 transition-colors">
                    <Sparkles className="h-5 md:h-6 w-5 md:w-6 text-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">AI Tools</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">Generate panels & scenes</p>
                  <Button variant="outline" size="sm" className="w-full">Access Tools</Button>
                </CardContent>
              </Card>
              
              <Card className="bg-card/90 backdrop-blur hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
                  <div className="h-10 md:h-12 w-10 md:w-12 rounded-full bg-muted flex items-center justify-center mb-3 md:mb-4 group-hover:bg-muted/70 transition-colors">
                    <BookOpen className="h-5 md:h-6 w-5 md:w-6 text-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Tutorials</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">Learn how to use tools</p>
                  <Button variant="outline" size="sm" className="w-full">View Tutorials</Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full bg-primary/40 blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-32 h-32 rounded-full bg-primary/30 blur-3xl"></div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="container px-4 mx-auto pb-20">
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="mb-6 md:mb-8 bg-muted/50 overflow-x-auto flex w-full no-scrollbar">
              <TabsTrigger value="projects">Your Projects</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>
            
            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6 md:space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold">Recent Projects</h2>
                <Button variant="link" className="flex items-center gap-1 p-0 h-auto">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              {recentProjects.length === 0 ? (
                <Card className="border-dashed border-2 border-muted">
                  <CardContent className="py-8 md:py-10 flex flex-col items-center justify-center">
                    <div className="rounded-full bg-muted w-12 md:w-16 h-12 md:h-16 flex items-center justify-center mb-4">
                      <ImageIcon className="h-6 md:h-8 w-6 md:w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg md:text-xl font-medium mb-2">No projects yet</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-sm mb-4 md:mb-6">
                      Start creating your first manga project and it will appear here.
                    </p>
                    <Button>Create Your First Project</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {recentProjects.map((project) => (
                    <Card key={project.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                      <div className="relative h-36 md:h-48 w-full bg-muted">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="h-10 md:h-12 w-10 md:w-12 text-muted-foreground/50" />
                        </div>
                        {/* Placeholder for actual project cover images */}
                        {/* <Image src={project.cover} alt={project.title} fill className="object-cover" /> */}
                      </div>
                      <CardHeader className="pb-2 px-4 pt-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base md:text-lg group-hover:text-primary transition-colors">
                            {project.title}
                          </CardTitle>
                          <Badge variant="secondary" className="text-xs">In Progress</Badge>
                        </div>
                        <CardDescription className="text-xs md:text-sm">Updated {project.updatedAt}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 px-4">
                        <div className="flex justify-between items-center text-xs md:text-sm mb-1">
                          <span>Completion</span>
                          <span className="text-primary">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-1" />
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2 px-4 pb-4">
                        <Button variant="ghost" size="sm" className="text-xs h-8">Preview</Button>
                        <Button size="sm" className="text-xs h-8">Continue</Button>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  {/* Create New Project Card */}
                  <Card className="overflow-hidden border-dashed border-2 group hover:border-primary/50 transition-all duration-300">
                    <CardContent className="h-full flex flex-col items-center justify-center p-4 md:p-6">
                      <div className="rounded-full bg-muted w-12 md:w-16 h-12 md:h-16 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-primary/20 transition-colors">
                        <Plus className="h-6 md:h-8 w-6 md:w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <h3 className="text-lg md:text-xl font-medium mb-2 text-center">Create New Project</h3>
                      <p className="text-xs md:text-sm text-muted-foreground text-center max-w-sm mb-4 md:mb-6">
                        Start from scratch or use a template
                      </p>
                      <Button>New Project</Button>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Usage Stats */}
              <div className="mt-8 md:mt-12">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Usage Stats</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  <Card>
                    <CardHeader className="pb-2 px-4 pt-4">
                      <CardTitle className="text-sm md:text-md font-medium flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" /> Credits Remaining
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4">
                      <div className="flex items-end gap-2">
                        <span className="text-2xl md:text-3xl font-bold">5</span>
                        <span className="text-xs md:text-sm text-muted-foreground mb-1">/ 5 monthly</span>
                      </div>
                      <Progress value={100} className="h-1 mt-2" />
                    </CardContent>
                    <CardFooter className="px-4 pb-4">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        Upgrade for More
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2 px-4 pt-4">
                      <CardTitle className="text-sm md:text-md font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" /> Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs md:text-sm space-y-2 px-4">
                      <div className="flex justify-between items-center">
                        <span>Character generated</span>
                        <span className="text-muted-foreground">2h ago</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Project created</span>
                        <span className="text-muted-foreground">1d ago</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Page edited</span>
                        <span className="text-muted-foreground">3d ago</span>
                      </div>
                    </CardContent>
                    <CardFooter className="px-4 pb-4">
                      <Button variant="ghost" size="sm" className="w-full text-xs">
                        View All Activity
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2 px-4 pt-4">
                      <CardTitle className="text-sm md:text-md font-medium flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" /> Community
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs md:text-sm px-4">
                      <p className="mb-3 md:mb-4">Join our community of manga creators to share tips and get inspired!</p>
                      <div className="flex -space-x-2 mb-2">
                        <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-primary/20"></div>
                        <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-blue-500/20"></div>
                        <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-green-500/20"></div>
                        <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-yellow-500/20"></div>
                        <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-muted flex items-center justify-center text-xs">+24</div>
                      </div>
                    </CardContent>
                    <CardFooter className="px-4 pb-4">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        Join Community
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Templates Tab */}
            <TabsContent value="templates">
              <div className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Manga Templates</h2>
                <p className="text-sm text-muted-foreground">Start your project with professional templates</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {featuredTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="relative h-36 md:h-48 w-full bg-muted">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-10 md:h-12 w-10 md:w-12 text-muted-foreground/50" />
                      </div>
                      {/* Placeholder for actual template images */}
                      {/* <Image src={template.image} alt={template.title} fill className="object-cover" /> */}
                    </div>
                    <CardHeader className="pb-2 px-4 pt-4">
                      <CardTitle className="text-base md:text-lg group-hover:text-primary transition-colors">
                        {template.title}
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">{template.pages} pages</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-2 px-4 pb-4">
                      <Button size="sm" className="w-full text-xs h-8">Use Template</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Community Tab */}
            <TabsContent value="community">
              <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center">
                <div className="h-16 md:h-20 w-16 md:w-20 rounded-full bg-muted flex items-center justify-center mb-4 md:mb-6">
                  <Users className="h-8 md:h-10 w-8 md:w-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">Community Coming Soon</h2>
                <p className="text-sm text-muted-foreground max-w-md mb-6 md:mb-8">
                  We're working on building an amazing community space for manga creators. Stay tuned!
                </p>
                <Button>Get Notified</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}