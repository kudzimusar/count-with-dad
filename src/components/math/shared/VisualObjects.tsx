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
  // Render multiple groups side by side
  if (groups && groups.length > 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-8">
          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-col items-center gap-2">
              {group.label && (
                <span className="text-lg font-semibold text-muted-foreground">
                  {group.label}
                </span>
              )}
              <div className="flex flex-wrap gap-2 justify-center p-4 bg-secondary/30 rounded-2xl min-w-[100px]">
                {Array.from({ length: group.count }, (_, i) => (
                  <div
                    key={i}
                    className={`text-3xl md:text-4xl ${animated ? 'animate-bounce' : ''}`}
                    style={{ animationDelay: `${(groupIndex * group.count + i) * 0.05}s` }}
                  >
                    {group.object}
                  </div>
                ))}
              </div>
              <span className="text-xl font-bold text-foreground">{group.count}</span>
            </div>
          ))}
        </div>
        {showCombined && (
          <div className="text-2xl font-bold text-primary mt-2">
            Total: {groups.reduce((sum, g) => sum + g.count, 0)}
          </div>
        )}
      </div>
    );
  }

  // Render single group (original behavior)
  if (count !== undefined) {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className={`text-4xl ${animated ? 'animate-bounce' : ''}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {object}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
