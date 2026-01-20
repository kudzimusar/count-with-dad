import React from 'react';

interface FrogMascotProps {
  animated?: boolean;
  className?: string;
}

export const FrogMascot: React.FC<FrogMascotProps> = ({ animated = true, className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full ${className}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="frogBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(120, 55%, 55%)" />
          <stop offset="50%" stopColor="hsl(125, 50%, 45%)" />
          <stop offset="100%" stopColor="hsl(130, 45%, 38%)" />
        </linearGradient>
        <linearGradient id="frogBellyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(80, 50%, 80%)" />
          <stop offset="100%" stopColor="hsl(90, 45%, 70%)" />
        </linearGradient>
      </defs>

      {/* Eye bumps */}
      <circle cx="30" cy="28" r="18" fill="url(#frogBodyGradient)" />
      <circle cx="70" cy="28" r="18" fill="url(#frogBodyGradient)" />

      {/* Main head/body */}
      <ellipse
        cx="50"
        cy="60"
        rx="44"
        ry="36"
        fill="url(#frogBodyGradient)"
      />

      {/* Belly area */}
      <ellipse cx="50" cy="68" rx="28" ry="20" fill="url(#frogBellyGradient)" />

      {/* Highlight shine */}
      <ellipse
        cx="28"
        cy="50"
        rx="8"
        ry="12"
        fill="hsl(120, 60%, 70%)"
        opacity="0.4"
      />

      {/* Large frog eyes */}
      <g className={animated ? 'mascot-blink' : ''} style={{ transformOrigin: '50px 28px' }}>
        {/* Eye whites */}
        <circle cx="30" cy="28" r="12" fill="white" />
        <circle cx="70" cy="28" r="12" fill="white" />
        {/* Pupils */}
        <circle cx="32" cy="30" r="6" fill="hsl(0, 0%, 10%)" />
        <circle cx="72" cy="30" r="6" fill="hsl(0, 0%, 10%)" />
        {/* Eye shine */}
        <circle cx="35" cy="27" r="3" fill="white" />
        <circle cx="75" cy="27" r="3" fill="white" />
      </g>

      {/* Nostrils */}
      <circle cx="42" cy="58" r="2" fill="hsl(130, 40%, 30%)" />
      <circle cx="58" cy="58" r="2" fill="hsl(130, 40%, 30%)" />

      {/* Blush cheeks */}
      <ellipse cx="22" cy="55" rx="6" ry="4" fill="hsl(350, 70%, 75%)" opacity="0.5" />
      <ellipse cx="78" cy="55" rx="6" ry="4" fill="hsl(350, 70%, 75%)" opacity="0.5" />

      {/* Wide smile */}
      <path
        d="M28,72 Q50,88 72,72"
        stroke="hsl(130, 40%, 25%)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default FrogMascot;
