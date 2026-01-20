import React from 'react';

interface BearMascotProps {
  animated?: boolean;
  className?: string;
}

export const BearMascot: React.FC<BearMascotProps> = ({ animated = true, className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full ${className}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="bearBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(25, 50%, 55%)" />
          <stop offset="50%" stopColor="hsl(25, 45%, 45%)" />
          <stop offset="100%" stopColor="hsl(25, 40%, 38%)" />
        </linearGradient>
        <linearGradient id="bearInnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(30, 40%, 70%)" />
          <stop offset="100%" stopColor="hsl(25, 35%, 58%)" />
        </linearGradient>
      </defs>

      {/* Ears */}
      <circle cx="20" cy="22" r="14" fill="url(#bearBodyGradient)" />
      <circle cx="80" cy="22" r="14" fill="url(#bearBodyGradient)" />
      
      {/* Inner ears */}
      <circle cx="20" cy="22" r="8" fill="url(#bearInnerGradient)" />
      <circle cx="80" cy="22" r="8" fill="url(#bearInnerGradient)" />

      {/* Main head/body */}
      <ellipse
        cx="50"
        cy="55"
        rx="42"
        ry="42"
        fill="url(#bearBodyGradient)"
      />

      {/* Snout area */}
      <ellipse cx="50" cy="68" rx="18" ry="14" fill="url(#bearInnerGradient)" />

      {/* Highlight shine */}
      <ellipse
        cx="30"
        cy="42"
        rx="10"
        ry="12"
        fill="hsl(30, 50%, 70%)"
        opacity="0.4"
      />

      {/* Eyes */}
      <g className={animated ? 'mascot-blink' : ''} style={{ transformOrigin: '50px 50px' }}>
        <ellipse cx="35" cy="50" rx="5" ry="6" fill="hsl(0, 0%, 15%)" />
        <ellipse cx="65" cy="50" rx="5" ry="6" fill="hsl(0, 0%, 15%)" />
        {/* Eye shine */}
        <circle cx="37" cy="48" r="2" fill="white" />
        <circle cx="67" cy="48" r="2" fill="white" />
      </g>

      {/* Nose */}
      <ellipse cx="50" cy="64" rx="7" ry="5" fill="hsl(0, 0%, 20%)" />
      <ellipse cx="50" cy="63" rx="2.5" ry="1.5" fill="hsl(0, 0%, 40%)" />

      {/* Blush cheeks */}
      <ellipse cx="25" cy="60" rx="6" ry="4" fill="hsl(350, 80%, 75%)" opacity="0.5" />
      <ellipse cx="75" cy="60" rx="6" ry="4" fill="hsl(350, 80%, 75%)" opacity="0.5" />

      {/* Smile */}
      <path
        d="M42,74 Q50,82 58,74"
        stroke="hsl(0, 0%, 20%)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default BearMascot;
