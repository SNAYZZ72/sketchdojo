import React from 'react';
import { cn } from '@/lib/utils';

interface TextGradientProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'fire' | 'ocean' | 'galaxy';
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
}

const gradientClasses = {
  primary: 'bg-gradient-to-br from-primary to-purple-700',
  secondary: 'bg-gradient-to-br from-blue-500 to-purple-600',
  tertiary: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500',
  fire: 'bg-gradient-to-r from-orange-400 via-amber-500 to-red-600',
  ocean: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600',
  galaxy: 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500',
};

export function TextGradient({
  children,
  className,
  variant = 'primary',
  as: Component = 'span',
  ...props
}: TextGradientProps) {
  return (
    <Component
      className={cn(
        'bg-clip-text text-transparent animate-gradient bg-size-200',
        gradientClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
} 