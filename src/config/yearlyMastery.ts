/**
 * Yearly Mastery Requirements
 * 
 * Defines graduation requirements and milestones for each age (3-8).
 * Children must meet these requirements to "graduate" to the next age level.
 */

export interface ModeRequirement {
  minLevel: number;
  minAccuracy: number;
}

export interface YearlyMasteryConfig {
  ageYear: number;
  requiredModes: Record<string, ModeRequirement>;
  optionalChallenges: string[];
  graduationRewards: string[];
  certificate: {
    title: string;
    description: string;
    icon: string;
  };
  focusAreas: string[];
  suggestedTimePerDay: number; // in minutes
}

export const YEARLY_MASTERY_REQUIREMENTS: Record<number, YearlyMasteryConfig> = {
  // AGE 3: Foundation & Introduction
  3: {
    ageYear: 3,
    requiredModes: {
      'counting-order': { minLevel: 3, minAccuracy: 70 },
      'number-sense': { minLevel: 3, minAccuracy: 70 },
      'shapes': { minLevel: 2, minAccuracy: 70 },
      'addition-basic': { minLevel: 2, minAccuracy: 65 }
    },
    optionalChallenges: [
      'Try counting to 20',
      'Explore puzzle mode',
      'Play with all shape types'
    ],
    graduationRewards: [
      'Age 4 Explorer Badge',
      'New avatar items unlocked',
      'Harder challenges available'
    ],
    certificate: {
      title: 'Age 3 Math Explorer',
      description: 'Completed Age 3 learning journey!',
      icon: '🌟'
    },
    focusAreas: ['Number recognition', 'Basic shapes', 'Counting to 20'],
    suggestedTimePerDay: 10
  },

  // AGE 4: Building Confidence
  4: {
    ageYear: 4,
    requiredModes: {
      'counting-order': { minLevel: 5, minAccuracy: 75 },
      'number-sense': { minLevel: 5, minAccuracy: 75 },
      'shapes': { minLevel: 4, minAccuracy: 75 },
      'addition-basic': { minLevel: 5, minAccuracy: 70 },
      'subtraction-basic': { minLevel: 3, minAccuracy: 65 },
      'skip-counting': { minLevel: 3, minAccuracy: 70 }
    },
    optionalChallenges: [
      'Count to 50',
      'Complete 5 puzzle levels',
      'Try number line games'
    ],
    graduationRewards: [
      'Age 5 Achiever Badge',
      'Premium avatar items',
      'More game modes unlocked'
    ],
    certificate: {
      title: 'Age 4 Math Achiever',
      description: 'Mastered Age 4 math skills!',
      icon: '⭐'
    },
    focusAreas: ['Counting to 50', 'Addition & Subtraction basics', 'Patterns'],
    suggestedTimePerDay: 15
  },

  // AGE 5: Strengthening Skills
  5: {
    ageYear: 5,
    requiredModes: {
      'counting-order': { minLevel: 7, minAccuracy: 80 },
      'addition-basic': { minLevel: 8, minAccuracy: 75 },
      'subtraction-basic': { minLevel: 6, minAccuracy: 75 },
      'number-sense': { minLevel: 7, minAccuracy: 80 },
      'skip-counting': { minLevel: 5, minAccuracy: 75 },
      'time': { minLevel: 3, minAccuracy: 70 },
      'measurement': { minLevel: 3, minAccuracy: 70 }
    },
    optionalChallenges: [
      'Count to 100',
      'Complete all puzzle levels',
      'Try word problems',
      'Learn about money'
    ],
    graduationRewards: [
      'Age 6 Champion Badge',
      'Special theme unlocked',
      'Advanced modes available'
    ],
    certificate: {
      title: 'Age 5 Math Champion',
      description: 'Conquered Age 5 challenges!',
      icon: '🏆'
    },
    focusAreas: ['Addition to 20', 'Subtraction to 20', 'Time basics', 'Measurement'],
    suggestedTimePerDay: 15
  },

  // AGE 6: Expanding Horizons
  6: {
    ageYear: 6,
    requiredModes: {
      'addition-basic': { minLevel: 10, minAccuracy: 80 },
      'subtraction-basic': { minLevel: 8, minAccuracy: 80 },
      'addition-advanced': { minLevel: 4, minAccuracy: 70 },
      'multiplication-basic': { minLevel: 4, minAccuracy: 70 },
      'time': { minLevel: 5, minAccuracy: 75 },
      'money': { minLevel: 4, minAccuracy: 70 },
      'place-value': { minLevel: 4, minAccuracy: 75 }
    },
    optionalChallenges: [
      'Master addition facts',
      'Try division games',
      'Complete speed challenges',
      'Solve word problems'
    ],
    graduationRewards: [
      'Age 7 Master Badge',
      'Expert avatar collection',
      'Speed math unlocked'
    ],
    certificate: {
      title: 'Age 6 Math Master',
      description: 'Achieved Age 6 mastery!',
      icon: '🎖️'
    },
    focusAreas: ['Two-digit addition', 'Introduction to multiplication', 'Time & Money'],
    suggestedTimePerDay: 20
  },

  // AGE 7: Building Fluency
  7: {
    ageYear: 7,
    requiredModes: {
      'addition-basic': { minLevel: 15, minAccuracy: 85 },
      'subtraction-basic': { minLevel: 12, minAccuracy: 85 },
      'addition-advanced': { minLevel: 8, minAccuracy: 75 },
      'subtraction-advanced': { minLevel: 6, minAccuracy: 75 },
      'multiplication-basic': { minLevel: 8, minAccuracy: 75 },
      'division-basic': { minLevel: 5, minAccuracy: 70 },
      'word-problems': { minLevel: 5, minAccuracy: 70 }
    },
    optionalChallenges: [
      'Master times tables',
      'Complete speed challenges',
      'Solve complex word problems',
      'Try all measurement units'
    ],
    graduationRewards: [
      'Age 8 Expert Badge',
      'Legendary avatar items',
      'Championship mode unlocked'
    ],
    certificate: {
      title: 'Age 7 Math Expert',
      description: 'Became an Age 7 expert!',
      icon: '👑'
    },
    focusAreas: ['Multiplication tables', 'Division basics', 'Multi-step problems'],
    suggestedTimePerDay: 20
  },

  // AGE 8: Mastery Level
  8: {
    ageYear: 8,
    requiredModes: {
      'addition-basic': { minLevel: 20, minAccuracy: 90 },
      'subtraction-basic': { minLevel: 18, minAccuracy: 90 },
      'addition-advanced': { minLevel: 12, minAccuracy: 80 },
      'subtraction-advanced': { minLevel: 10, minAccuracy: 80 },
      'multiplication-basic': { minLevel: 15, minAccuracy: 85 },
      'division-basic': { minLevel: 10, minAccuracy: 80 },
      'word-problems': { minLevel: 10, minAccuracy: 75 },
      'speed-math': { minLevel: 8, minAccuracy: 80 }
    },
    optionalChallenges: [
      'Complete all modes',
      'Achieve 95% accuracy in speed math',
      'Master all times tables to 12',
      'Complete championship challenges'
    ],
    graduationRewards: [
      'Count with Dad Master Certificate',
      'All avatar items unlocked',
      'Special "Math Champion" theme',
      'Invitation to advanced content'
    ],
    certificate: {
      title: 'Math Champion',
      description: 'Completed the entire Count with Dad journey!',
      icon: '🏅'
    },
    focusAreas: ['All operations fluency', 'Complex problem solving', 'Mental math'],
    suggestedTimePerDay: 25
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getYearlyRequirements(age: number): YearlyMasteryConfig | null {
  const clampedAge = Math.max(3, Math.min(8, age));
  return YEARLY_MASTERY_REQUIREMENTS[clampedAge] || null;
}

export function checkGraduationEligibility(
  age: number,
  modeProgress: Record<string, { level: number; accuracy: number }>
): {
  isEligible: boolean;
  metRequirements: string[];
  unmetRequirements: string[];
  overallProgress: number;
} {
  const requirements = getYearlyRequirements(age);
  if (!requirements) {
    return { isEligible: false, metRequirements: [], unmetRequirements: [], overallProgress: 0 };
  }

  const metRequirements: string[] = [];
  const unmetRequirements: string[] = [];

  Object.entries(requirements.requiredModes).forEach(([modeId, req]) => {
    const progress = modeProgress[modeId] || { level: 0, accuracy: 0 };
    const levelMet = progress.level >= req.minLevel;
    const accuracyMet = progress.accuracy >= req.minAccuracy;

    if (levelMet && accuracyMet) {
      metRequirements.push(modeId);
    } else {
      unmetRequirements.push(modeId);
    }
  });

  const totalRequired = Object.keys(requirements.requiredModes).length;
  const overallProgress = (metRequirements.length / totalRequired) * 100;
  const isEligible = unmetRequirements.length === 0;

  return { isEligible, metRequirements, unmetRequirements, overallProgress };
}

export function getSuggestedFocusMode(
  age: number,
  modeProgress: Record<string, { level: number; accuracy: number }>
): string | null {
  const requirements = getYearlyRequirements(age);
  if (!requirements) return null;

  // Find mode with lowest progress relative to requirement
  let lowestProgressMode: string | null = null;
  let lowestProgressRatio = Infinity;

  Object.entries(requirements.requiredModes).forEach(([modeId, req]) => {
    const progress = modeProgress[modeId] || { level: 0, accuracy: 0 };
    const levelRatio = progress.level / req.minLevel;
    const accuracyRatio = progress.accuracy / req.minAccuracy;
    const overallRatio = (levelRatio + accuracyRatio) / 2;

    if (overallRatio < lowestProgressRatio) {
      lowestProgressRatio = overallRatio;
      lowestProgressMode = modeId;
    }
  });

  return lowestProgressMode;
}

export function getNextMilestone(
  age: number,
  modeProgress: Record<string, { level: number; accuracy: number }>
): { modeId: string; currentLevel: number; targetLevel: number } | null {
  const requirements = getYearlyRequirements(age);
  if (!requirements) return null;

  // Find next achievable milestone
  for (const [modeId, req] of Object.entries(requirements.requiredModes)) {
    const progress = modeProgress[modeId] || { level: 0, accuracy: 0 };
    if (progress.level < req.minLevel) {
      return {
        modeId,
        currentLevel: progress.level,
        targetLevel: req.minLevel
      };
    }
  }

  return null;
}

export function getCertificateForAge(age: number): YearlyMasteryConfig['certificate'] | null {
  const requirements = getYearlyRequirements(age);
  return requirements?.certificate || null;
}
