import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AgeEngagementStats {
  ageYear: number;
  totalSessions: number;
  totalTimeMinutes: number;
  avgSessionMinutes: number;
  modesUsed: string[];
  favoriteMode: string | null;
  successRate: number;
}

interface ModeAgeStats {
  modeId: string;
  ageYear: number;
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  avgTimePerProblem: number;
  difficultyScore: number; // 1-5 scale based on age appropriateness
}

interface DifficultyAnalysis {
  isAppropriate: boolean;
  tooEasy: boolean;
  tooHard: boolean;
  recommendation: string;
  adjustedDifficulty?: number;
}

export function useAgeAnalytics(userId?: string) {
  // Track age-specific engagement event
  const trackAgeEngagement = useCallback(async (data: {
    ageYear: number;
    modeId: string;
    duration: number;
    problemsAttempted: number;
    problemsCorrect: number;
    hintsUsed: number;
    difficultyLevel: number;
  }) => {
    if (!userId) return { error: 'No user ID' };

    const { error } = await supabase
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_name: 'age_engagement',
        event_data: {
          ...data,
          accuracy: data.problemsAttempted > 0 
            ? (data.problemsCorrect / data.problemsAttempted) * 100 
            : 0,
          timestamp: new Date().toISOString()
        }
      });

    return { error };
  }, [userId]);

  // Track mode usage by age
  const trackModeUsage = useCallback(async (data: {
    ageYear: number;
    modeId: string;
    level: number;
    sessionDuration: number;
    completed: boolean;
  }) => {
    if (!userId) return { error: 'No user ID' };

    const { error } = await supabase
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_name: 'mode_usage_by_age',
        event_data: {
          ...data,
          timestamp: new Date().toISOString()
        }
      });

    // Also update age_variant_completions for persistent tracking
    if (data.completed) {
      await supabase
        .from('age_variant_completions')
        .upsert({
          user_id: userId,
          mode_id: data.modeId,
          age_year: data.ageYear,
          highest_level_at_age: data.level,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,mode_id,age_year'
        });
    }

    return { error };
  }, [userId]);

  // Track difficulty appropriateness
  const trackDifficultyCheck = useCallback(async (data: {
    ageYear: number;
    modeId: string;
    level: number;
    accuracy: number;
    avgResponseTime: number;
    hintsUsed: number;
    streakLength: number;
  }) => {
    if (!userId) return { error: 'No user ID' };

    // Calculate difficulty appropriateness score
    const analysis = analyzeDifficulty(data);

    const { error } = await supabase
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_name: 'difficulty_check',
        event_data: {
          ...data,
          analysis,
          timestamp: new Date().toISOString()
        }
      });

    return { error, analysis };
  }, [userId]);

  // Get engagement stats for a specific age year
  const getAgeEngagementStats = useCallback(async (ageYear: number): Promise<AgeEngagementStats | null> => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('event_data')
        .eq('user_id', userId)
        .eq('event_name', 'age_engagement')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

      if (error || !data) return null;

      // Filter events for the specific age year
      const ageEvents = data.filter(e => 
        (e.event_data as Record<string, unknown>)?.ageYear === ageYear
      );

      if (ageEvents.length === 0) return null;

      const modesUsed = new Set<string>();
      let totalTime = 0;
      let totalCorrect = 0;
      let totalAttempted = 0;
      const modeFrequency: Record<string, number> = {};

      ageEvents.forEach(e => {
        const eventData = e.event_data as Record<string, unknown>;
        const mode = eventData.modeId as string;
        modesUsed.add(mode);
        modeFrequency[mode] = (modeFrequency[mode] || 0) + 1;
        totalTime += (eventData.duration as number) || 0;
        totalCorrect += (eventData.problemsCorrect as number) || 0;
        totalAttempted += (eventData.problemsAttempted as number) || 0;
      });

      const favoriteMode = Object.entries(modeFrequency)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || null;

      return {
        ageYear,
        totalSessions: ageEvents.length,
        totalTimeMinutes: Math.round(totalTime / 60),
        avgSessionMinutes: Math.round(totalTime / 60 / ageEvents.length),
        modesUsed: Array.from(modesUsed),
        favoriteMode,
        successRate: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0
      };
    } catch (e) {
      console.error('Failed to get age engagement stats:', e);
      return null;
    }
  }, [userId]);

  // Get mode stats broken down by age
  const getModeAgeStats = useCallback(async (modeId: string): Promise<ModeAgeStats[]> => {
    if (!userId) return [];

    try {
      const { data, error } = await supabase
        .from('age_variant_completions')
        .select('*')
        .eq('user_id', userId)
        .eq('mode_id', modeId);

      if (error || !data) return [];

      return data.map(d => ({
        modeId: d.mode_id,
        ageYear: d.age_year,
        totalAttempts: 0, // Would need to aggregate from analytics_events
        correctAttempts: 0,
        accuracy: Number(d.accuracy_at_age) * 100,
        avgTimePerProblem: 0,
        difficultyScore: calculateAgeDifficultyScore(d.age_year, Number(d.accuracy_at_age))
      }));
    } catch (e) {
      console.error('Failed to get mode age stats:', e);
      return [];
    }
  }, [userId]);

  // Get weekly summary for parent dashboard
  const getWeeklySummary = useCallback(async (ageYear: number) => {
    if (!userId) return null;

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('event_name, event_data, created_at')
        .eq('user_id', userId)
        .gte('created_at', weekAgo)
        .in('event_name', ['age_engagement', 'mode_usage_by_age', 'math_problem_solved']);

      if (error || !data) return null;

      const dailyStats: Record<string, { sessions: number; timeMinutes: number; problemsSolved: number }> = {};

      data.forEach(event => {
        const date = new Date(event.created_at).toISOString().split('T')[0];
        if (!dailyStats[date]) {
          dailyStats[date] = { sessions: 0, timeMinutes: 0, problemsSolved: 0 };
        }

        if (event.event_name === 'age_engagement') {
          dailyStats[date].sessions++;
          const eventData = event.event_data as Record<string, unknown>;
          dailyStats[date].timeMinutes += ((eventData.duration as number) || 0) / 60;
        }

        if (event.event_name === 'math_problem_solved') {
          dailyStats[date].problemsSolved++;
        }
      });

      return {
        ageYear,
        days: Object.entries(dailyStats).map(([date, stats]) => ({
          date,
          ...stats,
          timeMinutes: Math.round(stats.timeMinutes)
        })).sort((a, b) => a.date.localeCompare(b.date)),
        totalSessions: Object.values(dailyStats).reduce((sum, d) => sum + d.sessions, 0),
        totalTimeMinutes: Math.round(Object.values(dailyStats).reduce((sum, d) => sum + d.timeMinutes, 0)),
        totalProblemsSolved: Object.values(dailyStats).reduce((sum, d) => sum + d.problemsSolved, 0)
      };
    } catch (e) {
      console.error('Failed to get weekly summary:', e);
      return null;
    }
  }, [userId]);

  return {
    trackAgeEngagement,
    trackModeUsage,
    trackDifficultyCheck,
    getAgeEngagementStats,
    getModeAgeStats,
    getWeeklySummary
  };
}

