import React from 'react';

interface BananaMascotProps {
  animated?: boolean;
  className?: string;
}

export const BananaMascot: React.FC<BananaMascotProps> = ({ animated = true, className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full ${className}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="bananaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(50, 100%, 80%)" />
          <stop offset="50%" stopColor="hsl(48, 100%, 70%)" />
          <stop offset="100%" stopColor="hsl(45, 90%, 55%)" />
        </linearGradient>
      </defs>

      {/* Main banana body - curved shape */}
      <path
        d="M25,75 
           Q15,50 30,30 
           Q45,15 65,20 
           Q80,25 85,40
           Q88,55 80,65
           Q70,80 50,85
           Q35,88 25,75"
        fill="url(#bananaGradient)"
      />

      {/* Top tip */}
      <ellipse
        cx="68"
        cy="18"
        rx="6"
        ry="4"
        fill="hsl(30, 50%, 35%)"
        transform="rotate(-30, 68, 18)"
      />

      {/* Bottom tip */}
      <ellipse
        cx="22"
        cy="78"
        rx="5"
        ry="3"
        fill="hsl(30, 50%, 35%)"
        transform="rotate(45, 22, 78)"
      />

      {/* Highlight shine */}
      <path
        d="M35,35 Q40,28 55,30 Q52,35 40,40 Q35,42 35,35"
        fill="hsl(50, 100%, 92%)"
        opacity="0.6"
      />

      {/* Inner curve detail */}
      <path
        d="M40,70 Q55,60 65,50"
        stroke="hsl(45, 70%, 50%)"
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />

      {/* Eyes */}
      <g className={animated ? 'mascot-blink' : ''} style={{ transformOrigin: '52px 48px' }}>
        <ellipse cx="45" cy="48" rx="4" ry="5" fill="hsl(0, 0%, 20%)" />
        <ellipse cx="60" cy="42" rx="4" ry="5" fill="hsl(0, 0%, 20%)" />
        {/* Eye shine */}
        <circle cx="47" cy="46" r="1.5" fill="white" />
        <circle cx="62" cy="40" r="1.5" fill="white" />
      </g>

      {/* Blush cheeks */}
      <ellipse cx="38" cy="58" rx="5" ry="3" fill="hsl(350, 80%, 75%)" opacity="0.5" transform="rotate(-15, 38, 58)" />
      <ellipse cx="68" cy="50" rx="5" ry="3" fill="hsl(350, 80%, 75%)" opacity="0.5" transform="rotate(-15, 68, 50)" />

      {/* Smile */}
      <path
        d="M48,58 Q55,65 62,55"
        stroke="hsl(0, 0%, 20%)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default BananaMascot;
