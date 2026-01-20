import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface JourneyProgressProps {
  currentLevel: number;
  progressToNext: number; // 0-100
  totalStars?: number;
  className?: string;
}

export function JourneyProgress({ 
  currentLevel, 
  progressToNext,
  totalStars,
  className 
}: JourneyProgressProps) {
  const nextLevel = currentLevel + 1;
  
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-foreground">Current Journey</h4>
          <p className="text-muted-foreground text-sm">Age {currentLevel} Learning Path</p>
        </div>
        {totalStars !== undefined && (
          <div className="flex items-center gap-1.5 bg-yellow-500/10 px-3 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="font-bold text-yellow-600">{totalStars}</span>
          </div>
        )}
      </div>
      
      <div className="relative">
        {/* Progress bar track */}
        <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${progressToNext}%` }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
        
        {/* Level indicators */}
        <div className="flex justify-between mt-2">
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
              {currentLevel}
            </div>
            <span className="text-sm text-muted-foreground">Level {currentLevel}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">Level {nextLevel}</span>
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
              {nextLevel}
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-center text-muted-foreground">
        {progressToNext >= 100 
          ? '🎉 Ready to advance to the next level!' 
          : `${100 - progressToNext}% more to unlock Level ${nextLevel}`}
      </p>
    </div>
  );
}
