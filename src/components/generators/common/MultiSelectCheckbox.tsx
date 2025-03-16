import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { themeAwareStyles } from './theme-utils';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectCheckboxProps {
  label: string;
  options: Option[];
  selectedValues: string[];
  onChange: (value: string) => void;
  maxVisibleOptions?: number;
  moreLabel?: string;
}

const MultiSelectCheckbox: React.FC<MultiSelectCheckboxProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  maxVisibleOptions = 8,
  moreLabel = "More Options"
}) => {
  const visibleOptions = options.slice(0, maxVisibleOptions);
  const hiddenOptions = options.slice(maxVisibleOptions);
  
  const isOptionSelected = (value: string) => {
    return selectedValues.includes(value);
  };

  return (
    <div className="space-y-2">
      <Label className={themeAwareStyles.form.label}>{label}</Label>
      
      <div className="grid grid-cols-2 gap-2 mt-2">
        {visibleOptions.map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox 
              id={`option-${option.value}`} 
              checked={isOptionSelected(option.value)}
              onCheckedChange={() => onChange(option.value)}
              className="border-gray-300 dark:border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label 
              htmlFor={`option-${option.value}`} 
              className="text-sm text-gray-700 dark:text-white/80"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
      
      {hiddenOptions.length > 0 && (
        <Accordion type="single" collapsible className="mt-2">
          <AccordionItem value="more-options" className="border-gray-200 dark:border-white/10">
            <AccordionTrigger className="text-xs text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white py-2">
              {moreLabel}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {hiddenOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`option-${option.value}`} 
                      checked={isOptionSelected(option.value)}
                      onCheckedChange={() => onChange(option.value)}
                      className="border-gray-300 dark:border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label 
                      htmlFor={`option-${option.value}`} 
                      className="text-sm text-gray-700 dark:text-white/80"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default MultiSelectCheckbox;