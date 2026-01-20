import React from 'react';

interface AppleMascotProps {
  animated?: boolean;
  className?: string;
}

export const AppleMascot: React.FC<AppleMascotProps> = ({ animated = true, className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full ${className}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="appleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(0, 100%, 75%)" />
          <stop offset="50%" stopColor="hsl(0, 85%, 65%)" />
          <stop offset="100%" stopColor="hsl(0, 70%, 50%)" />
        </linearGradient>
        <linearGradient id="appleLeafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(140, 70%, 55%)" />
          <stop offset="100%" stopColor="hsl(140, 60%, 40%)" />
        </linearGradient>
      </defs>

      {/* Stem */}
      <path
        d="M50,18 Q52,10 55,14"
        stroke="hsl(25, 40%, 30%)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Leaf */}
      <ellipse
        cx="62"
        cy="16"
        rx="12"
        ry="6"
        fill="url(#appleLeafGradient)"
        transform="rotate(25, 62, 16)"
      />

      {/* Main body */}
      <ellipse
        cx="50"
        cy="58"
        rx="38"
        ry="40"
        fill="url(#appleGradient)"
      />

      {/* Top indent */}
      <ellipse
        cx="50"
        cy="22"
        rx="8"
        ry="4"
        fill="hsl(0, 70%, 50%)"
      />

      {/* Highlight shine */}
      <ellipse
        cx="32"
        cy="45"
        rx="10"
        ry="14"
        fill="hsl(0, 100%, 92%)"
        opacity="0.5"
      />

      {/* Eyes */}
      <g className={animated ? 'mascot-blink' : ''} style={{ transformOrigin: '50px 55px' }}>
        <ellipse cx="38" cy="55" rx="5" ry="6" fill="hsl(0, 0%, 20%)" />
        <ellipse cx="62" cy="55" rx="5" ry="6" fill="hsl(0, 0%, 20%)" />
        {/* Eye shine */}
        <circle cx="40" cy="53" r="2" fill="white" />
        <circle cx="64" cy="53" r="2" fill="white" />
      </g>

      {/* Blush cheeks */}
      <ellipse cx="28" cy="65" rx="6" ry="4" fill="hsl(350, 80%, 75%)" opacity="0.6" />
      <ellipse cx="72" cy="65" rx="6" ry="4" fill="hsl(350, 80%, 75%)" opacity="0.6" />

      {/* Smile */}
      <path
        d="M40,70 Q50,80 60,70"
        stroke="hsl(0, 0%, 20%)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default AppleMascot;
