import React from 'react';
import { cn } from '@/lib/utils';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hero' | 'gradient';
  gradientFrom?: string;
  gradientTo?: string;
  fullWidth?: boolean;
  hover?: boolean;
}

export function BentoCard({
  children,
  className,
  variant = 'default',
  gradientFrom,
  gradientTo,
  fullWidth = false,
  hover = true,
}: BentoCardProps) {
  const baseStyles = 'rounded-3xl p-6 transition-all duration-300';
  
  const variantStyles = {
    default: 'bg-white shadow-sm border border-border/40',
    hero: 'bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20',
    gradient: gradientFrom && gradientTo 
      ? `bg-gradient-to-br ${gradientFrom} ${gradientTo}` 
      : 'bg-gradient-to-br from-purple-500/10 to-purple-500/5',
  };
  
  const hoverStyles = hover ? 'hover:shadow-md hover:-translate-y-0.5' : '';
  const widthStyles = fullWidth ? 'col-span-full' : '';
  
  return (
    <div className={cn(
      baseStyles,
      variantStyles[variant],
      hoverStyles,
      widthStyles,
      className
    )}>
      {children}
    </div>
  );
}
