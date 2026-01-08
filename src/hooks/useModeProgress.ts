import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Per-mode progress tracking with localStorage cache and Supabase sync
 * Uses user_math_progress table for cloud storage
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
 * Hook for managing per-mode progress with localStorage cache + Supabase sync
 */
export function useModeProgress(userId: string = 'guest') {
  const [progress, setProgress] = useState<AllModeProgress>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const pendingSyncsRef = useRef<Set<string>>(new Set());

  // Load progress - prefer Supabase for authenticated users, fallback to localStorage
  useEffect(() => {
    async function loadProgress() {
      // For guest users, only use localStorage
      if (userId === 'guest') {
        try {
          const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
          if (stored) {
            setProgress(JSON.parse(stored));
          }
        } catch (e) {
          console.error('Failed to load mode progress from localStorage:', e);
        }
        setIsLoaded(true);
        return;
      }

      // For authenticated users, load from user_math_progress table
      try {
        const { data, error } = await supabase
          .from('user_math_progress')
          .select('*')
          .eq('user_id', userId);

        if (error) {
          console.error('Failed to load math mode progress from Supabase:', error);
        }

        if (data && data.length > 0) {
          // Convert database rows to progress map
          const cloudProgress: AllModeProgress = {};
          data.forEach(row => {
            cloudProgress[row.mode_id] = {
              currentLevel: row.current_level || 1,
              highestLevel: row.highest_level_reached || 1,
              problemsSolved: row.total_problems_attempted || 0,
              accuracy: Number(row.overall_accuracy) || 0,
              starsEarned: row.total_stars_earned || 0,
              lastPlayedAt: row.last_played_at || '',
            };
          });
          setProgress(cloudProgress);
          // Update localStorage cache
          localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(cloudProgress));
          console.log('Loaded math mode progress from cloud:', Object.keys(cloudProgress).length, 'modes');
        } else {
          // No cloud data, check localStorage for migration
          const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
          if (stored) {
            const localProgress = JSON.parse(stored) as AllModeProgress;
            setProgress(localProgress);
            // Migrate local data to cloud
            for (const modeId of Object.keys(localProgress)) {
              await syncModeToCloud(userId, modeId, localProgress[modeId]);
            }
            console.log('Migrated local progress to cloud');
          }
        }
      } catch (e) {
        console.error('Failed to load mode progress:', e);
        // Fallback to localStorage
        try {
          const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
          if (stored) {
            setProgress(JSON.parse(stored));
          }
        } catch (localError) {
          console.error('Failed to load from localStorage:', localError);
        }
      }
      setIsLoaded(true);
    }

    loadProgress();
  }, [userId]);

  // Sync a single mode to cloud
  const syncModeToCloud = useCallback(async (uid: string, modeId: string, modeData: ModeProgressData) => {
    if (uid === 'guest') return;

    try {
      const { error } = await supabase
        .from('user_math_progress')
        .upsert({
          user_id: uid,
          mode_id: modeId,
          current_level: modeData.currentLevel,
          highest_level_reached: modeData.highestLevel,
          total_stars_earned: modeData.starsEarned,
          total_problems_attempted: modeData.problemsSolved,
          overall_accuracy: modeData.accuracy,
          last_played_at: modeData.lastPlayedAt || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,mode_id'
        });

      if (error) {
        console.error(`Failed to sync mode ${modeId} to cloud:`, error);
        // Store as backup for later sync
        const backupKey = `${STORAGE_KEY}_backup_${uid}`;
        const existing = JSON.parse(localStorage.getItem(backupKey) || '{}');
        existing[modeId] = modeData;
        localStorage.setItem(backupKey, JSON.stringify(existing));
      } else {
        console.log(`Mode ${modeId} synced to cloud`);
      }
    } catch (e) {
      console.error('Cloud sync failed:', e);
    }
  }, []);

  // Save to localStorage and schedule cloud sync
  const persistProgress = useCallback((newProgress: AllModeProgress, changedModeId?: string) => {
    // Always save to localStorage immediately (fast)
    try {
      localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(newProgress));
    } catch (e) {
      console.error('Failed to save mode progress to localStorage:', e);
    }

    // Sync changed mode to cloud
    if (userId !== 'guest' && changedModeId && newProgress[changedModeId]) {
      pendingSyncsRef.current.add(changedModeId);
      setIsSyncing(true);
      syncModeToCloud(userId, changedModeId, newProgress[changedModeId]).finally(() => {
        pendingSyncsRef.current.delete(changedModeId);
        if (pendingSyncsRef.current.size === 0) {
          setIsSyncing(false);
        }
      });
    }
  }, [userId, syncModeToCloud]);

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
   * Get total stars across all modes
   */
  const getTotalStars = useCallback((): number => {
    return Object.values(progress).reduce((sum, mode) => sum + (mode.starsEarned || 0), 0);
  }, [progress]);

  /**
   * Get total problems solved across all modes
   */
  const getTotalProblemsSolved = useCallback((): number => {
    return Object.values(progress).reduce((sum, mode) => sum + (mode.problemsSolved || 0), 0);
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
      
      const newProgress = {
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

      // Persist immediately
      persistProgress(newProgress, modeId);
      
      return newProgress;
    });
  }, [persistProgress]);

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

    // Also record the attempt in user_level_attempts table (async, fire-and-forget)
    if (userId !== 'guest') {
      supabase
        .from('user_level_attempts')
        .insert({
          user_id: userId,
          mode_id: modeId,
          level_number: result.level,
          problems_attempted: result.problemsCount,
          problems_correct: Math.round(result.problemsCount * result.accuracy / 100),
          accuracy: result.accuracy / 100,
          stars_earned: result.starsEarned,
          passed: result.passed,
          completed_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) {
            console.error('Failed to record level attempt:', error);
          } else {
            console.log('Level attempt recorded to cloud');
          }
        });
    }
    
    console.log('Level attempt processed:', {
      modeId,
      passed: result.passed,
      newLevel: result.passed ? result.level + 1 : existing.currentLevel,
      totalStars: existing.starsEarned + result.starsEarned,
    });
  }, [progress, saveModeProgress, userId]);

  /**
   * Reset progress for a specific mode
   */
  const resetModeProgress = useCallback((modeId: string) => {
    setProgress(prev => {
      const updated = { ...prev };
      delete updated[modeId];
      
      // Update localStorage
      localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(updated));
      
      return updated;
    });

    // Delete from cloud
    if (userId !== 'guest') {
      supabase
        .from('user_math_progress')
        .delete()
        .eq('user_id', userId)
        .eq('mode_id', modeId)
        .then(({ error }) => {
          if (error) console.error('Failed to reset mode in cloud:', error);
        });
    }
  }, [userId]);

  /**
   * Reset all progress
   */
  const resetAllProgress = useCallback(() => {
    setProgress({});
    // Also clear from localStorage
    localStorage.removeItem(`${STORAGE_KEY}_${userId}`);
    // Clear from cloud too
    if (userId !== 'guest') {
      supabase
        .from('user_math_progress')
        .delete()
        .eq('user_id', userId)
        .then(({ error }) => {
          if (error) console.error('Failed to reset cloud progress:', error);
        });
    }
  }, [userId]);

  /**
   * Force sync all modes to cloud (call before logout)
   */
  const forceSync = useCallback(async () => {
    if (userId === 'guest' || Object.keys(progress).length === 0) return;
    
    const syncPromises = Object.keys(progress).map(modeId => 
      syncModeToCloud(userId, modeId, progress[modeId])
    );
    
    await Promise.all(syncPromises);
  }, [userId, progress, syncModeToCloud]);

  return {
    progress,
    isLoaded,
    isSyncing,
    getModeProgress,
    getModeLevel,
    getAllLevels,
    getAllStars,
    getTotalStars,
    getTotalProblemsSolved,
    saveModeProgress,
    recordLevelAttempt,
    resetModeProgress,
    resetAllProgress,
    forceSync,
  };
}
