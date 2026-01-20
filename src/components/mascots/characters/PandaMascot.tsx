import React from 'react';

interface PandaMascotProps {
  animated?: boolean;
  className?: string;
}

export const PandaMascot: React.FC<PandaMascotProps> = ({ animated = true, className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full ${className}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="pandaBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(0, 0%, 100%)" />
          <stop offset="50%" stopColor="hsl(0, 0%, 96%)" />
          <stop offset="100%" stopColor="hsl(0, 0%, 90%)" />
        </linearGradient>
        <linearGradient id="pandaEarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(0, 0%, 25%)" />
          <stop offset="100%" stopColor="hsl(0, 0%, 15%)" />
        </linearGradient>
      </defs>

      {/* Ears */}
      <circle cx="22" cy="25" r="16" fill="url(#pandaEarGradient)" />
      <circle cx="78" cy="25" r="16" fill="url(#pandaEarGradient)" />
      
      {/* Inner ear highlight */}
      <circle cx="22" cy="25" r="8" fill="hsl(0, 0%, 35%)" />
      <circle cx="78" cy="25" r="8" fill="hsl(0, 0%, 35%)" />

      {/* Main head/body */}
      <ellipse
        cx="50"
        cy="55"
        rx="42"
        ry="40"
        fill="url(#pandaBodyGradient)"
      />

      {/* Eye patches (black) */}
      <ellipse cx="32" cy="52" rx="14" ry="12" fill="hsl(0, 0%, 15%)" transform="rotate(-10, 32, 52)" />
      <ellipse cx="68" cy="52" rx="14" ry="12" fill="hsl(0, 0%, 15%)" transform="rotate(10, 68, 52)" />

      {/* Eyes */}
      <g className={animated ? 'mascot-blink' : ''} style={{ transformOrigin: '50px 52px' }}>
        <ellipse cx="32" cy="52" rx="5" ry="6" fill="white" />
        <ellipse cx="68" cy="52" rx="5" ry="6" fill="white" />
        {/* Pupils */}
        <circle cx="33" cy="53" r="3" fill="hsl(0, 0%, 10%)" />
        <circle cx="69" cy="53" r="3" fill="hsl(0, 0%, 10%)" />
        {/* Eye shine */}
        <circle cx="35" cy="51" r="1.5" fill="white" />
        <circle cx="71" cy="51" r="1.5" fill="white" />
      </g>

      {/* Nose */}
      <ellipse cx="50" cy="68" rx="8" ry="5" fill="hsl(0, 0%, 20%)" />
      <ellipse cx="50" cy="67" rx="3" ry="2" fill="hsl(0, 0%, 35%)" />

      {/* Blush cheeks */}
      <ellipse cx="22" cy="65" rx="6" ry="4" fill="hsl(350, 80%, 80%)" opacity="0.6" />
      <ellipse cx="78" cy="65" rx="6" ry="4" fill="hsl(350, 80%, 80%)" opacity="0.6" />

      {/* Smile */}
      <path
        d="M42,75 Q50,82 58,75"
        stroke="hsl(0, 0%, 20%)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default PandaMascot;
