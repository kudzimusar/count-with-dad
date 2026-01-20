import React from 'react';

interface CookieMascotProps {
  animated?: boolean;
  className?: string;
}

export const CookieMascot: React.FC<CookieMascotProps> = ({ animated = true, className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full ${className}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="cookieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(35, 70%, 65%)" />
          <stop offset="50%" stopColor="hsl(30, 60%, 55%)" />
          <stop offset="100%" stopColor="hsl(25, 50%, 40%)" />
        </linearGradient>
        <radialGradient id="cookieTexture" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="transparent" />
          <stop offset="100%" stopColor="hsl(25, 40%, 35%)" stopOpacity="0.3" />
        </radialGradient>
      </defs>

      {/* Main cookie body - slightly irregular circle */}
      <path
        d="M50,10 
           Q75,12 88,35 
           Q92,55 85,72 
           Q72,92 50,90 
           Q25,92 12,72 
           Q5,50 15,30 
           Q28,10 50,10"
        fill="url(#cookieGradient)"
      />

      {/* Texture overlay */}
      <circle cx="50" cy="50" r="40" fill="url(#cookieTexture)" />

      {/* Chocolate chips */}
      <g fill="hsl(20, 50%, 25%)">
        <ellipse cx="30" cy="35" rx="6" ry="5" transform="rotate(-15, 30, 35)" />
        <ellipse cx="70" cy="40" rx="5" ry="6" transform="rotate(20, 70, 40)" />
        <ellipse cx="25" cy="65" rx="5" ry="4" transform="rotate(10, 25, 65)" />
        <ellipse cx="72" cy="68" rx="6" ry="5" transform="rotate(-10, 72, 68)" />
        <ellipse cx="55" cy="78" rx="5" ry="4" transform="rotate(5, 55, 78)" />
        <ellipse cx="35" cy="22" rx="4" ry="5" transform="rotate(-25, 35, 22)" />
      </g>

      {/* Chip highlights */}
      <g fill="hsl(25, 35%, 35%)" opacity="0.6">
        <ellipse cx="32" cy="33" rx="2" ry="1.5" />
        <ellipse cx="71" cy="38" rx="2" ry="1.5" />
        <ellipse cx="26" cy="63" rx="1.5" ry="1" />
      </g>

      {/* Edge highlight */}
      <path
        d="M35,15 Q50,12 65,18"
        stroke="hsl(35, 70%, 80%)"
        strokeWidth="3"
        fill="none"
        opacity="0.5"
        strokeLinecap="round"
      />

      {/* Eyes */}
      <g className={animated ? 'mascot-blink' : ''} style={{ transformOrigin: '50px 48px' }}>
        <ellipse cx="42" cy="48" rx="5" ry="6" fill="hsl(0, 0%, 20%)" />
        <ellipse cx="62" cy="48" rx="5" ry="6" fill="hsl(0, 0%, 20%)" />
        {/* Eye shine */}
        <circle cx="44" cy="46" r="2" fill="white" />
        <circle cx="64" cy="46" r="2" fill="white" />
      </g>

      {/* Blush cheeks */}
      <ellipse cx="32" cy="58" rx="5" ry="3" fill="hsl(15, 70%, 70%)" opacity="0.5" />
      <ellipse cx="68" cy="58" rx="5" ry="3" fill="hsl(15, 70%, 70%)" opacity="0.5" />

      {/* Smile */}
      <path
        d="M44,62 Q52,70 60,62"
        stroke="hsl(0, 0%, 20%)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default CookieMascot;
