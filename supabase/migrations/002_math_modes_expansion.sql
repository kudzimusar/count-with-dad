-- FILE: 002_math_modes_expansion.sql
-- Purpose: Add new tables for expanded math modes
-- ⚠️ CRITICAL: Do NOT modify existing tables that have user data

CREATE TABLE math_modes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mode_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  category VARCHAR(50),
  min_age INTEGER NOT NULL,
  max_age INTEGER NOT NULL,
  total_levels INTEGER DEFAULT 20,
  skills JSONB DEFAULT '[]',
  unlock_requirements JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE math_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mode_id VARCHAR(50) REFERENCES math_modes(mode_id) ON DELETE CASCADE,
  level_number INTEGER NOT NULL,
  difficulty_tier VARCHAR(20),
  number_range_min INTEGER DEFAULT 0,
  number_range_max INTEGER DEFAULT 10,
  problem_types JSONB DEFAULT '[]',
  has_visual_aids BOOLEAN DEFAULT TRUE,
  has_tutorial_video BOOLEAN DEFAULT FALSE,
  tutorial_video_url TEXT,
  estimated_time_minutes INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mode_id, level_number)
);

CREATE TABLE user_math_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mode_id VARCHAR(50) NOT NULL,
  current_level INTEGER DEFAULT 1,
  highest_level_reached INTEGER DEFAULT 1,
  total_stars_earned INTEGER DEFAULT 0,
  total_problems_attempted INTEGER DEFAULT 0,
  total_problems_correct INTEGER DEFAULT 0,
  overall_accuracy DECIMAL(5,4) DEFAULT 0.0000,
  total_time_spent_seconds INTEGER DEFAULT 0,
  last_played_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, mode_id)
);

CREATE TABLE user_level_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mode_id VARCHAR(50) NOT NULL,
  level_number INTEGER NOT NULL,
  attempt_number INTEGER DEFAULT 1,
  problems_attempted INTEGER DEFAULT 10,
  problems_correct INTEGER DEFAULT 0,
  accuracy DECIMAL(5,4),
  stars_earned INTEGER CHECK (stars_earned >= 0 AND stars_earned <= 3),
  time_spent_seconds INTEGER,
  average_time_per_problem DECIMAL(6,2),
  hints_used INTEGER DEFAULT 0,
  passed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE problem_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mode_id VARCHAR(50) NOT NULL,
  level_number INTEGER NOT NULL,
  problem_type VARCHAR(50),
  problem_data JSONB,
  user_answer VARCHAR(50),
  correct_answer VARCHAR(50),
  is_correct BOOLEAN,
  time_spent_seconds INTEGER,
  hint_used BOOLEAN DEFAULT FALSE,
  attempt_number INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_math_progress_user_id ON user_math_progress(user_id);
CREATE INDEX idx_user_math_progress_mode_id ON user_math_progress(mode_id);
CREATE INDEX idx_user_level_attempts_user_id ON user_level_attempts(user_id);
CREATE INDEX idx_user_level_attempts_mode_level ON user_level_attempts(mode_id, level_number);
CREATE INDEX idx_problem_attempts_user_id ON problem_attempts(user_id);
CREATE INDEX idx_problem_attempts_mode_level ON problem_attempts(mode_id, level_number);

-- Enable RLS on new tables
ALTER TABLE math_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE math_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_math_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_level_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for math_modes (public read)
CREATE POLICY "Everyone can view math modes" ON math_modes
  FOR SELECT USING (true);

