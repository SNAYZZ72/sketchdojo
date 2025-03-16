import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

interface ExportOption {
  value: string;
  label: string;
}

interface ExportDropdownProps {
  options: ExportOption[];
  onExport: (format: string) => void;
  disabled: boolean;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({
  options,
  onExport,
  disabled
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="text-gray-700 dark:text-white border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 gap-1"
          disabled={disabled}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-background/90 border-gray-200 dark:border-white/20">
        {options.map(format => (
          <DropdownMenuItem
            key={format.value}
            onClick={() => onExport(format.value)}
            disabled={disabled}
            className="text-gray-800 dark:text-white/80 focus:text-gray-900 focus:bg-gray-100 dark:focus:text-white dark:focus:bg-white/10 cursor-pointer"
          >
            {format.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDropdown;