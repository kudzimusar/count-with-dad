interface NumberLineDisplayProps {
  min: number;
  max: number;
  markedPositions?: number[];
  jumps?: Array<{ from: number; to: number; label?: string }>;
}

export function NumberLineDisplay({
  min,
  max,
  markedPositions = [],
  jumps = []
}: NumberLineDisplayProps) {
  const range = max - min;
  const width = 400;
  const height = 120;
  const lineY = 80;
  const padding = 40;
  const usableWidth = width - padding * 2;

  const getX = (value: number) => {
    return padding + ((value - min) / range) * usableWidth;
  };

  // Generate tick marks
  const ticks = Array.from({ length: range + 1 }, (_, i) => min + i);

  return (
    <div className="flex justify-center items-center p-4 overflow-x-auto">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Main line */}
        <line
          x1={padding}
          y1={lineY}
          x2={width - padding}
          y2={lineY}
          stroke="hsl(var(--foreground))"
          strokeWidth="3"
        />

        {/* Arrow heads */}
        <polygon
          points={`${padding - 10},${lineY} ${padding},${lineY - 6} ${padding},${lineY + 6}`}
          fill="hsl(var(--foreground))"
        />
        <polygon
          points={`${width - padding + 10},${lineY} ${width - padding},${lineY - 6} ${width - padding},${lineY + 6}`}
          fill="hsl(var(--foreground))"
        />

        {/* Tick marks and numbers */}
        {ticks.map((tick, i) => {
          const x = getX(tick);
          const isMarked = markedPositions.includes(tick);
          return (
            <g key={i}>
              <line
                x1={x}
                y1={lineY - 8}
                x2={x}
                y2={lineY + 8}
                stroke="hsl(var(--foreground))"
                strokeWidth="2"
              />
              <text
                x={x}
                y={lineY + 25}
                textAnchor="middle"
                className="fill-foreground font-semibold"
                fontSize="14"
              >
                {tick}
              </text>
              {isMarked && (
                <circle
                  cx={x}
                  cy={lineY}
                  r={8}
                  fill="hsl(var(--primary))"
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })}

        {/* Jumps */}
        {jumps.map((jump, i) => {
          const x1 = getX(jump.from);
          const x2 = getX(jump.to);
          const midX = (x1 + x2) / 2;
          const arcY = lineY - 30;

          return (
            <g key={i}>
              <path
                d={`M ${x1} ${lineY - 10} Q ${midX} ${arcY} ${x2} ${lineY - 10}`}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="5,3"
              />
              {jump.label && (
                <text
                  x={midX}
                  y={arcY - 5}
                  textAnchor="middle"
                  className="fill-primary font-bold"
                  fontSize="12"
                >
                  {jump.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}