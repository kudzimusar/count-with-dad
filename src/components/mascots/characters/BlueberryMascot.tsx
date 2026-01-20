import React from 'react';

interface BlueberryMascotProps {
  animated?: boolean;
  className?: string;
}

export const BlueberryMascot: React.FC<BlueberryMascotProps> = ({ animated = true, className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full ${className}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="blueberryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(240, 70%, 70%)" />
          <stop offset="50%" stopColor="hsl(240, 60%, 55%)" />
          <stop offset="100%" stopColor="hsl(240, 50%, 40%)" />
        </linearGradient>
        <radialGradient id="blueberryShine" cx="30%" cy="30%" r="50%">
          <stop offset="0%" stopColor="hsl(240, 80%, 85%)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(240, 80%, 85%)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Main body */}
      <circle
        cx="50"
        cy="55"
        r="38"
        fill="url(#blueberryGradient)"
      />

      {/* Shine overlay */}
      <circle
        cx="50"
        cy="55"
        r="38"
        fill="url(#blueberryShine)"
      />

      {/* Crown/calyx - star pattern at top */}
      <g fill="hsl(240, 40%, 35%)">
        <ellipse cx="40" cy="20" rx="5" ry="8" transform="rotate(-20, 40, 20)" />
        <ellipse cx="50" cy="18" rx="5" ry="9" />
        <ellipse cx="60" cy="20" rx="5" ry="8" transform="rotate(20, 60, 20)" />
        <ellipse cx="35" cy="24" rx="4" ry="6" transform="rotate(-35, 35, 24)" />
        <ellipse cx="65" cy="24" rx="4" ry="6" transform="rotate(35, 65, 24)" />
      </g>

      {/* Crown center */}
      <circle cx="50" cy="22" r="6" fill="hsl(240, 35%, 30%)" />

      {/* Highlight shine */}
      <ellipse
        cx="35"
        cy="42"
        rx="8"
        ry="12"
        fill="hsl(240, 80%, 85%)"
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
      <ellipse cx="30" cy="62" rx="6" ry="4" fill="hsl(280, 60%, 75%)" opacity="0.5" />
      <ellipse cx="70" cy="62" rx="6" ry="4" fill="hsl(280, 60%, 75%)" opacity="0.5" />

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

export default BlueberryMascot;
