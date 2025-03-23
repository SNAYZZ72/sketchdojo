"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, Book, Plus, FileText, LayoutList, ArrowUpDown, MoreHorizontal, Eye, EyeOff, Edit, Copy, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

// Chapter types and interfaces
interface Chapter {
  id: string;
  title: string;
  description: string;
  status: "draft" | "in-progress" | "complete" | "published";
  pageCount: number;
  lastEdited: Date;
  order: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
  coverImage: string;
}

// Mock data for projects and chapters
const mockProjects: Project[] = [
  {
    id: "project-1",
    title: "The Mystic Journey",
    description: "A fantasy adventure about a young hero discovering magical powers.",
    coverImage: "/placeholder-cover.jpg",
    chapters: [
      {
        id: "chapter-1",
        title: "The Awakening",
        description: "Our protagonist discovers their hidden abilities.",
        status: "published",
        pageCount: 24,
        lastEdited: new Date("2023-03-10"),
        order: 1
      },
      {
        id: "chapter-2",
        title: "The First Challenge",
        description: "Facing the first major obstacle on the journey.",
        status: "complete",
        pageCount: 22,
        lastEdited: new Date("2023-03-15"),
        order: 2
      },
      {
        id: "chapter-3",
        title: "New Allies",
        description: "Meeting companions who will join the quest.",
        status: "in-progress",
        pageCount: 18,
        lastEdited: new Date("2023-03-20"),
        order: 3
      },
      {
        id: "chapter-4",
        title: "The Dark Forest",
        description: "Entering a dangerous area filled with unknown threats.",
        status: "draft",
        pageCount: 5,
        lastEdited: new Date("2023-03-22"),
        order: 4
      }
    ]
  },
  {
    id: "project-2",
    title: "Urban Shadows",
    description: "A noir detective story set in a cyberpunk future.",
    coverImage: "/placeholder-cover-2.jpg",
    chapters: [
      {
        id: "chapter-1-p2",
        title: "The Case",
        description: "A mysterious client brings an unusual case.",
        status: "published",
        pageCount: 28,
        lastEdited: new Date("2023-02-05"),
        order: 1
      },
      {
        id: "chapter-2-p2",
        title: "The Underworld",
        description: "Investigating leads in the criminal underworld.",
        status: "in-progress",
        pageCount: 15,
        lastEdited: new Date("2023-02-20"),
        order: 2
      }
    ]
  }
];

