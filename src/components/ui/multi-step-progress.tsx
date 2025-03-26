"use client"

import * as React from "react"
import { Check, CircleDot } from "lucide-react"
import { cn } from "@/lib/utils"

interface MultiStepProgressProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function MultiStepProgress({
  steps,
  currentStep,
  className,
}: MultiStepProgressProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop progress indicator */}
      <div className="hidden md:flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const isActive = currentStep === index
          const isCompleted = currentStep > index
          
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div 
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 mb-2 transition-all",
                    isCompleted ? "bg-primary border-primary text-primary-foreground" :
                    isActive ? "border-primary text-primary" : 
                    "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span 
                  className={cn(
                    "text-sm font-medium",
                    isActive || isCompleted ? "text-primary" : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {step}
                </span>
              </div>
              
              {/* Line between steps */}
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "h-0.5 flex-1 mx-2",
                    index < currentStep ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
      
      {/* Mobile progress indicator */}
      <div className="flex md:hidden flex-col mb-6">
        <div className="flex items-center mb-4">
          {steps.map((_, index) => {
            const isActive = currentStep === index
            const isCompleted = currentStep > index
            
            return (
              <React.Fragment key={index}>
                <div 
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isCompleted ? "bg-primary" :
                    isActive ? "bg-primary ring-2 ring-primary/30" : 
                    "bg-gray-300 dark:bg-gray-600"
                  )}
                />
                
                {/* Line between steps */}
                {index < steps.length - 1 && (
                  <div 
                    className={cn(
                      "h-0.5 flex-1 mx-1",
                      index < currentStep ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                    )}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
        
        <div className="text-center">
          <span className="text-sm font-medium text-primary">
            {steps[currentStep]} ({currentStep + 1}/{steps.length})
          </span>
        </div>
      </div>
    </div>
  )
} 