interface ShapeDisplayProps {
  shape: string;
  color?: string;
  size?: number;
}

const SHAPE_COLORS: Record<string, string> = {
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#22C55E',
  yellow: '#EAB308',
  purple: '#A855F7',
  orange: '#F97316',
  pink: '#EC4899'
};

export function ShapeDisplay({ shape, color = 'blue', size = 100 }: ShapeDisplayProps) {
  const fillColor = SHAPE_COLORS[color] || color;
  // Use a fixed viewBox for consistent rendering, scale with CSS
  const viewBoxSize = 100;

  const renderShape = () => {
    const s = viewBoxSize; // Use viewBox size for calculations
    switch (shape.toLowerCase()) {
      case 'circle':
        return (
          <circle cx={s / 2} cy={s / 2} r={s / 2 - 8} fill={fillColor} />
        );
      case 'square':
        return (
          <rect x={8} y={8} width={s - 16} height={s - 16} fill={fillColor} />
        );
      case 'triangle':
        return (
          <polygon
            points={`${s / 2},8 ${s - 8},${s - 8} 8,${s - 8}`}
            fill={fillColor}
          />
        );
      case 'rectangle':
        return (
          <rect x={8} y={30} width={s - 16} height={s - 60} fill={fillColor} />
        );
      case 'oval':
        return (
          <ellipse cx={s / 2} cy={s / 2} rx={s / 2 - 8} ry={s / 3} fill={fillColor} />
        );
      case 'star':
        const starPoints = generateStarPoints(s / 2, s / 2, 5, s / 2 - 8, s / 4);
        return <polygon points={starPoints} fill={fillColor} />;
      case 'pentagon':
        const pentPoints = generatePolygonPoints(s / 2, s / 2, 5, s / 2 - 8);
        return <polygon points={pentPoints} fill={fillColor} />;
      case 'hexagon':
        const hexPoints = generatePolygonPoints(s / 2, s / 2, 6, s / 2 - 8);
        return <polygon points={hexPoints} fill={fillColor} />;
      case 'diamond':
        return (
          <polygon
            points={`${s / 2},8 ${s - 8},${s / 2} ${s / 2},${s - 8} 8,${s / 2}`}
            fill={fillColor}
          />
        );
      case 'heart':
        return (
          <path
            d={`M ${s / 2} ${s - 16}
               C ${s / 2} ${s - 16}, 8 ${s / 2}, 8 ${s / 3}
               C 8 12, ${s / 2 - 8} 8, ${s / 2} ${s / 3}
               C ${s / 2 + 8} 8, ${s - 8} 12, ${s - 8} ${s / 3}
               C ${s - 8} ${s / 2}, ${s / 2} ${s - 16}, ${s / 2} ${s - 16}`}
            fill={fillColor}
          />
        );
      default:
        return (
          <circle cx={s / 2} cy={s / 2} r={s / 2 - 8} fill={fillColor} />
        );
    }
  };

  return (
    <div className="flex justify-center items-center">
      <svg
        className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px]"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ animationDuration: '2s' }}
      >
        {renderShape()}
      </svg>
    </div>
  );
}

function generateStarPoints(cx: number, cy: number, points: number, outerR: number, innerR: number): string {
  const result: string[] = [];
  const angle = Math.PI / points;

  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = i * angle - Math.PI / 2;
    result.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }

  return result.join(' ');
}

function generatePolygonPoints(cx: number, cy: number, sides: number, radius: number): string {
  const result: string[] = [];
  const angle = (2 * Math.PI) / sides;

  for (let i = 0; i < sides; i++) {
    const a = i * angle - Math.PI / 2;
    result.push(`${cx + radius * Math.cos(a)},${cy + radius * Math.sin(a)}`);
  }

  return result.join(' ');
}