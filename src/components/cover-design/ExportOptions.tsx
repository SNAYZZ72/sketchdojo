import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Download, 
  Loader2, 
  Save, 
  Share2, 
  FileImage, 
  File, 
  FileText, 
  Book
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ExportOptionsProps {
  onSave: (projectId?: string) => Promise<void>;
  onExport: (format: string) => void;
  isSaving: boolean;
  hasSelection: boolean;
}

const exportFormats = [
  { value: 'png', label: 'PNG Image', icon: FileImage },
  { value: 'jpg', label: 'JPG Image', icon: FileImage },
  { value: 'pdf', label: 'PDF File', icon: File },
  { value: 'psd', label: 'PSD (Photoshop)', icon: FileText },
];

// Sample projects for dropdown
const sampleProjects = [
  { id: 'project-1', title: 'Midnight Samurai' },
  { id: 'project-2', title: 'Cyber Academy' },
  { id: 'project-3', title: 'Dragon\'s Journey' },
];

export default function ExportOptions({ 
  onSave, 
  onExport, 
  isSaving, 
  hasSelection 
}: ExportOptionsProps) {
  const [exportFormat, setExportFormat] = useState('png');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [coverName, setCoverName] = useState('My Manga Cover');

  const handleExport = () => {
    onExport(exportFormat);
  };
  
  const handleSaveToProject = async () => {
    await onSave(selectedProject || undefined);
    setIsDialogOpen(false);
  };

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-md dark:bg-white/[0.02]">
      <CardContent className="p-4 space-y-6">
        <div>
          <h3 className="font-medium text-white mb-4">Export Options</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/80">Cover Name</Label>
              <Input
                value={coverName}
                onChange={(e) => setCoverName(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter a name for your cover"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white/80">Export Format</Label>
              <div className="grid grid-cols-2 gap-3">
                {exportFormats.map(format => {
                  const Icon = format.icon;
                  return (
                    <div 
                      key={format.value}
                      className={`
                        flex items-center gap-2 p-3 rounded-md cursor-pointer transition-colors
                        ${exportFormat === format.value 
                          ? 'bg-primary/10 border border-primary/30' 
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'}
                      `}
                      onClick={() => setExportFormat(format.value)}
                    >
                      <Icon className={exportFormat === format.value ? 'text-primary' : 'text-white/60'} />
                      <span className="text-sm text-white">{format.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-layers"
                className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="include-layers" className="text-sm text-white/80">Include Layers (for PSD format)</Label>
            </div>
            
            <div className="space-y-2 pt-4">
              <Button 
                variant="default"
                className="w-full gap-2 bg-gradient-to-r from-primary to-secondary"
                onClick={handleExport}
                disabled={!hasSelection}
              >
                <Download className="h-4 w-4" />
                Export Cover
              </Button>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="w-full gap-2 border-white/20 text-white hover:bg-white/10 mt-2"
                    disabled={!hasSelection}
                  >
                    <Save className="h-4 w-4" />
                    Save to Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background/95 border-white/20 text-white">
                  <DialogHeader>
                    <DialogTitle>Save Cover to Project</DialogTitle>
                    <DialogDescription className="text-white/60">
                      Select a project to save this cover to or save it to your library.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white/80">Project</Label>
                      <Select
                        value={selectedProject}
                        onValueChange={setSelectedProject}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent className="bg-background/90 border-white/20">
                          <SelectItem value="">My Library</SelectItem>
                          {sampleProjects.map(project => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white/80">Cover Name</Label>
                      <Input
                        value={coverName}
                        onChange={(e) => setCoverName(e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveToProject}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-primary to-secondary"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Cover
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline"
                className="w-full gap-2 border-white/20 text-white hover:bg-white/10"
                disabled={!hasSelection}
              >
                <Share2 className="h-4 w-4" />
                Share Cover
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Book className="h-4 w-4" />
            <span>Need help with your cover design? Switch to the AI Assistant tab for guidance.</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}