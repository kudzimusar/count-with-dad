import { useState, useCallback, useMemo } from 'react';
import { PerformanceMetrics, calculateDifficultyAdjustment, DifficultyAdjustment } from '@/utils/adaptiveDifficulty';

export interface ProblemAttempt {
  isCorrect: boolean;
  timeSpent: number; // seconds
  hintUsed: boolean;
  problemId: string;
  timestamp: number;
}

interface UsePerformanceTrackerResult {
  recordAttempt: (attempt: Omit<ProblemAttempt, 'timestamp'>) => void;
  getMetrics: () => PerformanceMetrics;
  getAdjustment: (userAge: number) => DifficultyAdjustment;
  resetSession: () => void;
  attempts: ProblemAttempt[];
  currentStreak: number;
}

const MAX_RECENT_ATTEMPTS = 10;

export function usePerformanceTracker(): UsePerformanceTrackerResult {
  const [attempts, setAttempts] = useState<ProblemAttempt[]>([]);

  const recordAttempt = useCallback((attempt: Omit<ProblemAttempt, 'timestamp'>) => {
    const fullAttempt: ProblemAttempt = {
      ...attempt,
      timestamp: Date.now()
    };

    setAttempts(prev => {
      // Keep only the most recent attempts for efficiency
      const updated = [...prev, fullAttempt];
      if (updated.length > 50) {
        return updated.slice(-50);
      }
      return updated;
    });
  }, []);

  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = attempts.length - 1; i >= 0; i--) {
      if (attempts[i].isCorrect) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [attempts]);

  const getMetrics = useCallback((): PerformanceMetrics => {
    if (attempts.length === 0) {
      return {
        recentAccuracy: 50, // Neutral starting point
        averageTimePerProblem: 15,
        hintsUsedPercent: 0,
        streakLength: 0,
        totalProblems: 0
      };
    }

    // Use only recent attempts for accuracy calculation
    const recentAttempts = attempts.slice(-MAX_RECENT_ATTEMPTS);
    
    const correctCount = recentAttempts.filter(a => a.isCorrect).length;
    const hintsCount = recentAttempts.filter(a => a.hintUsed).length;
    const totalTime = recentAttempts.reduce((sum, a) => sum + a.timeSpent, 0);

    return {
      recentAccuracy: (correctCount / recentAttempts.length) * 100,
      averageTimePerProblem: totalTime / recentAttempts.length,
      hintsUsedPercent: (hintsCount / recentAttempts.length) * 100,
      streakLength: currentStreak,
      totalProblems: attempts.length
    };
  }, [attempts, currentStreak]);

  const getAdjustment = useCallback((userAge: number): DifficultyAdjustment => {
    const metrics = getMetrics();
    return calculateDifficultyAdjustment(metrics, userAge);
  }, [getMetrics]);

  const resetSession = useCallback(() => {
    setAttempts([]);
  }, []);

  return {
    recordAttempt,
    getMetrics,
    getAdjustment,
    resetSession,
    attempts,
    currentStreak
  };
}
