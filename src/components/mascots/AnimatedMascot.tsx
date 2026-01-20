import React from 'react';
import { MascotType } from '@/config/mascotCharacters';
import { AppleMascot } from './characters/AppleMascot';
import { BananaMascot } from './characters/BananaMascot';
import { BlueberryMascot } from './characters/BlueberryMascot';
import { StarMascot } from './characters/StarMascot';
import { CookieMascot } from './characters/CookieMascot';
import { OrangeMascot } from './characters/OrangeMascot';

interface AnimatedMascotProps {
  type: MascotType;
  animated?: boolean;
  wiggle?: boolean;
  delay?: number;
  className?: string;
  /** When true, plays a happy jump celebration animation */
  isCelebrating?: boolean;
  /** When true, plays a gentle shake/no animation for wrong answers */
  isShaking?: boolean;
}

const MASCOT_COMPONENTS: Record<MascotType, React.FC<{ animated?: boolean; className?: string }>> = {
  apple: AppleMascot,
  banana: BananaMascot,
  blueberry: BlueberryMascot,
  star: StarMascot,
  cookie: CookieMascot,
  orange: OrangeMascot,
};

export const AnimatedMascot: React.FC<AnimatedMascotProps> = ({
  type,
  animated = true,
  wiggle = false,
  delay = 0,
  className = '',
  isCelebrating = false,
  isShaking = false,
}) => {
  const MascotComponent = MASCOT_COMPONENTS[type] || AppleMascot;

  // Build animation classes - celebration/shake override default animations
  let animationClasses = '';
  
  if (isCelebrating) {
    // Celebration mode - happy jump with sparkle
    animationClasses = 'mascot-celebrate';
  } else if (isShaking) {
    // Wrong answer - gentle shake
    animationClasses = 'mascot-shake';
  } else if (animated) {
    // Default animations
    animationClasses = `${wiggle ? 'mascot-wiggle' : 'mascot-float'} mascot-enter`;
  }

  return (
    <div
      className={`inline-flex items-center justify-center ${animationClasses} ${className}`}
      style={{
        animationDelay: delay > 0 ? `${delay}s` : undefined,
      }}
    >
      <MascotComponent animated={animated} />
    </div>
  );
};

export default AnimatedMascot;
