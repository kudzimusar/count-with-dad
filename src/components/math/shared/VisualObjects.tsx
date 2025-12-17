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
          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="comparison-card">
              {group.label && (
                <span className="text-xs font-semibold text-muted-foreground mb-1">
                  {group.label}
                </span>
              )}
              {/* Objects in tight grid */}
              <div className="grid grid-cols-3 gap-1 mb-2">
                {Array.from({ length: Math.min(group.count, 9) }, (_, i) => (
                  <span
                    key={i}
                    className={`text-2xl ${animated ? 'animate-bounce-gentle' : ''}`}
                    style={{ animationDelay: `${(groupIndex * 3 + i) * 0.1}s` }}
                  >
                    {group.object}
                  </span>
                ))}
              </div>
              {group.count > 9 && (
                <span className="text-xs text-muted-foreground mb-1">+{group.count - 9} more</span>
              )}
              {/* Large number below */}
              <span className="text-3xl font-bold text-primary">{group.count}</span>
            </div>
          ))}
        </div>
        {showCombined && (
          <div className="text-lg font-bold text-primary">
            Total: {groups.reduce((sum, g) => sum + g.count, 0)}
          </div>
        )}
      </div>
    );
  }

  // Render single group - Compact grid
  if (count !== undefined) {
    const maxDisplay = 12;
    const displayCount = Math.min(count, maxDisplay);
    const cols = displayCount <= 4 ? displayCount : displayCount <= 6 ? 3 : 4;
    
    return (
      <div className="flex flex-col items-center gap-2">
        <div 
          className="grid gap-1 justify-center"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: displayCount }, (_, i) => (
            <span
              key={i}
              className={`text-2xl md:text-3xl ${animated ? 'animate-bounce-gentle' : ''}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {object}
            </span>
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
