import { AnimatedMascot } from '@/components/mascots/AnimatedMascot';
import { getMascotType } from '@/config/mascotCharacters';

interface ObjectGroup {
  count: number;
  object: string;
  label?: string;
}

interface VisualObjectsProps {
  count?: number;
  object?: string;
  grouped?: boolean;
  animated?: boolean;
  groups?: ObjectGroup[];
  showCombined?: boolean;
}

export function VisualObjects({
  count,
  object = '🍎',
  grouped = false,
  animated = true,
  groups,
  showCombined = false
}: VisualObjectsProps) {
  // Render comparison groups (side by side cards)
  if (groups && groups.length > 0) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex justify-center items-stretch gap-4">
          {groups.map((group, groupIndex) => {
            const mascotType = getMascotType(group.object);
            const maxDisplay = 9;
            const displayCount = Math.min(group.count, maxDisplay);
            
            // Determine grid columns based on count
            const cols = displayCount <= 2 ? displayCount : displayCount <= 4 ? 2 : 3;
            
            return (
              <div 
                key={groupIndex} 
                className="comparison-card rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ 
                  borderRadius: '24px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 10px 20px -5px rgba(0, 0, 0, 0.04)'
                }}
              >
                {group.label && (
                  <span className="text-xs font-semibold text-muted-foreground mb-2">
                    {group.label}
                  </span>
                )}
                {/* Mascots in responsive grid */}
                <div 
                  className="grid gap-2 mb-3"
                  style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
                >
                  {Array.from({ length: displayCount }, (_, i) => (
                    <div 
                      key={i}
                      className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center"
                    >
                      <AnimatedMascot
                        type={mascotType}
                        animated={animated}
                        wiggle={groupIndex > 0 || displayCount > 1}
                        delay={i * 0.1}
                      />
                    </div>
                  ))}
                </div>
                {group.count > maxDisplay && (
                  <span className="text-xs text-muted-foreground mb-1">+{group.count - maxDisplay} more</span>
                )}
                {/* Large number below */}
                <span className="text-3xl md:text-4xl font-bold text-primary">{group.count}</span>
              </div>
            );
          })}
        </div>
        {showCombined && (
          <div className="text-lg font-bold text-primary">
            Total: {groups.reduce((sum, g) => sum + g.count, 0)}
          </div>
        )}
      </div>
    );
  }

  // Render single group - Compact grid with mascots
  if (count !== undefined) {
    const mascotType = getMascotType(object);
    const maxDisplay = 12;
    const displayCount = Math.min(count, maxDisplay);
    const cols = displayCount <= 4 ? displayCount : displayCount <= 6 ? 3 : 4;
    
    return (
      <div className="flex flex-col items-center gap-2">
        <div 
          className="grid gap-2 justify-center"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: displayCount }, (_, i) => (
            <div 
              key={i}
              className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center"
            >
              <AnimatedMascot
                type={mascotType}
                animated={animated}
                wiggle={displayCount > 1}
                delay={i * 0.08}
              />
            </div>
          ))}
        </div>
        {count > maxDisplay && (
          <span className="text-sm text-muted-foreground">+{count - maxDisplay} more</span>
        )}
      </div>
    );
  }

  return null;
}
