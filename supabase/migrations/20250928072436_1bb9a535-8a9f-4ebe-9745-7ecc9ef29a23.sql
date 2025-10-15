-- =============================================
-- UTILITY FUNCTIONS FOR LMS OPERATIONS
-- =============================================

-- Function to safely increment user's total watch time
CREATE OR REPLACE FUNCTION public.increment_watch_time(
  user_id UUID,
  additional_seconds INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    total_watch_time_hours = COALESCE(total_watch_time_hours, 0) + (additional_seconds::FLOAT / 3600),
    updated_at = now()
  WHERE id = user_id;
END;
$$;

-- Function to update user streak
CREATE OR REPLACE FUNCTION public.update_user_streak(
  user_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_streak INTEGER;
  last_activity DATE;
BEGIN
  -- Get the user's last learning activity
  SELECT DATE(MAX(created_at)) INTO last_activity
  FROM public.learning_sessions
  WHERE user_id = user_id;

  -- Calculate streak
  IF last_activity = CURRENT_DATE THEN
    -- User is active today, increment streak
    UPDATE public.profiles
    SET streak_days = COALESCE(streak_days, 0) + 1,
        updated_at = now()
    WHERE id = user_id
    RETURNING streak_days INTO current_streak;
  ELSIF last_activity < CURRENT_DATE - INTERVAL '1 day' THEN
    -- User missed a day, reset streak
    UPDATE public.profiles
    SET streak_days = 1,
        updated_at = now()
    WHERE id = user_id
    RETURNING streak_days INTO current_streak;
  ELSE
    -- Get current streak
    SELECT COALESCE(streak_days, 0) INTO current_streak
    FROM public.profiles
    WHERE id = user_id;
  END IF;

  RETURN COALESCE(current_streak, 1);
END;
$$;

-- Function to calculate engagement score
CREATE OR REPLACE FUNCTION public.calculate_engagement_score(
  user_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_sessions INTEGER;
  completed_sessions INTEGER;
  avg_progress FLOAT;
  streak_bonus INTEGER;
  final_score INTEGER;
BEGIN
  -- Get session metrics
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE completed = true),
    AVG(progress_percentage)
  INTO total_sessions, completed_sessions, avg_progress
  FROM public.learning_sessions
  WHERE user_id = user_id
  AND created_at >= NOW() - INTERVAL '30 days';

  -- Get streak bonus
  SELECT COALESCE(streak_days, 0) INTO streak_bonus
  FROM public.profiles
  WHERE id = user_id;

  -- Calculate engagement score (0-100)
  final_score := LEAST(100, GREATEST(0, 
    (COALESCE(completed_sessions, 0) * 10) + 
    (COALESCE(avg_progress, 0) * 0.5) + 
    (LEAST(streak_bonus, 20) * 2)
  ));

  -- Update profile with new engagement score
  UPDATE public.profiles
  SET engagement_score = final_score,
      updated_at = now()
  WHERE id = user_id;

  RETURN final_score;
END;
$$;