import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { AnimatedMascot } from '@/components/mascots/AnimatedMascot';
import { MascotType } from '@/config/mascotCharacters';

interface GameCelebrationProps {
  /** Whether to show the celebration */
  isActive: boolean;
  /** Duration in milliseconds before auto-hiding */
  duration?: number;
  /** Callback when celebration ends */
  onComplete?: () => void;
  /** Optional mascot type to show celebrating */
  mascotType?: MascotType;
  /** Show mascot overlay (defaults to true) */
  showMascot?: boolean;
}

/**
 * Full-screen celebration component with confetti and optional mascot
 * 
 * Uses canvas-confetti for performant particle effects.
 * Shows for 3 seconds by default, then calls onComplete.
 */
export function GameCelebration({
  isActive,
  duration = 3000,
  onComplete,
  mascotType = 'star',
  showMascot = true,
}: GameCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    // Fire confetti burst
    fireConfetti();

    // Auto-hide after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [isActive, duration, onComplete]);

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
      aria-hidden="true"
    >
      {/* Semi-transparent overlay for emphasis */}
      <div className="absolute inset-0 bg-black/10 animate-fade-in" />
      
      {/* Celebrating mascot in center */}
      {showMascot && (
        <div className="relative z-10 w-32 h-32 md:w-48 md:h-48">
          <AnimatedMascot
            type={mascotType}
            isCelebrating={true}
            animated={true}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Fire a burst of colorful confetti
 */
function fireConfetti() {
  // Kid-friendly bright colors
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

  // First burst - center
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors,
    startVelocity: 45,
    gravity: 0.8,
    scalar: 1.2,
  });

  // Second burst - left side (delayed)
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors,
      startVelocity: 40,
    });
  }, 150);

  // Third burst - right side (delayed)
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors,
      startVelocity: 40,
    });
  }, 300);

  // Finale burst - top
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 100,
      origin: { y: 0.3, x: 0.5 },
      colors,
      startVelocity: 30,
      gravity: 1.2,
    });
  }, 450);
}

export default GameCelebration;
