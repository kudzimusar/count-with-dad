import { useCallback, useRef } from 'react';
import { useHaptics } from './useHaptics';

/**
 * Game Sound Effects Hook
 * 
 * Handles audio feedback for game events:
 * - playCorrect(): Happy chime for correct answers + success haptic
 * - playWrong(): Gentle thud for wrong answers + error haptic
 * - playPop(): Bubble sound for button clicks + medium haptic
 * - playLevelComplete(): Victory sound + success haptic
 * 
 * Audio files should be placed in /public/sounds/ and referenced here.
 * Falls back to Web Audio API generated sounds when MP3s are unavailable.
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
  const haptics = useHaptics();
  
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

  // Polyphonic fallback using Web Audio API - pleasant musical sounds
  const playFallbackBeep = useCallback((soundKey: keyof typeof SOUND_PATHS) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();

      // Helper to play a note with envelope
      const playNote = (freq: number, startTime: number, duration: number, vol: number, type: OscillatorType = 'sine') => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = type;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      switch (soundKey) {
        case 'correct': {
          // Pleasant Major Triad (C-E-G) played simultaneously - chime sound
          const now = ctx.currentTime;
          playNote(523.25, now, 0.4, 0.15, 'sine');      // C5
          playNote(659.25, now, 0.4, 0.12, 'sine');      // E5
          playNote(783.99, now, 0.5, 0.10, 'sine');      // G5
          playNote(1046.50, now + 0.05, 0.45, 0.08, 'sine'); // C6 (slight delay for shimmer)
          break;
        }
          
        case 'wrong': {
          // Gentle low thud - soft triangle wave with quick decay
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 150; // Low frequency
          osc.type = 'triangle';
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }
          
        case 'pop': {
          // Quick bubble pop - high frequency blip
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }
          
        case 'levelComplete': {
          // Victory arpeggio - ascending major scale with final chord
          const now = ctx.currentTime;
          const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
          // Quick ascending run
          notes.forEach((freq, i) => {
            playNote(freq, now + (i * 0.08), 0.2, 0.12, 'sine');
          });
          // Final triumphant chord (C major with octave)
          const chordTime = now + (notes.length * 0.08) + 0.1;
          playNote(523.25, chordTime, 0.6, 0.15, 'sine');  // C5
          playNote(659.25, chordTime, 0.6, 0.12, 'sine');  // E5
          playNote(783.99, chordTime, 0.6, 0.12, 'sine');  // G5
          playNote(1046.50, chordTime, 0.7, 0.10, 'sine'); // C6
          break;
        }
      }
    } catch (err) {
      // Web Audio not available - silent fallback
      console.log(`🔊 [GameSound] ${soundKey} (silent - no audio support)`);
    }
  }, []);

  const playCorrect = useCallback(() => {
    haptics.trigger('success');
    playSound('correct');
  }, [playSound, haptics]);
  
  const playWrong = useCallback(() => {
    haptics.trigger('error');
    playSound('wrong');
  }, [playSound, haptics]);
  
  const playPop = useCallback(() => {
    haptics.trigger('medium');
    playSound('pop');
  }, [playSound, haptics]);
  
  const playLevelComplete = useCallback(() => {
    haptics.trigger('success');
    playSound('levelComplete');
  }, [playSound, haptics]);

  return {
    playCorrect,
    playWrong,
    playPop,
    playLevelComplete,
  };
}
