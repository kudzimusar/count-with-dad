import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface QuickActionPillProps {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'outline';
  className?: string;
}

export function QuickActionPill({
  label,
  icon: Icon,
  onClick,
  variant = 'default',
  className,
}: QuickActionPillProps) {
  const variantStyles = {
    default: 'bg-muted hover:bg-muted/80 text-foreground',
    primary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10',
  };
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95',
        variantStyles[variant],
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
}
