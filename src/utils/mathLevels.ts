import { MathMode, UnlockRequirement } from '@/types/math';

export type ModeDefinition = MathMode;

export const MATH_MODES: MathMode[] = [
  {
    id: 'number-sense',
    name: 'numberSense',
    displayName: 'Number Sense',
    icon: '🔍',
    description: 'Learn to compare and order numbers',
    ageRange: [3, 5],
    totalLevels: 20,
    unlockRequirements: [],
    category: 'foundation',
    skills: ['comparison', 'ordering', 'counting']
  },
  {
    id: 'shapes',
    name: 'shapeRecognition',
    displayName: 'Shapes & Patterns',
    icon: '🟦',
    description: 'Identify shapes and complete patterns',
    ageRange: [3, 5],
    totalLevels: 20,
    unlockRequirements: [
      { type: 'level_complete', modeId: 'number-sense', level: 5 }
    ],
    category: 'foundation',
    skills: ['shapes', 'patterns', 'spatial_reasoning']
  },
  {
    id: 'addition-basic',
    name: 'additionBasic',
    displayName: 'Addition',
    icon: '➕',
    description: 'Add numbers within 10',
    ageRange: [4, 6],
    totalLevels: 20,
    unlockRequirements: [],
    category: 'operations',
    skills: ['addition', 'number_sense']
  },
  {
    id: 'subtraction-basic',
    name: 'subtractionBasic',
    displayName: 'Subtraction',
    icon: '➖',
    description: 'Subtract numbers within 10',
    ageRange: [5, 7],
    totalLevels: 20,
    unlockRequirements: [
      { type: 'level_complete', modeId: 'addition-basic', level: 10 }
    ],
    category: 'operations',
    skills: ['subtraction', 'inverse_operations']
  },
  {
    id: 'skip-counting',
    name: 'skipCounting',
    displayName: 'Skip Counting',
    icon: '🦘',
    description: 'Count by 2s, 5s, and 10s',
    ageRange: [5, 7],
    totalLevels: 20,
    unlockRequirements: [
      {
        type: 'multi_mode',
        alternativeRequirements: [
          [
            { type: 'level_complete', modeId: 'addition-basic', level: 10 }
          ]
        ]
      }
    ],
    category: 'foundation',
    skills: ['skip_counting', 'patterns', 'multiplication_readiness']
  },
  {
    id: 'time',
    name: 'timeTelling',
    displayName: 'Time Basics',
    icon: '⏰',
    description: 'Learn to tell time',
    ageRange: [5, 7],
    totalLevels: 20,
    unlockRequirements: [
      { type: 'level_complete', modeId: 'number-sense', level: 10 }
    ],
    category: 'applications',
    skills: ['time', 'number_sense', 'real_world_math']
  },
  {
    id: 'addition-advanced',
    name: 'additionAdvanced',
    displayName: 'Big Addition',
    icon: '🔢➕',
    description: 'Add two-digit numbers with carrying',
    ageRange: [6, 8],
    totalLevels: 20,
    unlockRequirements: [
      {
        type: 'multi_mode',
        alternativeRequirements: [
          [
            { type: 'level_complete', modeId: 'addition-basic', level: 15 },
            { type: 'level_complete', modeId: 'subtraction-basic', level: 5 }
          ]
        ]
      }
    ],
    category: 'operations',
    skills: ['addition', 'place_value', 'carrying']
  },
  {
    id: 'subtraction-advanced',
    name: 'subtractionAdvanced',
    displayName: 'Big Subtraction',
    icon: '🔢➖',
    description: 'Subtract two-digit numbers with borrowing',
    ageRange: [6, 8],
    totalLevels: 20,
    unlockRequirements: [
      {
        type: 'multi_mode',
        alternativeRequirements: [
          [
            { type: 'level_complete', modeId: 'subtraction-basic', level: 15 },
            { type: 'level_complete', modeId: 'addition-advanced', level: 5 }
          ]
        ]
      }
    ],
    category: 'operations',
    skills: ['subtraction', 'place_value', 'borrowing']
  },
  {
    id: 'money',
    name: 'moneyValue',
    displayName: 'Money & Value',
    icon: '💰',
    description: 'Count coins and make purchases',
    ageRange: [6, 8],
    totalLevels: 25,
    unlockRequirements: [
      { type: 'level_complete', modeId: 'addition-advanced', level: 10 }
    ],
    category: 'applications',
    skills: ['money', 'addition', 'real_world_math']
  },
  {
    id: 'measurement',
    name: 'measurement',
    displayName: 'Measurement',
    icon: '📏',
    description: 'Compare sizes and lengths',
    ageRange: [6, 8],
    totalLevels: 20,
    unlockRequirements: [
      { type: 'level_complete', modeId: 'number-sense', level: 15 }
    ],
    category: 'applications',
    skills: ['measurement', 'comparison', 'estimation']
  },
  {
    id: 'place-value',
    name: 'placeValue',
    displayName: 'Place Value',
    icon: '🧮',
    description: 'Understand tens and ones',
    ageRange: [7, 8],
    totalLevels: 20,
    unlockRequirements: [
      { type: 'level_complete', modeId: 'addition-advanced', level: 10 }
    ],
    category: 'foundation',
    skills: ['place_value', 'number_sense', 'base_ten']
  },
  {
    id: 'multiplication-basic',
    name: 'multiplicationBasic',
    displayName: 'Multiplication',
    icon: '✖️',
    description: 'Learn multiplication as equal groups',
    ageRange: [7, 8],
    totalLevels: 25,
    unlockRequirements: [
      {
        type: 'multi_mode',
        alternativeRequirements: [
          [
            { type: 'level_complete', modeId: 'addition-advanced', level: 10 },
            { type: 'level_complete', modeId: 'skip-counting', level: 20 }
          ]
        ]
      }
    ],
    category: 'advanced',
    skills: ['multiplication', 'repeated_addition', 'arrays']
  },
  {
    id: 'division-basic',
    name: 'divisionBasic',
    displayName: 'Division',
    icon: '➗',
    description: 'Share and group numbers equally',
    ageRange: [7, 8],
    totalLevels: 20,
    unlockRequirements: [
      { type: 'level_complete', modeId: 'multiplication-basic', level: 15 }
    ],
    category: 'advanced',
    skills: ['division', 'sharing', 'grouping']
  },
  {
    id: 'number-line',
    name: 'numberLineMastery',
    displayName: 'Number Line',
    icon: '📊',
    description: 'Use number lines for math operations',
    ageRange: [6, 8],
    totalLevels: 20,
    unlockRequirements: [
      { type: 'level_complete', modeId: 'addition-basic', level: 10 }
    ],
    category: 'foundation',
    skills: ['number_line', 'visual_math', 'counting']
  },
  {
    id: 'word-problems',
    name: 'wordProblems',
    displayName: 'Word Problems',
    icon: '📖',
    description: 'Solve math in real-world stories',
    ageRange: [6, 8],
    totalLevels: 25,
    unlockRequirements: [
      {
        type: 'multi_mode',
        alternativeRequirements: [
          [
            { type: 'level_complete', modeId: 'addition-advanced', level: 5 },
            { type: 'level_complete', modeId: 'subtraction-advanced', level: 5 }
          ]
        ]
      }
    ],
    category: 'applications',
    skills: ['word_problems', 'critical_thinking', 'reading_comprehension']
  },
  {
    id: 'speed-math',
    name: 'speedMath',
    displayName: 'Speed Challenge',
    icon: '⚡',
    description: 'Fast mental math practice',
    ageRange: [7, 8],
    totalLevels: 25,
    unlockRequirements: [
      {
        type: 'multi_mode',
        alternativeRequirements: [
          [
            { type: 'level_complete', modeId: 'addition-advanced', level: 15 },
            { type: 'level_complete', modeId: 'subtraction-advanced', level: 15 }
          ]
        ]
      }
    ],
    category: 'advanced',
    skills: ['mental_math', 'speed', 'automaticity']
  }
];