export default function ChaptersManagerTool() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(mockProjects[0].id);
  const [activeView, setActiveView] = useState<"list" | "grid">("list");
  const [activeTab, setActiveTab] = useState<string>("chapters");
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterDescription, setNewChapterDescription] = useState("");
  
  // Get selected project
  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  
  const statusColors = {
    draft: "text-slate-500 bg-slate-100 dark:bg-slate-800",
    "in-progress": "text-blue-500 bg-blue-100 dark:bg-blue-900",
    complete: "text-green-500 bg-green-100 dark:bg-green-900",
    published: "text-purple-500 bg-purple-100 dark:bg-purple-900"
  };
  
  const addNewChapter = () => {
    if (!newChapterTitle) return;
    
    const newChapter: Chapter = {
      id: `chapter-${Date.now()}`,
      title: newChapterTitle,
      description: newChapterDescription,
      status: "draft",
      pageCount: 0,
      lastEdited: new Date(),
      order: selectedProject.chapters.length + 1
    };
    
    const updatedProjects = projects.map(project => {
      if (project.id === selectedProjectId) {
        return {
          ...project,
          chapters: [...project.chapters, newChapter]
        };
      }
      return project;
    });
    
    setProjects(updatedProjects);
    setNewChapterTitle("");
    setNewChapterDescription("");
    setIsCreatingChapter(false);
  };
  
  const changeChapterStatus = (chapterId: string, newStatus: Chapter["status"]) => {
    const updatedProjects = projects.map(project => {
      if (project.id === selectedProjectId) {
        const updatedChapters = project.chapters.map(chapter => {
          if (chapter.id === chapterId) {
            return {
              ...chapter,
              status: newStatus,
              lastEdited: new Date()
            };
          }
          return chapter;
        });
        
        return {
          ...project,
          chapters: updatedChapters
        };
      }
      return project;
    });
    
    setProjects(updatedProjects);
  };
  
  const deleteChapter = (chapterId: string) => {
    const updatedProjects = projects.map(project => {
      if (project.id === selectedProjectId) {
        return {
          ...project,
          chapters: project.chapters.filter(chapter => chapter.id !== chapterId)
        };
      }
      return project;
    });
    
    setProjects(updatedProjects);
  };
  
  const duplicateChapter = (chapterId: string) => {
    const chapterToDuplicate = selectedProject.chapters.find(chapter => chapter.id === chapterId);
    
    if (chapterToDuplicate) {
      const newChapter: Chapter = {
        ...chapterToDuplicate,
        id: `chapter-${Date.now()}`,
        title: `${chapterToDuplicate.title} (Copy)`,
        status: "draft",
        lastEdited: new Date(),
        order: selectedProject.chapters.length + 1
      };
      
      const updatedProjects = projects.map(project => {
        if (project.id === selectedProjectId) {
          return {
            ...project,
            chapters: [...project.chapters, newChapter]
          };
        }
        return project;
      });
      
      setProjects(updatedProjects);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Chapters Manager</h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Select a project to manage
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[240px]">
                <div className="px-4 pb-4 space-y-1">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                        selectedProjectId === project.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedProjectId(project.id)}
                    >
                      <div className="font-medium truncate">{project.title}</div>
                      <div className="text-xs opacity-70 truncate">
                        {project.chapters.length} chapters
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full" disabled>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Project Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 py-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Chapters</span>
                  <span className="font-medium">{selectedProject.chapters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Published</span>
                  <span className="font-medium">
                    {selectedProject.chapters.filter(c => c.status === "published").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">In Progress</span>
                  <span className="font-medium">
                    {selectedProject.chapters.filter(c => c.status === "in-progress").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Pages</span>
                  <span className="font-medium">
                    {selectedProject.chapters.reduce((total, chapter) => total + chapter.pageCount, 0)}
                  </span>
                </div>
              </div>
              <Separator className="my-2" />
              <Button variant="ghost" className="w-full justify-start p-0 h-8" disabled>
                <Eye className="h-4 w-4 mr-2" />
                <span className="text-sm">View Project</span>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{selectedProject.title}</CardTitle>
                  <CardDescription>
                    {selectedProject.description}
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex border rounded-md overflow-hidden">
                    <Button
                      variant={activeView === "list" ? "default" : "ghost"}
                      size="sm"
                      className="h-8 px-2 rounded-none"
                      onClick={() => setActiveView("list")}
                    >
                      <LayoutList className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={activeView === "grid" ? "default" : "ghost"}
                      size="sm"
                      className="h-8 px-2 rounded-none"
                      onClick={() => setActiveView("grid")}
                    >
                      <div className="grid grid-cols-2 gap-0.5">
                        <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                        <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                        <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                        <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                      </div>
                    </Button>
                  </div>
                  
                  <Button onClick={() => setIsCreatingChapter(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Chapter
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-6">
                  <TabsList className="w-full justify-start mb-4 bg-transparent p-0 h-auto">
                    <TabsTrigger 
                      value="chapters" 
                      className="data-[state=active]:bg-muted px-3 py-1.5 h-auto rounded-md"
                    >
                      All Chapters
                    </TabsTrigger>
                    <TabsTrigger 
                      value="published" 
                      className="data-[state=active]:bg-muted px-3 py-1.5 h-auto rounded-md"
                    >
                      Published
                    </TabsTrigger>
                    <TabsTrigger 
                      value="drafts" 
                      className="data-[state=active]:bg-muted px-3 py-1.5 h-auto rounded-md"
                    >
                      Drafts
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="chapters" className="mt-0">
                  {isCreatingChapter ? (
                    <div className="px-6 py-4 border-b">
                      <h3 className="text-lg font-medium mb-4">Create New Chapter</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="chapter-title">Chapter Title</Label>
                          <Input 
                            id="chapter-title"
                            value={newChapterTitle}
                            onChange={(e) => setNewChapterTitle(e.target.value)}
                            placeholder="Enter chapter title..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="chapter-description">Description (optional)</Label>
                          <Textarea 
                            id="chapter-description"
                            value={newChapterDescription}
                            onChange={(e) => setNewChapterDescription(e.target.value)}
                            placeholder="Brief description of this chapter..."
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsCreatingChapter(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addNewChapter} disabled={!newChapterTitle}>
                            Create Chapter
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  
                  {activeView === "list" ? (
                    <div className="px-6 overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>Chapter</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Pages</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedProject.chapters.map((chapter) => (
                            <TableRow key={chapter.id}>
                              <TableCell className="font-medium">{chapter.order}</TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{chapter.title}</div>
                                  <div className="text-sm text-muted-foreground line-clamp-1">
                                    {chapter.description || "No description"}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline"
                                  className={statusColors[chapter.status]}
                                >
                                  {chapter.status.replace("-", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell>{chapter.pageCount}</TableCell>
                              <TableCell>
                                {chapter.lastEdited.toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Chapter
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => duplicateChapter(chapter.id)}>
                                      <Copy className="h-4 w-4 mr-2" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => changeChapterStatus(chapter.id, 
                                        chapter.status === "published" ? "complete" : "published")}
                                    >
                                      {chapter.status === "published" ? (
                                        <>
                                          <EyeOff className="h-4 w-4 mr-2" />
                                          Unpublish
                                        </>
                                      ) : (
                                        <>
                                          <Eye className="h-4 w-4 mr-2" />
                                          Publish
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="text-destructive focus:text-destructive"
                                      onClick={() => deleteChapter(chapter.id)}
                                    >
                                      <Trash className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedProject.chapters.map((chapter) => (
                        <Card key={chapter.id} className="overflow-hidden">
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{chapter.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {chapter.description || "No description"}
                                </p>
                              </div>
                              <Badge 
                                variant="outline"
                                className={statusColors[chapter.status]}
                              >
                                {chapter.status.replace("-", " ")}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center mt-4 text-sm">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>{chapter.pageCount} pages</span>
                                </div>
                                <div className="text-muted-foreground">
                                  Chapter {chapter.order}
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Chapter
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => duplicateChapter(chapter.id)}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => changeChapterStatus(chapter.id, 
                                      chapter.status === "published" ? "complete" : "published")}
                                  >
                                    {chapter.status === "published" ? (
                                      <>
                                        <EyeOff className="h-4 w-4 mr-2" />
                                        Unpublish
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="h-4 w-4 mr-2" />
                                        Publish
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => deleteChapter(chapter.id)}
                                  >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="published" className="mt-0">
                  <div className="px-6 py-4">
                    {selectedProject.chapters.filter(c => c.status === "published").length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedProject.chapters
                          .filter(c => c.status === "published")
                          .map((chapter) => (
                            <Card key={chapter.id} className="overflow-hidden">
                              <div className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{chapter.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      {chapter.description || "No description"}
                                    </p>
                                  </div>
                                  <Badge 
                                    variant="outline"
                                    className={statusColors[chapter.status]}
                                  >
                                    {chapter.status.replace("-", " ")}
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center mt-4 text-sm">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center">
                                      <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                                      <span>{chapter.pageCount} pages</span>
                                    </div>
                                    <div className="text-muted-foreground">
                                      Chapter {chapter.order}
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" className="h-8 px-2">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))
                        }
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Book className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                        <p className="text-muted-foreground mt-4">No published chapters yet</p>
                        <p className="text-sm text-muted-foreground mt-1">Publish chapters to see them here</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="drafts" className="mt-0">
                  <div className="px-6 py-4">
                    {selectedProject.chapters.filter(c => c.status === "draft").length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedProject.chapters
                          .filter(c => c.status === "draft")
                          .map((chapter) => (
                            <Card key={chapter.id} className="overflow-hidden">
                              <div className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{chapter.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      {chapter.description || "No description"}
                                    </p>
                                  </div>
                                  <Badge 
                                    variant="outline"
                                    className={statusColors[chapter.status]}
                                  >
                                    {chapter.status.replace("-", " ")}
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center mt-4 text-sm">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center">
                                      <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                                      <span>{chapter.pageCount} pages</span>
                                    </div>
                                    <div className="text-muted-foreground">
                                      Last edited: {chapter.lastEdited.toLocaleDateString()}
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" className="h-8 px-2">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))
                        }
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Book className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                        <p className="text-muted-foreground mt-4">No draft chapters</p>
                        <p className="text-sm text-muted-foreground mt-1">Create new chapters to see them here</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 