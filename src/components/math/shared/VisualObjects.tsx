interface VisualObjectsProps {
  count: number;
  object?: string;
  grouped?: boolean;
  animated?: boolean;
}

export function VisualObjects({
  count,
  object = '🍎',
  grouped = false,
  animated = true
}: VisualObjectsProps) {
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