export function checkModeUnlock(
  modeId: string,
  userProgress: Record<string, number>,
  userAge: number
): { unlocked: boolean; reason?: string } {
  const mode = MATH_MODES.find(m => m.id === modeId);
  if (!mode) return { unlocked: false, reason: 'Mode not found' };

  // Check age gate
  if (userAge < mode.ageRange[0]) {
    return {
      unlocked: false,
      reason: `Available from age ${mode.ageRange[0]}`
    };
  }

  // No requirements = always unlocked
  if (!mode.unlockRequirements || mode.unlockRequirements.length === 0) {
    return { unlocked: true };
  }

  // Check each requirement
  for (const req of mode.unlockRequirements) {
    if (req.type === 'level_complete') {
      const currentLevel = userProgress[req.modeId!] || 0;
      if (currentLevel < req.level!) {
        return {
          unlocked: false,
          reason: `Complete ${MATH_MODES.find(m => m.id === req.modeId)?.displayName} Level ${req.level}`
        };
      }
    }

    if (req.type === 'multi_mode' && req.alternativeRequirements) {
      let anyGroupMet = false;
      for (const reqGroup of req.alternativeRequirements) {
        const allMet = reqGroup.every(subReq => {
          if (subReq.type === 'level_complete') {
            return (userProgress[subReq.modeId!] || 0) >= subReq.level!;
          }
          return true;
        });
        if (allMet) {
          anyGroupMet = true;
          break;
        }
      }
      if (!anyGroupMet) {
        return {
          unlocked: false,
          reason: 'Complete prerequisite modes'
        };
      }
    }
  }

  return { unlocked: true };
}

export function getUnlockedModes(
  userProgress: Record<string, number>,
  userAge: number
): MathMode[] {
  return MATH_MODES.filter(mode =>
    checkModeUnlock(mode.id, userProgress, userAge).unlocked
  );
}

export function getLockedModesWithRequirements(
  userProgress: Record<string, number>,
  userAge: number
): Array<{ mode: MathMode; unlockReason: string }> {
  return MATH_MODES
    .filter(mode => !checkModeUnlock(mode.id, userProgress, userAge).unlocked)
    .map(mode => ({
      mode,
      unlockReason: checkModeUnlock(mode.id, userProgress, userAge).reason || ''
    }));
}
