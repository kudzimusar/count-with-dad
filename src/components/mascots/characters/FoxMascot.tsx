import React from 'react';

interface FoxMascotProps {
  animated?: boolean;
  className?: string;
}

export const FoxMascot: React.FC<FoxMascotProps> = ({ animated = true, className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full ${className}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="foxBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(25, 90%, 60%)" />
          <stop offset="50%" stopColor="hsl(20, 85%, 52%)" />
          <stop offset="100%" stopColor="hsl(15, 80%, 45%)" />
        </linearGradient>
        <linearGradient id="foxWhiteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(0, 0%, 100%)" />
          <stop offset="100%" stopColor="hsl(30, 20%, 95%)" />
        </linearGradient>
      </defs>

      {/* Pointy ears */}
      <polygon points="18,45 28,8 42,38" fill="url(#foxBodyGradient)" />
      <polygon points="82,45 72,8 58,38" fill="url(#foxBodyGradient)" />
      
      {/* Inner ears */}
      <polygon points="23,40 30,15 38,38" fill="url(#foxWhiteGradient)" />
      <polygon points="77,40 70,15 62,38" fill="url(#foxWhiteGradient)" />

      {/* Main head/body */}
      <ellipse
        cx="50"
        cy="58"
        rx="40"
        ry="38"
        fill="url(#foxBodyGradient)"
      />

      {/* White face marking */}
      <ellipse cx="50" cy="70" rx="22" ry="24" fill="url(#foxWhiteGradient)" />

      {/* Highlight shine */}
      <ellipse
        cx="30"
        cy="48"
        rx="8"
        ry="12"
        fill="hsl(30, 100%, 75%)"
        opacity="0.4"
      />

      {/* Eyes */}
      <g className={animated ? 'mascot-blink' : ''} style={{ transformOrigin: '50px 52px' }}>
        <ellipse cx="38" cy="52" rx="5" ry="6" fill="hsl(0, 0%, 15%)" />
        <ellipse cx="62" cy="52" rx="5" ry="6" fill="hsl(0, 0%, 15%)" />
        {/* Eye shine */}
        <circle cx="40" cy="50" r="2" fill="white" />
        <circle cx="64" cy="50" r="2" fill="white" />
      </g>

      {/* Nose */}
      <ellipse cx="50" cy="68" rx="6" ry="4" fill="hsl(0, 0%, 15%)" />
      <ellipse cx="50" cy="67" rx="2" ry="1.5" fill="hsl(0, 0%, 35%)" />

      {/* Blush cheeks */}
      <ellipse cx="28" cy="62" rx="5" ry="3" fill="hsl(350, 80%, 75%)" opacity="0.6" />
      <ellipse cx="72" cy="62" rx="5" ry="3" fill="hsl(350, 80%, 75%)" opacity="0.6" />

      {/* Smile */}
      <path
        d="M42,76 Q50,84 58,76"
        stroke="hsl(0, 0%, 20%)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default FoxMascot;
