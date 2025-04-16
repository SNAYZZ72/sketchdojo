"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { Project } from '@/types/projects';
import ProjectForm from './ProjectForm';

interface CreateProjectModalProps {
  trigger?: React.ReactNode;
  onProjectCreated?: (project: Project) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  trigger,
  onProjectCreated,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}) => {
  // Use internal state if not controlled externally
  const [internalOpen, setInternalOpen] = React.useState(false);
  
  // Determine if the component is controlled
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  
  // Use the appropriate state and setter
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;
  
  // Handle project creation success
  const handleSuccess = (project: Project) => {
    setOpen(false);
    if (onProjectCreated) {
      onProjectCreated(project);
    }
  };
  
  // Default trigger if none provided
  const defaultTrigger = (
    <Button className="flex items-center gap-2">
      <Plus className="h-4 w-4" /> New Project
    </Button>
  );
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          {defaultTrigger}
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Set up your new manga project and start creating
          </DialogDescription>
        </DialogHeader>
        
        <ProjectForm 
          mode="create"
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
          submitLabel="Create Project"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;