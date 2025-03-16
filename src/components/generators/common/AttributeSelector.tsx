import React from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { themeAwareStyles } from './theme-utils';

interface Option {
  value: string;
  label: string;
}

interface AttributeSelectorProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  maxHeight?: string;
}

const AttributeSelector: React.FC<AttributeSelectorProps> = ({
  label,
  options,
  value,
  onChange,
  className,
  placeholder = "Select option",
  maxHeight = "300px"
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label className={themeAwareStyles.form.label}>{label}</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger className="border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-gray-900 dark:text-white">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-background/90 border-gray-200 dark:border-white/20" style={{ maxHeight }}>
          {options.map(option => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="text-gray-800 dark:text-white/80 focus:text-gray-900 focus:bg-gray-100 dark:focus:text-white dark:focus:bg-white/10"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AttributeSelector;