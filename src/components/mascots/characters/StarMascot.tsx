import React from 'react';

interface StarMascotProps {
  animated?: boolean;
  className?: string;
}

export const StarMascot: React.FC<StarMascotProps> = ({ animated = true, className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full ${className}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(50, 100%, 75%)" />
          <stop offset="50%" stopColor="hsl(45, 100%, 60%)" />
          <stop offset="100%" stopColor="hsl(40, 90%, 50%)" />
        </linearGradient>
        <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Star body - 5-pointed star */}
      <polygon
        points="50,8 61,38 93,38 67,58 78,90 50,70 22,90 33,58 7,38 39,38"
        fill="url(#starGradient)"
        filter="url(#starGlow)"
      />

      {/* Inner highlight */}
      <polygon
        points="50,20 56,38 72,38 60,50 65,68 50,58 35,68 40,50 28,38 44,38"
        fill="hsl(50, 100%, 90%)"
        opacity="0.3"
      />

      {/* Top point highlight */}
      <path
        d="M50,12 L54,30 L46,30 Z"
        fill="hsl(50, 100%, 90%)"
        opacity="0.5"
      />

      {/* Eyes */}
      <g className={animated ? 'mascot-blink' : ''} style={{ transformOrigin: '50px 48px' }}>
        <ellipse cx="42" cy="48" rx="4" ry="5" fill="hsl(0, 0%, 20%)" />
        <ellipse cx="58" cy="48" rx="4" ry="5" fill="hsl(0, 0%, 20%)" />
        {/* Eye shine */}
        <circle cx="44" cy="46" r="1.5" fill="white" />
        <circle cx="60" cy="46" r="1.5" fill="white" />
      </g>

      {/* Blush cheeks */}
      <ellipse cx="34" cy="55" rx="5" ry="3" fill="hsl(30, 90%, 75%)" opacity="0.6" />
      <ellipse cx="66" cy="55" rx="5" ry="3" fill="hsl(30, 90%, 75%)" opacity="0.6" />

      {/* Smile */}
      <path
        d="M44,58 Q50,65 56,58"
        stroke="hsl(0, 0%, 20%)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Sparkle accents */}
      <g fill="hsl(50, 100%, 85%)" opacity="0.8">
        <circle cx="20" cy="25" r="2" />
        <circle cx="80" cy="25" r="2" />
        <circle cx="15" cy="60" r="1.5" />
        <circle cx="85" cy="60" r="1.5" />
      </g>
    </svg>
  );
};

export default StarMascot;
