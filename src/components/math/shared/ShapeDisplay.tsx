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

export function ShapeDisplay({ shape, color = 'blue', size = 140 }: ShapeDisplayProps) {
  const fillColor = SHAPE_COLORS[color] || color;

  const renderShape = () => {
    switch (shape.toLowerCase()) {
      case 'circle':
        return (
          <circle cx={size / 2} cy={size / 2} r={size / 2 - 10} fill={fillColor} />
        );
      case 'square':
        return (
          <rect x={10} y={10} width={size - 20} height={size - 20} fill={fillColor} />
        );
      case 'triangle':
        return (
          <polygon
            points={`${size / 2},10 ${size - 10},${size - 10} 10,${size - 10}`}
            fill={fillColor}
          />
        );
      case 'rectangle':
        return (
          <rect x={10} y={40} width={size - 20} height={size - 80} fill={fillColor} />
        );
      case 'oval':
        return (
          <ellipse cx={size / 2} cy={size / 2} rx={size / 2 - 10} ry={size / 3} fill={fillColor} />
        );
      case 'star':
        const starPoints = generateStarPoints(size / 2, size / 2, 5, size / 2 - 10, size / 4);
        return <polygon points={starPoints} fill={fillColor} />;
      case 'pentagon':
        const pentPoints = generatePolygonPoints(size / 2, size / 2, 5, size / 2 - 10);
        return <polygon points={pentPoints} fill={fillColor} />;
      case 'hexagon':
        const hexPoints = generatePolygonPoints(size / 2, size / 2, 6, size / 2 - 10);
        return <polygon points={hexPoints} fill={fillColor} />;
      case 'diamond':
        return (
          <polygon
            points={`${size / 2},10 ${size - 10},${size / 2} ${size / 2},${size - 10} 10,${size / 2}`}
            fill={fillColor}
          />
        );
      case 'heart':
        return (
          <path
            d={`M ${size / 2} ${size - 20}
               C ${size / 2} ${size - 20}, 10 ${size / 2}, 10 ${size / 3}
               C 10 15, ${size / 2 - 10} 10, ${size / 2} ${size / 3}
               C ${size / 2 + 10} 10, ${size - 10} 15, ${size - 10} ${size / 3}
               C ${size - 10} ${size / 2}, ${size / 2} ${size - 20}, ${size / 2} ${size - 20}`}
            fill={fillColor}
          />
        );
      default:
        return (
          <circle cx={size / 2} cy={size / 2} r={size / 2 - 10} fill={fillColor} />
        );
    }
  };

  return (
    <div className="flex justify-center items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="animate-pulse"
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