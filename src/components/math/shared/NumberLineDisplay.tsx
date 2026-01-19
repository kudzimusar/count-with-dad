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
  // Use a responsive base width that scales with viewBox
  const baseWidth = 400;
  const height = 100;
  const lineY = 70;
  const padding = 30;
  const usableWidth = baseWidth - padding * 2;

  const getX = (value: number) => {
    return padding + ((value - min) / range) * usableWidth;
  };

  // Generate tick marks - limit to reasonable density for mobile
  const tickStep = range > 10 ? Math.ceil(range / 10) : 1;
  const ticks = Array.from({ length: Math.floor(range / tickStep) + 1 }, (_, i) => min + i * tickStep);

  return (
    <div className="flex justify-center items-center p-2 sm:p-4 w-full max-w-full overflow-x-auto">
      <svg 
        className="w-full max-w-[400px] h-auto min-w-[280px]"
        viewBox={`0 0 ${baseWidth} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Main line */}
        <line
          x1={padding}
          y1={lineY}
          x2={baseWidth - padding}
          y2={lineY}
          stroke="hsl(var(--foreground))"
          strokeWidth="2"
        />

        {/* Arrow heads */}
        <polygon
          points={`${padding - 8},${lineY} ${padding},${lineY - 5} ${padding},${lineY + 5}`}
          fill="hsl(var(--foreground))"
        />
        <polygon
          points={`${baseWidth - padding + 8},${lineY} ${baseWidth - padding},${lineY - 5} ${baseWidth - padding},${lineY + 5}`}
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
                y1={lineY - 6}
                x2={x}
                y2={lineY + 6}
                stroke="hsl(var(--foreground))"
                strokeWidth="2"
              />
              <text
                x={x}
                y={lineY + 20}
                textAnchor="middle"
                className="fill-foreground font-semibold"
                fontSize="12"
              >
                {tick}
              </text>
              {isMarked && (
                <circle
                  cx={x}
                  cy={lineY}
                  r={6}
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
          const arcY = lineY - 25;

          return (
            <g key={i}>
              <path
                d={`M ${x1} ${lineY - 8} Q ${midX} ${arcY} ${x2} ${lineY - 8}`}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="5,3"
              />
              {jump.label && (
                <text
                  x={midX}
                  y={arcY - 4}
                  textAnchor="middle"
                  className="fill-primary font-bold"
                  fontSize="11"
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