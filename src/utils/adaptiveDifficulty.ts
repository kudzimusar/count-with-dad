/**
 * Adaptive Difficulty Engine
 * 
 * Adjusts problem difficulty based on real-time performance metrics.
 * Uses accuracy, speed, hint usage, and streak to determine optimal challenge level.
 */

export interface PerformanceMetrics {
  recentAccuracy: number;       // Last 10 problems (0-100)
  averageTimePerProblem: number; // In seconds
  hintsUsedPercent: number;     // % of problems where hints were used (0-100)
  streakLength: number;         // Consecutive correct answers
  totalProblems: number;        // Total problems attempted in session
}

export interface DifficultyAdjustment {
  action: 'increase' | 'decrease' | 'hold';
  magnitude: 'small' | 'medium' | 'large';
  reason: string;
  emoji: string;
}

export interface DifficultyConfig {
  maxNumber: number;
  operandMax: number;
  includeVisuals: boolean;
  timeLimit?: number;
  problemTypes: string[];
}

// Target time per problem by age (in seconds)
const TARGET_TIME_BY_AGE: Record<number, number> = {
  3: 30,
  4: 25,
  5: 20,
  6: 15,
  7: 12,
  8: 10,
};

/**
 * Calculate difficulty adjustment based on performance metrics
 */
export function calculateDifficultyAdjustment(
  metrics: PerformanceMetrics,
  userAge: number
): DifficultyAdjustment {
  const targetTime = TARGET_TIME_BY_AGE[userAge] || 15;

  // Need at least 5 problems to make adjustments
  if (metrics.totalProblems < 5) {
    return {
      action: 'hold',
      magnitude: 'small',
      reason: 'Warming up...',
      emoji: '🌟'
    };
  }

  // Rule 1: LARGE INCREASE - Exceptional performance
  if (
    metrics.recentAccuracy >= 95 &&
    metrics.averageTimePerProblem < targetTime * 0.6 &&
    metrics.hintsUsedPercent === 0 &&
    metrics.streakLength >= 8
  ) {
    return {
      action: 'increase',
      magnitude: 'large',
      reason: 'You\'re a superstar! Ready for a big challenge!',
      emoji: '🚀'
    };
  }

  // Rule 2: MEDIUM INCREASE - Very good performance
  if (
    metrics.recentAccuracy >= 90 &&
    metrics.averageTimePerProblem < targetTime * 0.8 &&
    metrics.hintsUsedPercent <= 5 &&
    metrics.streakLength >= 5
  ) {
    return {
      action: 'increase',
      magnitude: 'medium',
      reason: 'Excellent! Let\'s try something a bit harder!',
      emoji: '⭐'
    };
  }

  // Rule 3: SMALL INCREASE - Good performance
  if (
    metrics.recentAccuracy >= 80 &&
    metrics.hintsUsedPercent <= 10
  ) {
    return {
      action: 'increase',
      magnitude: 'small',
      reason: 'Great work! Trying slightly harder problems.',
      emoji: '✨'
    };
  }

  // Rule 4: LARGE DECREASE - Struggling significantly
  if (
    metrics.recentAccuracy < 40 ||
    metrics.hintsUsedPercent > 70
  ) {
    return {
      action: 'decrease',
      magnitude: 'large',
      reason: 'Let\'s practice with easier problems first.',
      emoji: '💪'
    };
  }

  // Rule 5: MEDIUM DECREASE - Having difficulty
  if (
    metrics.recentAccuracy < 50 ||
    metrics.hintsUsedPercent > 50
  ) {
    return {
      action: 'decrease',
      magnitude: 'medium',
      reason: 'Let\'s slow down and practice more.',
      emoji: '🌈'
    };
  }

  // Rule 6: SMALL DECREASE - Slight struggle
  if (
    metrics.recentAccuracy < 60 ||
    metrics.hintsUsedPercent > 30
  ) {
    return {
      action: 'decrease',
      magnitude: 'small',
      reason: 'Adjusting to give you more practice.',
      emoji: '🎯'
    };
  }

  // Rule 7: HOLD - Optimal zone (70-89% accuracy)
  return {
    action: 'hold',
    magnitude: 'small',
    reason: 'You\'re doing great at this level!',
    emoji: '🌟'
  };
}

/**
 * Apply difficulty adjustment to base configuration
 */
export function applyDifficultyAdjustment(
  baseConfig: DifficultyConfig,
  adjustment: DifficultyAdjustment
): DifficultyConfig {
  const multipliers = {
    increase: { small: 1.15, medium: 1.3, large: 1.5 },
    decrease: { small: 0.85, medium: 0.7, large: 0.5 },
    hold: { small: 1, medium: 1, large: 1 }
  };

  const factor = multipliers[adjustment.action][adjustment.magnitude];

  return {
    ...baseConfig,
    maxNumber: Math.max(3, Math.round(baseConfig.maxNumber * factor)),
    operandMax: Math.max(2, Math.round(baseConfig.operandMax * factor)),
    // Keep or add visuals when struggling
    includeVisuals: adjustment.action === 'decrease' ? true : baseConfig.includeVisuals,
    // Increase time limit when struggling
    timeLimit: baseConfig.timeLimit 
      ? Math.round(baseConfig.timeLimit * (adjustment.action === 'decrease' ? 1.5 : 1))
      : undefined,
    problemTypes: baseConfig.problemTypes
  };
}

/**
 * Get difficulty description for display
 */
export function getDifficultyDescription(
  adjustment: DifficultyAdjustment
): string {
  const descriptions = {
    increase: {
      small: 'Stepping up slightly',
      medium: 'Nice challenge ahead',
      large: 'Big challenge mode!'
    },
    decrease: {
      small: 'Building confidence',
      medium: 'Practice makes perfect',
      large: 'Mastering the basics'
    },
    hold: {
      small: 'Perfect pace',
      medium: 'Perfect pace',
      large: 'Perfect pace'
    }
  };

  return descriptions[adjustment.action][adjustment.magnitude];
}

/**
 * Calculate initial difficulty based on age and level
 */
export function getInitialDifficulty(
  age: number,
  level: number,
  modeId: string
): DifficultyConfig {
  // Base configuration scales with age
  const baseMaxNumber = Math.min(100, 5 + (age - 3) * 15 + level * 5);
  const baseOperandMax = Math.min(50, 2 + (age - 3) * 8 + level * 3);

  // Younger children always get visuals initially
  const includeVisuals = age <= 5 || level <= 3;

  return {
    maxNumber: baseMaxNumber,
    operandMax: baseOperandMax,
    includeVisuals,
    problemTypes: getProblemTypesForLevel(modeId, level, age)
  };
}

/**
 * Get appropriate problem types for level and age
 */
function getProblemTypesForLevel(
  modeId: string,
  level: number,
  age: number
): string[] {
  const baseProblemTypes: Record<string, string[]> = {
    'addition-basic': ['simple', 'objects', 'dots'],
    'subtraction-basic': ['take_away', 'comparison'],
    'multiplication-basic': ['equal_groups', 'arrays'],
    'division-basic': ['sharing', 'grouping'],
  };

  const types = baseProblemTypes[modeId] || ['simple'];

  // Add more complex types at higher levels and ages
  if (level > 5 && age >= 5) {
    types.push('missing_operand');
  }
  if (level > 10 && age >= 6) {
    types.push('word_problem');
  }

  return types;
}
