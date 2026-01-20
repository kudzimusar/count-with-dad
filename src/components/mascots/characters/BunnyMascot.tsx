import React from 'react';

interface BunnyMascotProps {
  animated?: boolean;
  className?: string;
}

export const BunnyMascot: React.FC<BunnyMascotProps> = ({ animated = true, className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full ${className}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="bunnyBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(0, 0%, 100%)" />
          <stop offset="50%" stopColor="hsl(0, 0%, 96%)" />
          <stop offset="100%" stopColor="hsl(340, 10%, 92%)" />
        </linearGradient>
        <linearGradient id="bunnyEarInnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(350, 70%, 85%)" />
          <stop offset="100%" stopColor="hsl(350, 60%, 75%)" />
        </linearGradient>
      </defs>

      {/* Long ears */}
      <ellipse cx="32" cy="15" rx="10" ry="28" fill="url(#bunnyBodyGradient)" transform="rotate(-15, 32, 15)" />
      <ellipse cx="68" cy="15" rx="10" ry="28" fill="url(#bunnyBodyGradient)" transform="rotate(15, 68, 15)" />
      
      {/* Inner ears (pink) */}
      <ellipse cx="32" cy="15" rx="5" ry="20" fill="url(#bunnyEarInnerGradient)" transform="rotate(-15, 32, 15)" />
      <ellipse cx="68" cy="15" rx="5" ry="20" fill="url(#bunnyEarInnerGradient)" transform="rotate(15, 68, 15)" />

      {/* Main head/body */}
      <ellipse
        cx="50"
        cy="62"
        rx="38"
        ry="36"
        fill="url(#bunnyBodyGradient)"
      />

      {/* Highlight shine */}
      <ellipse
        cx="32"
        cy="50"
        rx="10"
        ry="14"
        fill="white"
        opacity="0.5"
      />

      {/* Eyes */}
      <g className={animated ? 'mascot-blink' : ''} style={{ transformOrigin: '50px 55px' }}>
        <ellipse cx="38" cy="55" rx="5" ry="7" fill="hsl(0, 0%, 15%)" />
        <ellipse cx="62" cy="55" rx="5" ry="7" fill="hsl(0, 0%, 15%)" />
        {/* Eye shine */}
        <circle cx="40" cy="53" r="2" fill="white" />
        <circle cx="64" cy="53" r="2" fill="white" />
      </g>

      {/* Nose (pink triangle) */}
      <path
        d="M47,70 L50,65 L53,70 Z"
        fill="hsl(350, 70%, 70%)"
      />

      {/* Whiskers */}
      <g stroke="hsl(0, 0%, 60%)" strokeWidth="1" strokeLinecap="round">
        <line x1="28" y1="68" x2="15" y2="65" />
        <line x1="28" y1="72" x2="15" y2="72" />
        <line x1="28" y1="76" x2="15" y2="79" />
        <line x1="72" y1="68" x2="85" y2="65" />
        <line x1="72" y1="72" x2="85" y2="72" />
        <line x1="72" y1="76" x2="85" y2="79" />
      </g>

      {/* Blush cheeks */}
      <ellipse cx="28" cy="68" rx="6" ry="4" fill="hsl(350, 80%, 80%)" opacity="0.6" />
      <ellipse cx="72" cy="68" rx="6" ry="4" fill="hsl(350, 80%, 80%)" opacity="0.6" />

      {/* Smile with buck teeth */}
      <path
        d="M44,78 Q50,84 56,78"
        stroke="hsl(0, 0%, 20%)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Buck teeth */}
      <rect x="47" y="78" width="3" height="5" rx="1" fill="white" stroke="hsl(0, 0%, 85%)" strokeWidth="0.5" />
      <rect x="50" y="78" width="3" height="5" rx="1" fill="white" stroke="hsl(0, 0%, 85%)" strokeWidth="0.5" />
    </svg>
  );
};

export default BunnyMascot;
