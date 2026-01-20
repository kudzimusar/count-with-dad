import React from 'react';
import { AnimatedMascot } from '@/components/mascots/AnimatedMascot';
import { MascotType } from '@/config/mascotCharacters';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatWidgetProps {
  value: string | number;
  label: string;
  mascotType?: MascotType;
  icon?: LucideIcon;
  iconColor?: string;
  bgColor?: string;
  valueColor?: string;
  className?: string;
}

export function StatWidget({
  value,
  label,
  mascotType,
  icon: Icon,
  iconColor = 'text-primary',
  bgColor = 'bg-white',
  valueColor = 'text-foreground',
  className,
}: StatWidgetProps) {
  return (
    <div className={cn(
      'rounded-3xl p-5 shadow-sm border border-border/40 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5',
      bgColor,
      className
    )}>
      <div className="flex items-center gap-3 mb-3">
        {mascotType ? (
          <div className="w-10 h-10 flex-shrink-0">
            <AnimatedMascot type={mascotType} animated />
          </div>
        ) : Icon ? (
          <div className={cn('p-2 rounded-xl bg-primary/10', iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
        ) : null}
      </div>
      
      <div className={cn('text-4xl font-bold tracking-tight', valueColor)}>
        {value}
      </div>
      <div className="text-sm text-muted-foreground mt-1 font-medium">
        {label}
      </div>
    </div>
  );
}