-- RLS Policies for user_math_progress
CREATE POLICY "Users can view own math progress" ON user_math_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own math progress" ON user_math_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own math progress" ON user_math_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_level_attempts
CREATE POLICY "Users can view own level attempts" ON user_level_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own level attempts" ON user_level_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for problem_attempts
CREATE POLICY "Users can view own problem attempts" ON problem_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own problem attempts" ON problem_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update user_math_progress after level attempt
CREATE OR REPLACE FUNCTION update_math_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_math_progress (
    user_id,
    mode_id,
    current_level,
    highest_level_reached,
    total_stars_earned,
    total_problems_attempted,
    total_problems_correct,
    overall_accuracy,
    total_time_spent_seconds,
    last_played_at
  )
  VALUES (
    NEW.user_id,
    NEW.mode_id,
    NEW.level_number,
    NEW.level_number,
    NEW.stars_earned,
    NEW.problems_attempted,
    NEW.problems_correct,
    NEW.accuracy,
    NEW.time_spent_seconds,
    NEW.completed_at
  )
  ON CONFLICT (user_id, mode_id)
  DO UPDATE SET
    current_level = CASE
      WHEN NEW.passed THEN GREATEST(user_math_progress.current_level, NEW.level_number + 1)
      ELSE user_math_progress.current_level
    END,
    highest_level_reached = GREATEST(user_math_progress.highest_level_reached, NEW.level_number),
    total_stars_earned = user_math_progress.total_stars_earned + NEW.stars_earned,
    total_problems_attempted = user_math_progress.total_problems_attempted + NEW.problems_attempted,
    total_problems_correct = user_math_progress.total_problems_correct + NEW.problems_correct,
    overall_accuracy = (user_math_progress.total_problems_correct + NEW.problems_correct)::DECIMAL / 
                      (user_math_progress.total_problems_attempted + NEW.problems_attempted),
    total_time_spent_seconds = user_math_progress.total_time_spent_seconds + NEW.time_spent_seconds,
    last_played_at = NEW.completed_at,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_level_attempt
  AFTER INSERT ON user_level_attempts
  FOR EACH ROW
  EXECUTE FUNCTION update_math_progress();

-- Seed initial math modes
INSERT INTO math_modes (mode_id, name, display_name, description, icon, category, min_age, max_age, total_levels, skills) VALUES
('number-sense', 'numberSense', 'Number Sense', 'Learn to compare and order numbers', '🔍', 'foundation', 3, 5, 20, '["comparison", "ordering"]'),
('shapes', 'shapeRecognition', 'Shapes & Patterns', 'Identify shapes and complete patterns', '🟦', 'foundation', 3, 5, 20, '["shapes", "patterns"]'),
('addition-basic', 'additionBasic', 'Addition', 'Add numbers within 10', '➕', 'operations', 4, 6, 20, '["addition"]'),
('subtraction-basic', 'subtractionBasic', 'Subtraction', 'Subtract numbers within 10', '➖', 'operations', 5, 7, 20, '["subtraction"]'),
('skip-counting', 'skipCounting', 'Skip Counting', 'Count by 2s, 5s, and 10s', '🦘', 'foundation', 5, 7, 20, '["skip_counting", "patterns"]'),
('time', 'timeTelling', 'Time Basics', 'Learn to tell time', '⏰', 'applications', 5, 7, 20, '["time"]'),
('addition-advanced', 'additionAdvanced', 'Big Addition', 'Add two-digit numbers', '🔢➕', 'operations', 6, 8, 20, '["addition", "place_value"]'),
('subtraction-advanced', 'subtractionAdvanced', 'Big Subtraction', 'Subtract two-digit numbers', '🔢➖', 'operations', 6, 8, 20, '["subtraction", "place_value"]'),
('money', 'moneyValue', 'Money & Value', 'Count coins and make purchases', '💰', 'applications', 6, 8, 25, '["money", "addition"]'),
('measurement', 'measurement', 'Measurement', 'Compare sizes and lengths', '📏', 'applications', 6, 8, 20, '["measurement", "comparison"]'),
('place-value', 'placeValue', 'Place Value', 'Understand tens and ones', '🧮', 'foundation', 7, 8, 20, '["place_value"]'),
('multiplication-basic', 'multiplicationBasic', 'Multiplication', 'Learn multiplication tables', '✖️', 'advanced', 7, 8, 25, '["multiplication"]'),
('division-basic', 'divisionBasic', 'Division', 'Share and group numbers', '➗', 'advanced', 7, 8, 20, '["division"]'),
('number-line', 'numberLineMastery', 'Number Line', 'Use number lines for math', '📊', 'foundation', 6, 8, 20, '["number_line", "visual_math"]'),
('word-problems', 'wordProblems', 'Word Problems', 'Solve math in stories', '📖', 'applications', 6, 8, 25, '["word_problems", "reading"]'),
('speed-math', 'speedMath', 'Speed Challenge', 'Fast mental math', '⚡', 'advanced', 7, 8, 25, '["mental_math", "speed"]');
