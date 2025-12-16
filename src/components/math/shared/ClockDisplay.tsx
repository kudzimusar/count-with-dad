interface ClockDisplayProps {
  hour: number;
  minute: number;
  size?: number;
}

export function ClockDisplay({ hour, minute, size = 200 }: ClockDisplayProps) {
  const center = size / 2;
  const radius = size / 2 - 10;

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
    const markerRadius = radius - 15;
    const x = center + markerRadius * Math.cos(angle);
    const y = center + markerRadius * Math.sin(angle);
    return { x, y, hour: i === 0 ? 12 : i };
  });

  return (
    <div className="flex justify-center items-center p-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
            fontSize={size / 12}
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