// Helper function to analyze difficulty appropriateness
function analyzeDifficulty(data: {
  ageYear: number;
  accuracy: number;
  avgResponseTime: number;
  hintsUsed: number;
  streakLength: number;
}): DifficultyAnalysis {
  const { accuracy, avgResponseTime, hintsUsed, streakLength } = data;

  // Ideal ranges for "appropriate" difficulty
  const idealAccuracy = { min: 70, max: 90 }; // Not too easy, not too hard
  const idealResponseTime = { min: 3, max: 15 }; // seconds
  
  const tooEasy = accuracy > 95 && avgResponseTime < 3 && hintsUsed === 0 && streakLength > 10;
  const tooHard = accuracy < 50 || hintsUsed > 3 || avgResponseTime > 30;
  const isAppropriate = !tooEasy && !tooHard;

  let recommendation = 'Current difficulty is appropriate.';
  let adjustedDifficulty: number | undefined;

  if (tooEasy) {
    recommendation = 'Consider increasing difficulty - child is finding this too easy.';
    adjustedDifficulty = 1; // Increase
  } else if (tooHard) {
    recommendation = 'Consider decreasing difficulty or providing more support.';
    adjustedDifficulty = -1; // Decrease
  }

  return {
    isAppropriate,
    tooEasy,
    tooHard,
    recommendation,
    adjustedDifficulty
  };
}

// Helper to calculate age-appropriate difficulty score
function calculateAgeDifficultyScore(ageYear: number, accuracy: number): number {
  // 1 = too hard, 3 = just right, 5 = too easy
  if (accuracy < 0.5) return 1;
  if (accuracy < 0.65) return 2;
  if (accuracy < 0.85) return 3;
  if (accuracy < 0.95) return 4;
  return 5;
}
