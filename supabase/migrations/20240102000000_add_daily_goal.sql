-- Add daily_goal column to progress table
-- This allows daily goal preferences to be persisted across devices

ALTER TABLE public.progress 
ADD COLUMN IF NOT EXISTS daily_goal INTEGER DEFAULT 20;

-- Update existing records to have default daily goal
UPDATE public.progress 
SET daily_goal = 20 
WHERE daily_goal IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.progress.daily_goal IS 'Daily counting goal for the child (default: 20)';

