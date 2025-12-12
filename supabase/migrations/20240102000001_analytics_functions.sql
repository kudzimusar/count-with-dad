-- Analytics aggregation functions for profile and progress features
-- These functions provide optimized database queries for analytics calculations

-- Function to get today's stats (sessions, minutes, score)
CREATE OR REPLACE FUNCTION public.get_today_stats(user_uuid UUID)
RETURNS TABLE (
  sessions_count BIGINT,
  total_minutes NUMERIC,
  total_score BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as sessions_count,
    ROUND(SUM(duration) / 60.0, 2)::NUMERIC as total_minutes,
    SUM(score)::BIGINT as total_score
  FROM public.session_history
  WHERE user_id = user_uuid
    AND DATE(date::timestamptz) = CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get weekly stats (sessions, total minutes, avg duration, days active)
CREATE OR REPLACE FUNCTION public.get_weekly_stats(user_uuid UUID)
RETURNS TABLE (
  sessions_count BIGINT,
  total_minutes NUMERIC,
  avg_duration NUMERIC,
  days_active BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as sessions_count,
    ROUND(SUM(duration) / 60.0, 2)::NUMERIC as total_minutes,
    ROUND(AVG(duration) / 60.0, 2)::NUMERIC as avg_duration,
    COUNT(DISTINCT DATE(date::timestamptz))::BIGINT as days_active
  FROM public.session_history
  WHERE user_id = user_uuid
    AND date::timestamptz >= CURRENT_DATE - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get overall progress percentages
CREATE OR REPLACE FUNCTION public.get_overall_progress(user_uuid UUID)
RETURNS TABLE (
  counting_progress NUMERIC,
  puzzle_progress NUMERIC,
  math_progress NUMERIC,
  overall_progress NUMERIC
) AS $$
DECLARE
  highest_count_val INTEGER;
  puzzles_solved_val INTEGER;
  math_solved_val INTEGER;
BEGIN
  SELECT highest_count, puzzles_solved, math_solved
  INTO highest_count_val, puzzles_solved_val, math_solved_val
  FROM public.progress
  WHERE user_id = user_uuid;
  
  RETURN QUERY
  SELECT 
    LEAST(100, (COALESCE(highest_count_val, 0) / 100.0 * 100))::NUMERIC as counting_progress,
    LEAST(100, (COALESCE(puzzles_solved_val, 0) / 50.0 * 100))::NUMERIC as puzzle_progress,
    LEAST(100, (COALESCE(math_solved_val, 0) / 50.0 * 100))::NUMERIC as math_progress,
    ROUND(
      (LEAST(100, (COALESCE(highest_count_val, 0) / 100.0 * 100)) +
       LEAST(100, (COALESCE(puzzles_solved_val, 0) / 50.0 * 100)) +
       LEAST(100, (COALESCE(math_solved_val, 0) / 50.0 * 100)) / 3.0
      ), 2
    )::NUMERIC as overall_progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user account statistics
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS TABLE (
  days_active INTEGER,
  total_sessions BIGINT,
  member_since TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(COUNT(DISTINCT DATE(sh.date::timestamptz))::INTEGER, 0) as days_active,
    COUNT(sh.id)::BIGINT as total_sessions,
    p.created_at as member_since
  FROM public.profiles p
  LEFT JOIN public.session_history sh ON sh.user_id = p.user_id
  WHERE p.user_id = user_uuid
  GROUP BY p.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_today_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_weekly_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_overall_progress(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_stats(UUID) TO authenticated;

