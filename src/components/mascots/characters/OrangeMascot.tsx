import React from 'react';

interface OrangeMascotProps {
  animated?: boolean;
  className?: string;
}

export const OrangeMascot: React.FC<OrangeMascotProps> = ({ animated = true, className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full ${className}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(30, 100%, 65%)" />
          <stop offset="50%" stopColor="hsl(25, 95%, 55%)" />
          <stop offset="100%" stopColor="hsl(20, 85%, 45%)" />
        </linearGradient>
        <radialGradient id="orangeShine" cx="30%" cy="30%" r="50%">
          <stop offset="0%" stopColor="hsl(30, 100%, 85%)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(30, 100%, 85%)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Stem */}
      <rect
        x="46"
        y="8"
        width="8"
        height="10"
        rx="3"
        fill="hsl(100, 30%, 35%)"
      />

      {/* Leaf */}
      <ellipse
        cx="62"
        cy="14"
        rx="10"
        ry="5"
        fill="hsl(120, 50%, 45%)"
        transform="rotate(30, 62, 14)"
      />
      <path
        d="M58,14 Q64,12 68,16"
        stroke="hsl(120, 40%, 35%)"
        strokeWidth="1"
        fill="none"
      />

      {/* Main body */}
      <circle
        cx="50"
        cy="55"
        r="38"
        fill="url(#orangeGradient)"
      />

      {/* Shine overlay */}
      <circle
        cx="50"
        cy="55"
        r="38"
        fill="url(#orangeShine)"
      />

      {/* Texture dimples */}
      <g fill="hsl(25, 80%, 50%)" opacity="0.3">
        <circle cx="35" cy="40" r="2" />
        <circle cx="45" cy="35" r="1.5" />
        <circle cx="65" cy="42" r="2" />
        <circle cx="72" cy="55" r="1.5" />
        <circle cx="68" cy="70" r="2" />
        <circle cx="50" cy="80" r="1.5" />
        <circle cx="32" cy="68" r="2" />
        <circle cx="28" cy="52" r="1.5" />
      </g>

      {/* Highlight shine */}
      <ellipse
        cx="35"
        cy="42"
        rx="10"
        ry="14"
        fill="hsl(30, 100%, 85%)"
        opacity="0.4"
      />

      {/* Eyes */}
      <g className={animated ? 'mascot-blink' : ''} style={{ transformOrigin: '50px 52px' }}>
        <ellipse cx="40" cy="52" rx="5" ry="6" fill="hsl(0, 0%, 20%)" />
        <ellipse cx="60" cy="52" rx="5" ry="6" fill="hsl(0, 0%, 20%)" />
        {/* Eye shine */}
        <circle cx="42" cy="50" r="2" fill="white" />
        <circle cx="62" cy="50" r="2" fill="white" />
      </g>

      {/* Blush cheeks */}
      <ellipse cx="30" cy="62" rx="6" ry="4" fill="hsl(15, 80%, 70%)" opacity="0.5" />
      <ellipse cx="70" cy="62" rx="6" ry="4" fill="hsl(15, 80%, 70%)" opacity="0.5" />

      {/* Smile */}
      <path
        d="M42,68 Q50,76 58,68"
        stroke="hsl(0, 0%, 20%)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default OrangeMascot;
