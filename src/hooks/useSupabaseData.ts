import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AppState, SessionRecord, FeedbackData } from '@/types';

export function useSupabaseData(userId: string | undefined) {
  const saveProfile = useCallback(async (data: {
    childName: string;
    childAge: number;
    childAvatar: string;
    childGender?: string;
    parentEmail?: string;
    parentRelationship?: string;
  }) => {
    if (!userId) return { error: 'No user ID' };

    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        child_name: data.childName,
        child_age: data.childAge,
        child_avatar: data.childAvatar,
        child_gender: data.childGender || null,
        parent_email: data.parentEmail || null,
        parent_relationship: data.parentRelationship || null,
        registered_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id' // Handle conflicts on user_id unique constraint
      });

    if (error) {
      console.error('Profile save error:', error);
    }

    return { error };
  }, [userId]);

  const saveProgress = useCallback(async (progress: Partial<AppState>) => {
    if (!userId) return { error: 'No user ID' };

    const { error } = await supabase
      .from('progress')
      .upsert({
        user_id: userId,
        highest_count: progress.highestCount,
        stars: progress.stars,
        puzzle_level: progress.puzzleLevel,
        math_level: progress.mathLevel,
        challenge_level: progress.challengeLevel,
        puzzles_solved: progress.puzzlesSolved,
        math_solved: progress.mathSolved,
        unlocked_puzzle_levels: progress.unlockedPuzzleLevels,
        unlocked_math_levels: progress.unlockedMathLevels,
        completed_numbers: progress.completedNumbers,
        correct_answers_count: progress.correctAnswersCount,
        daily_goal: progress.dailyGoal,
      }, {
        onConflict: 'user_id' // Handle conflicts on user_id unique constraint
      });

    if (error) {
      console.error('Progress save error:', error);
    }

    return { error };
  }, [userId]);

  const saveSession = useCallback(async (session: SessionRecord) => {
    if (!userId) return { error: 'No user ID' };

    const { error } = await supabase
      .from('session_history')
      .insert({
        user_id: userId,
        date: session.date,
        duration: session.duration,
        screen: session.screen,
        mode: session.mode || null,
        score: session.score,
      });

    return { error };
  }, [userId]);

  const saveFeedback = useCallback(async (feedback: FeedbackData) => {
    if (!userId) return { error: 'No user ID' };

    const { error } = await supabase
      .from('feedback')
      .insert({
        user_id: userId,
        type: feedback.type,
        message: feedback.message,
        context: feedback.context || null,
      });

    return { error };
  }, [userId]);

  const trackEvent = useCallback(async (eventName: string, eventData?: Record<string, any>) => {
    if (!userId) return { error: 'No user ID' };

    const { error } = await supabase
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_name: eventName,
        event_data: eventData || null,
      });

    return { error };
  }, [userId]);

  const loadProfile = useCallback(async () => {
    if (!userId) return { data: null, error: 'No user ID' };

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    return { data, error };
  }, [userId]);

  const loadProgress = useCallback(async () => {
    if (!userId) return { data: null, error: 'No user ID' };

    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    return { data, error };
  }, [userId]);

  const loadSessionHistory = useCallback(async () => {
    if (!userId) return { data: null, error: 'No user ID' };

    const { data, error } = await supabase
      .from('session_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    return { data, error };
  }, [userId]);

  const updateSubscription = useCallback(async (status: 'free' | 'trial' | 'premium', expiresAt?: string) => {
    if (!userId) return { error: 'No user ID' };

    const { error } = await supabase
      .from('progress')
      .upsert({
        user_id: userId,
        subscription_status: status,
        subscription_started_at: new Date().toISOString(),
        subscription_expires_at: expiresAt || null,
        subscription_type: 'mock',
      });

    return { error };
  }, [userId]);

  const loadSubscription = useCallback(async () => {
    if (!userId) return { data: null, error: 'No user ID' };

    const { data, error } = await supabase
      .from('progress')
      .select('subscription_status, subscription_expires_at, subscription_started_at, subscription_type')
      .eq('user_id', userId)
      .maybeSingle();

    return { data, error };
  }, [userId]);

  const getTodayStats = useCallback(async () => {
    if (!userId) return { data: null, error: 'No user ID' };

    const { data, error } = await supabase.rpc('get_today_stats', {
      user_uuid: userId
    });

    return { data: data?.[0] || null, error };
  }, [userId]);

  const getWeeklyStats = useCallback(async () => {
    if (!userId) return { data: null, error: 'No user ID' };

    const { data, error } = await supabase.rpc('get_weekly_stats', {
      user_uuid: userId
    });

    return { data: data?.[0] || null, error };
  }, [userId]);

  const getUserStats = useCallback(async () => {
    if (!userId) return { data: null, error: 'No user ID' };

    const { data, error } = await supabase.rpc('get_user_stats', {
      user_uuid: userId
    });

    return { data: data?.[0] || null, error };
  }, [userId]);

  return {
    saveProfile,
    saveProgress,
    saveSession,
    saveFeedback,
    trackEvent,
    loadProfile,
    loadProgress,
    loadSessionHistory,
    updateSubscription,
    loadSubscription,
    getTodayStats,
    getWeeklyStats,
    getUserStats,
  };
}
