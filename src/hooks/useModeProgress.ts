import { useState, useEffect, useCallback } from 'react';

/**
 * Per-mode progress tracking using localStorage
 * Tracks level, accuracy, and stars for each math mode independently
 */

export interface ModeProgressData {
  currentLevel: number;
  highestLevel: number;
  problemsSolved: number;
  accuracy: number;
  starsEarned: number;
  lastPlayedAt: string;
}

export interface AllModeProgress {
  [modeId: string]: ModeProgressData;
}

const STORAGE_KEY = 'math_mode_progress';

/**
 * Hook for managing per-mode progress with localStorage persistence
 */
export function useModeProgress(userId: string = 'guest') {
  const [progress, setProgress] = useState<AllModeProgress>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load mode progress:', e);
    }
    setIsLoaded(true);
  }, [userId]);

  // Persist progress to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(progress));
      } catch (e) {
        console.error('Failed to save mode progress:', e);
      }
    }
  }, [progress, userId, isLoaded]);

  /**
   * Get progress for a specific mode
   */
  const getModeProgress = useCallback((modeId: string): ModeProgressData => {
    return progress[modeId] || {
      currentLevel: 1,
      highestLevel: 1,
      problemsSolved: 0,
      accuracy: 0,
      starsEarned: 0,
      lastPlayedAt: '',
    };
  }, [progress]);

  /**
   * Get current level for a specific mode
   */
  const getModeLevel = useCallback((modeId: string): number => {
    return progress[modeId]?.currentLevel || 1;
  }, [progress]);

  /**
   * Get all mode levels as a simple map
   */
  const getAllLevels = useCallback((): Record<string, number> => {
    const levels: Record<string, number> = {};
    Object.keys(progress).forEach(modeId => {
      levels[modeId] = progress[modeId].currentLevel;
    });
    return levels;
  }, [progress]);

  /**
   * Get all stars as a simple map
   */
  const getAllStars = useCallback((): Record<string, number> => {
    const stars: Record<string, number> = {};
    Object.keys(progress).forEach(modeId => {
      stars[modeId] = progress[modeId].starsEarned;
    });
    return stars;
  }, [progress]);

  /**
   * Save/update progress for a specific mode
   */
  const saveModeProgress = useCallback((
    modeId: string,
    update: {
      currentLevel?: number;
      problemsSolved?: number;
      accuracy?: number;
      starsEarned?: number;
    }
  ) => {
    setProgress(prev => {
      const existing = prev[modeId] || {
        currentLevel: 1,
        highestLevel: 1,
        problemsSolved: 0,
        accuracy: 0,
        starsEarned: 0,
        lastPlayedAt: '',
      };

      const newLevel = update.currentLevel ?? existing.currentLevel;
      
      return {
        ...prev,
        [modeId]: {
          ...existing,
          currentLevel: newLevel,
          highestLevel: Math.max(existing.highestLevel, newLevel),
          problemsSolved: (existing.problemsSolved || 0) + (update.problemsSolved || 0),
          accuracy: update.accuracy ?? existing.accuracy,
          starsEarned: (existing.starsEarned || 0) + (update.starsEarned || 0),
          lastPlayedAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  /**
   * Record a completed level attempt
   */
  const recordLevelAttempt = useCallback((
    modeId: string,
    result: {
      passed: boolean;
      level: number;
      accuracy: number;
      starsEarned: number;
      problemsCount: number;
    }
  ) => {
    const existing = progress[modeId] || {
      currentLevel: 1,
      highestLevel: 1,
      problemsSolved: 0,
      accuracy: 0,
      starsEarned: 0,
      lastPlayedAt: '',
    };

    const updates: Parameters<typeof saveModeProgress>[1] = {
      problemsSolved: result.problemsCount,
      accuracy: result.accuracy,
      starsEarned: result.starsEarned,
    };

    // Only advance level if passed
    if (result.passed) {
      updates.currentLevel = result.level + 1;
    }

    saveModeProgress(modeId, updates);
  }, [progress, saveModeProgress]);

  /**
   * Reset progress for a specific mode
   */
  const resetModeProgress = useCallback((modeId: string) => {
    setProgress(prev => {
      const updated = { ...prev };
      delete updated[modeId];
      return updated;
    });
  }, []);

  /**
   * Reset all progress
   */
  const resetAllProgress = useCallback(() => {
    setProgress({});
  }, []);

  return {
    progress,
    isLoaded,
    getModeProgress,
    getModeLevel,
    getAllLevels,
    getAllStars,
    saveModeProgress,
    recordLevelAttempt,
    resetModeProgress,
    resetAllProgress,
  };
}
