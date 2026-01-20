/**
 * useHaptics Hook
 * 
 * Provides haptic feedback using the Vibration API.
 * Gracefully degrades on unsupported devices (desktop, iOS Safari).
 */

type HapticType = 'light' | 'medium' | 'success' | 'error';

interface HapticsAPI {
  trigger: (type: HapticType) => void;
  isSupported: boolean;
}

const HAPTIC_PATTERNS: Record<HapticType, number | number[]> = {
  light: 5,           // Quick tap for mascot touches
  medium: 15,         // UI button presses
  success: 50,        // Correct answer celebration
  error: [30, 50, 30], // Wrong answer: buzz-pause-buzz
};

export function useHaptics(): HapticsAPI {
  // Check for Vibration API support
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const trigger = (type: HapticType): void => {
    if (!isSupported) {
      // Silently skip on unsupported devices
      return;
    }

    try {
      const pattern = HAPTIC_PATTERNS[type];
      navigator.vibrate(pattern);
    } catch (error) {
      // Some browsers may throw even with 'vibrate' in navigator
      console.debug('Haptic feedback unavailable:', error);
    }
  };

  return {
    trigger,
    isSupported,
  };
}

export default useHaptics;
