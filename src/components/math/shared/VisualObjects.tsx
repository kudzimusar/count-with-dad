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
  // Render multiple groups side by side - Compact
  if (groups && groups.length > 0) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-wrap justify-center gap-4">
          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-col items-center gap-1">
              {group.label && (
                <span className="text-sm font-semibold text-muted-foreground">
                  {group.label}
                </span>
              )}
              <div className="flex flex-wrap gap-1 justify-center p-2 bg-secondary/30 rounded-xl min-w-[60px]">
                {Array.from({ length: Math.min(group.count, 12) }, (_, i) => (
                  <div
                    key={i}
                    className={`text-xl md:text-2xl ${animated ? 'animate-bounce' : ''}`}
                    style={{ animationDelay: `${(groupIndex * group.count + i) * 0.05}s` }}
                  >
                    {group.object}
                  </div>
                ))}
                {group.count > 12 && (
                  <span className="text-sm text-muted-foreground">+{group.count - 12}</span>
                )}
              </div>
              <span className="text-lg font-bold text-foreground">{group.count}</span>
            </div>
          ))}
        </div>
        {showCombined && (
          <div className="text-xl font-bold text-primary">
            Total: {groups.reduce((sum, g) => sum + g.count, 0)}
          </div>
        )}
      </div>
    );
  }

  // Render single group (original behavior) - Compact
  if (count !== undefined) {
    return (
      <div className="flex flex-wrap gap-1 justify-center">
        {Array.from({ length: Math.min(count, 15) }, (_, i) => (
          <div
            key={i}
            className={`text-2xl md:text-3xl ${animated ? 'animate-bounce' : ''}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {object}
          </div>
        ))}
        {count > 15 && <span className="text-sm text-muted-foreground ml-1">+{count - 15}</span>}
      </div>
    );
  }

  return null;
}
