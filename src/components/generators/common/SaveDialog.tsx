import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Loader2 } from 'lucide-react';

interface Project {
  id: string;
  title: string;
}

interface FormState {
  name: string;
  description: string;
  projectId: string | null;
}

interface SaveDialogProps {
  contentType: 'character' | 'background';
  formState: FormState;
  setFormState: (state: FormState | ((prev: FormState) => FormState)) => void;
  isSaving: boolean;
  onSave: () => Promise<void>;
  projects: Project[];
  buttonVariant?: 'default' | 'secondary' | 'outline';
  buttonClassName?: string;
}

const SaveDialog: React.FC<SaveDialogProps> = ({
  contentType,
  formState,
  setFormState,
  isSaving,
  onSave,
  projects,
  buttonVariant = 'outline',
  buttonClassName = 'w-full',
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant={buttonVariant} 
          className={buttonClassName}
        >
          <Save className="h-4 w-4 mr-2" />
          Save {contentType === 'character' ? 'Character' : 'Background'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background/95 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle>Save {contentType === 'character' ? 'Character' : 'Background'}</DialogTitle>
          <DialogDescription className="text-white/60">
            Enter details to save this {contentType.toLowerCase()} to your collection.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor={`${contentType}-name`} className="text-white/80">
              Name <span className="text-red-400">*</span>
            </Label>
            <Input 
              id={`${contentType}-name`} 
              placeholder={`Enter a name for your ${contentType.toLowerCase()}`} 
              value={formState.name}
              onChange={e => setFormState((prev: FormState) => ({ ...prev, name: e.target.value }))}
              className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`${contentType}-description`} className="text-white/80">Description</Label>
            <Textarea 
              id={`${contentType}-description`} 
              placeholder={`Enter a description for your ${contentType.toLowerCase()}...`} 
              className="resize-none h-20 border-white/20 bg-white/5 text-white placeholder:text-white/40"
              value={formState.description}
              onChange={e => setFormState((prev: FormState) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="project-select" className="text-white/80">Add to Project (Optional)</Label>
            <Select 
              value={formState.projectId || "none"} 
              onValueChange={value => setFormState((prev: FormState) => ({ ...prev, projectId: value === "none" ? null : value }))}
            >
              <SelectTrigger id="project-select" className="border-white/20 bg-white/5 text-white">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent className="bg-background/90 border-white/20">
                <SelectItem 
                  value="none"
                  className="text-white/80 focus:text-white focus:bg-white/10"
                >
                  No Project
                </SelectItem>
                {projects.map(project => (
                  <SelectItem 
                    key={project.id} 
                    value={project.id}
                    className="text-white/80 focus:text-white focus:bg-white/10"
                  >
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={onSave} 
            disabled={isSaving || !formState.name}
            className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 border-0 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save {contentType === 'character' ? 'Character' : 'Background'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveDialog;