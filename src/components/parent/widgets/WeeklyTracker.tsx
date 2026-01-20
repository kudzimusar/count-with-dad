import React from 'react';
import { cn } from '@/lib/utils';

interface WeeklyTrackerProps {
  activeDays: boolean[];
  className?: string;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function WeeklyTracker({ activeDays, className }: WeeklyTrackerProps) {
  const activeCount = activeDays.filter(Boolean).length;
  
  return (
    <div className={cn('rounded-3xl p-6 bg-white shadow-sm border border-border/40', className)}>
      <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="text-2xl">📅</span>
        Weekly Activity
      </h4>
      
      <div className="flex justify-between items-center gap-2 mb-4">
        {DAYS.map((day, index) => (
          <div key={day} className="flex flex-col items-center gap-2">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-bold text-sm',
                activeDays[index]
                  ? 'bg-green-500 text-white shadow-md shadow-green-500/30 scale-110'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {activeDays[index] ? '✓' : ''}
            </div>
            <span className="text-xs text-muted-foreground font-medium">{day}</span>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <span className="text-lg font-bold text-green-600">{activeCount}</span>
        <span className="text-muted-foreground"> of 7 days active this week</span>
      </div>
    </div>
  );
}
