// Database types for Supabase tables

export interface YearlyProgress {
  id: string;
  user_id: string;
  age_year: number;
  modes_mastered: Record<string, { level: number; accuracy: number; stars: number }>;
  overall_mastery_percentage: number;
  graduation_status: 'in_progress' | 'pending_approval' | 'graduated';
  started_at: string;
}

export interface AgeVariantCompletion {
  id: string;
  user_id: string;
  mode_id: string;
  age_year: number;
  highest_level_at_age: number;
  accuracy_at_age: number;
  stars_earned_at_age: number;
  completed_at: string | null;
}

export interface GraduationHistory {
  id: string;
  user_id: string;
  from_age: number;
  to_age: number;
  graduated_at: string;
  approved_by: string;
  summary_data: {
    overallProgress: number;
    metRequirements: string[];
    totalStars?: number;
  } | null;
}

export interface Profile {
  id: string;
  email: string | null;
  child_name: string | null;
  child_age: number | null;
  parent_relationship: string | null;
  created_at: string;
  updated_at: string;
  registered_at: string | null;
}

export interface Progress {
  id: string;
  user_id: string;
  highest_number: number;
  total_sessions: number;
  total_time_minutes: number;
  daily_goal: number;
  current_level: number;
  stars: number;
  streak_days: number;
  last_session_date: string | null;
  badges_earned: string[];
  created_at: string;
  updated_at: string;
}

export interface SessionHistory {
  id: string;
  user_id: string;
  mode: string;
  duration_seconds: number;
  highest_number_reached: number | null;
  accuracy: number | null;
  session_date: string;
}

export interface Feedback {
  id: string;
  user_id: string | null;
  rating: number;
  feedback_text: string | null;
  category: string | null;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  user_id: string | null;
  event_type: string;
  event_data: Record<string, unknown>;
  created_at: string;
}
