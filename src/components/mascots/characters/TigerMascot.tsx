import React from 'react';

interface TigerMascotProps {
  animated?: boolean;
  className?: string;
}

export const TigerMascot: React.FC<TigerMascotProps> = ({ animated = true, className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full h-full ${className}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="tigerBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(35, 90%, 60%)" />
          <stop offset="50%" stopColor="hsl(30, 85%, 52%)" />
          <stop offset="100%" stopColor="hsl(25, 80%, 45%)" />
        </linearGradient>
        <linearGradient id="tigerWhiteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(0, 0%, 100%)" />
          <stop offset="100%" stopColor="hsl(35, 30%, 95%)" />
        </linearGradient>
      </defs>

      {/* Ears */}
      <circle cx="18" cy="22" r="14" fill="url(#tigerBodyGradient)" />
      <circle cx="82" cy="22" r="14" fill="url(#tigerBodyGradient)" />
      
      {/* Inner ears */}
      <circle cx="18" cy="22" r="8" fill="url(#tigerWhiteGradient)" />
      <circle cx="82" cy="22" r="8" fill="url(#tigerWhiteGradient)" />

      {/* Main head/body */}
      <ellipse
        cx="50"
        cy="55"
        rx="42"
        ry="42"
        fill="url(#tigerBodyGradient)"
      />

      {/* White face area */}
      <ellipse cx="50" cy="68" rx="24" ry="20" fill="url(#tigerWhiteGradient)" />
      <ellipse cx="35" cy="52" rx="10" ry="8" fill="url(#tigerWhiteGradient)" />
      <ellipse cx="65" cy="52" rx="10" ry="8" fill="url(#tigerWhiteGradient)" />

      {/* Tiger stripes */}
      <g fill="hsl(25, 70%, 25%)">
        {/* Forehead stripes */}
        <path d="M45,28 Q50,35 55,28" strokeWidth="3" stroke="hsl(25, 70%, 25%)" fill="none" strokeLinecap="round" />
        <path d="M35,32 Q38,40 42,32" strokeWidth="2.5" stroke="hsl(25, 70%, 25%)" fill="none" strokeLinecap="round" />
        <path d="M58,32 Q62,40 65,32" strokeWidth="2.5" stroke="hsl(25, 70%, 25%)" fill="none" strokeLinecap="round" />
        {/* Side stripes */}
        <path d="M15,45 Q22,52 18,60" strokeWidth="2.5" stroke="hsl(25, 70%, 25%)" fill="none" strokeLinecap="round" />
        <path d="M12,55 Q18,60 15,68" strokeWidth="2.5" stroke="hsl(25, 70%, 25%)" fill="none" strokeLinecap="round" />
        <path d="M85,45 Q78,52 82,60" strokeWidth="2.5" stroke="hsl(25, 70%, 25%)" fill="none" strokeLinecap="round" />
        <path d="M88,55 Q82,60 85,68" strokeWidth="2.5" stroke="hsl(25, 70%, 25%)" fill="none" strokeLinecap="round" />
      </g>

      {/* Highlight shine */}
      <ellipse
        cx="28"
        cy="42"
        rx="8"
        ry="10"
        fill="hsl(40, 100%, 75%)"
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
      <ellipse cx="50" cy="64" rx="6" ry="4" fill="hsl(350, 50%, 55%)" />
      <ellipse cx="50" cy="63" rx="2" ry="1.5" fill="hsl(350, 60%, 70%)" />

      {/* Whisker dots */}
      <g fill="hsl(0, 0%, 30%)">
        <circle cx="38" cy="70" r="1.5" />
        <circle cx="42" cy="72" r="1.5" />
        <circle cx="46" cy="70" r="1.5" />
        <circle cx="54" cy="70" r="1.5" />
        <circle cx="58" cy="72" r="1.5" />
        <circle cx="62" cy="70" r="1.5" />
      </g>

      {/* Blush cheeks */}
      <ellipse cx="22" cy="60" rx="5" ry="3" fill="hsl(350, 80%, 75%)" opacity="0.5" />
      <ellipse cx="78" cy="60" rx="5" ry="3" fill="hsl(350, 80%, 75%)" opacity="0.5" />

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

export default TigerMascot;
