import { useCallback, useRef } from 'react';

/**
 * Game Sound Effects Hook
 * 
 * Handles audio feedback for game events:
 * - playCorrect(): Happy chime for correct answers
 * - playWrong(): Gentle thud for wrong answers
 * - playPop(): Bubble sound for button clicks
 * 
 * Audio files should be placed in /public/sounds/ and referenced here.
 * Currently uses console.log placeholders - swap with real audio when available.
 */

interface UseGameSoundsOptions {
  enabled?: boolean;
  volume?: number;
}

interface GameSounds {
  playCorrect: () => void;
  playWrong: () => void;
  playPop: () => void;
  playLevelComplete: () => void;
}

// Audio file paths (to be replaced with real audio files)
const SOUND_PATHS = {
  correct: '/sounds/correct.mp3',
  wrong: '/sounds/wrong.mp3',
  pop: '/sounds/pop.mp3',
  levelComplete: '/sounds/level-complete.mp3',
};

export function useGameSounds(options: UseGameSoundsOptions = {}): GameSounds {
  const { enabled = true, volume = 0.5 } = options;
  
  // Cache audio elements for performance
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());

  const playSound = useCallback((soundKey: keyof typeof SOUND_PATHS) => {
    if (!enabled) return;

    const path = SOUND_PATHS[soundKey];
    
    // Try to play cached audio or create new
    try {
      let audio = audioCache.current.get(soundKey);
      
      if (!audio) {
        audio = new Audio(path);
        audio.volume = volume;
        audioCache.current.set(soundKey, audio);
      }
      
      // Reset and play
      audio.currentTime = 0;
      audio.play().catch((err) => {
        // Audio file not found - fallback to console log
        console.log(`🔊 [GameSound] ${soundKey.toUpperCase()}`, { path, error: err.message });
        
        // Fallback: Use Web Audio API for simple beeps
        playFallbackBeep(soundKey);
      });
    } catch (err) {
      console.log(`🔊 [GameSound] ${soundKey.toUpperCase()} (fallback mode)`);
      playFallbackBeep(soundKey);
    }
  }, [enabled, volume]);

  // Fallback beep using Web Audio API (works without audio files)
  const playFallbackBeep = useCallback((soundKey: keyof typeof SOUND_PATHS) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Different tones for different sounds
      switch (soundKey) {
        case 'correct':
          oscillator.frequency.value = 880; // A5 - happy high note
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.3);
          break;
          
        case 'wrong':
          oscillator.frequency.value = 220; // A3 - low gentle thud
          oscillator.type = 'triangle';
          gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.2);
          break;
          
        case 'pop':
          oscillator.frequency.value = 600; // Pop sound
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.1);
          break;
          
        case 'levelComplete':
          // Play a happy ascending arpeggio
          const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            const startTime = ctx.currentTime + (i * 0.15);
            gain.gain.setValueAtTime(0.2, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
            osc.start(startTime);
            osc.stop(startTime + 0.3);
          });
          break;
      }
    } catch (err) {
      // Web Audio not available - silent fallback
      console.log(`🔊 [GameSound] ${soundKey} (silent - no audio support)`);
    }
  }, []);

  const playCorrect = useCallback(() => playSound('correct'), [playSound]);
  const playWrong = useCallback(() => playSound('wrong'), [playSound]);
  const playPop = useCallback(() => playSound('pop'), [playSound]);
  const playLevelComplete = useCallback(() => playSound('levelComplete'), [playSound]);

  return {
    playCorrect,
    playWrong,
    playPop,
    playLevelComplete,
  };
}
