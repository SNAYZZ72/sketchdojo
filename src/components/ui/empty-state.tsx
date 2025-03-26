"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  iconClassName?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  iconClassName,
}: EmptyStateProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed min-h-[200px]",
        "border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20",
        className
      )}
    >
      {icon && (
        <div className={cn("text-gray-400 dark:text-gray-600 mb-4", iconClassName)}>
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
        {title}
      </h3>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-4">
        {description}
      </p>
      
      {action && (
        <Button onClick={action.onClick} size="sm">
          {action.label}
        </Button>
      )}
    </div>
  )
}

interface EmptyStateImageProps extends EmptyStateProps {
  image?: string
  imageAlt?: string
}

export function EmptyStateImage({
  title,
  description,
  image,
  imageAlt = "Empty state illustration",
  action,
  className,
}: EmptyStateImageProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-lg min-h-[250px]",
        "bg-transparent",
        className
      )}
    >
      {image && (
        <div className="mb-6 max-w-[180px] w-full mx-auto">
          <img 
            src={image}
            alt={imageAlt}
            className="w-full h-auto"
          />
        </div>
      )}
      
      <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
        {description}
      </p>
      
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

interface EmptyGridProps {
  children: React.ReactNode
  columnCount?: number
  className?: string
}

export function EmptyGrid({
  children,
  columnCount = 3,
  className,
}: EmptyGridProps) {
  return (
    <div 
      className={cn(
        "grid gap-4",
        {
          "grid-cols-1 sm:grid-cols-2 md:grid-cols-3": columnCount === 3,
          "grid-cols-1 sm:grid-cols-2 md:grid-cols-4": columnCount === 4,
          "grid-cols-1 sm:grid-cols-2": columnCount === 2,
        },
        className
      )}
    >
      {children}
    </div>
  )
} 