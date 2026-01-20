import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedMascot } from '@/components/mascots/AnimatedMascot';
import { MascotType } from '@/config/mascotCharacters';

interface SkillMasteryBarProps {
  name: string;
  percentage: number;
  mascotType?: MascotType;
  className?: string;
}

export function SkillMasteryBar({ 
  name, 
  percentage, 
  mascotType,
  className 
}: SkillMasteryBarProps) {
  // Color coding: Green > 80%, Yellow > 50%, Blue < 50%
  const getColorClass = (pct: number) => {
    if (pct >= 80) return { bg: 'bg-green-500', text: 'text-green-600', glow: 'shadow-green-500/30' };
    if (pct >= 50) return { bg: 'bg-yellow-500', text: 'text-yellow-600', glow: 'shadow-yellow-500/30' };
    return { bg: 'bg-blue-500', text: 'text-blue-600', glow: 'shadow-blue-500/30' };
  };
  
  const colors = getColorClass(percentage);
  
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {mascotType && (
        <div className="w-10 h-10 flex-shrink-0">
          <AnimatedMascot type={mascotType} animated />
        </div>
      )}
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-foreground">{name}</span>
          <span className={cn('font-bold text-lg', colors.text)}>
            {percentage}%
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700 ease-out shadow-sm',
              colors.bg,
              colors.glow
            )}
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
