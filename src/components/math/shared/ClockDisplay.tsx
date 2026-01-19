interface ClockDisplayProps {
  hour: number;
  minute: number;
  size?: number;
}

export function ClockDisplay({ hour, minute, size = 160 }: ClockDisplayProps) {
  // Use a fixed viewBox size for consistent rendering, scale with CSS
  const viewBoxSize = 160;
  const center = viewBoxSize / 2;
  const radius = viewBoxSize / 2 - 8;

  // Calculate hand positions
  const hourAngle = ((hour % 12) + minute / 60) * 30 - 90;
  const minuteAngle = minute * 6 - 90;

  const hourHandLength = radius * 0.5;
  const minuteHandLength = radius * 0.75;

  const hourX = center + hourHandLength * Math.cos((hourAngle * Math.PI) / 180);
  const hourY = center + hourHandLength * Math.sin((hourAngle * Math.PI) / 180);

  const minuteX = center + minuteHandLength * Math.cos((minuteAngle * Math.PI) / 180);
  const minuteY = center + minuteHandLength * Math.sin((minuteAngle * Math.PI) / 180);

  // Generate hour markers
  const hourMarkers = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const markerRadius = radius - 12;
    const x = center + markerRadius * Math.cos(angle);
    const y = center + markerRadius * Math.sin(angle);
    return { x, y, hour: i === 0 ? 12 : i };
  });

  return (
    <div className="flex justify-center items-center p-2 sm:p-4">
      <svg 
        className="w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] md:w-[200px] md:h-[200px]"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Clock face */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeWidth="4"
        />

        {/* Hour markers */}
        {hourMarkers.map(({ x, y, hour }, i) => (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-foreground font-bold"
            fontSize={13}
          >
            {hour}
          </text>
        ))}

        {/* Hour hand */}
        <line
          x1={center}
          y1={center}
          x2={hourX}
          y2={hourY}
          stroke="hsl(var(--foreground))"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Minute hand */}
        <line
          x1={center}
          y1={center}
          x2={minuteX}
          y2={minuteY}
          stroke="hsl(var(--primary))"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Center dot */}
        <circle cx={center} cy={center} r={6} fill="hsl(var(--primary))" />
      </svg>
    </div>
  );
}