/**
 * Age-Based Difficulty Configuration
 * 
 * This module provides difficulty parameters based on child's age and current level.
 * Each age group has its own progression path, ensuring that:
 * - A 3-year-old at Level 5 sees different problems than a 7-year-old at Level 5
 * - Visual aids decrease as age/level increases
 * - Number ranges increase appropriately for each age group
 */

export interface DifficultyConfig {
  // Number ranges
  maxNumber: number;
  operandRange: [number, number];
  resultRange: [number, number];
  
  // Visual settings
  includeVisuals: boolean;
  visualType: 'objects' | 'number_line' | 'array' | 'none';
  
  // Problem complexity
  problemTypes: string[];
  allowMissingNumber: boolean;
  allowMultiStep: boolean;
  
  // Timing (optional, for speed modes)
  timeLimit?: number;
}

// Base configurations for each age group
const AGE_BASE_CONFIG: Record<number, { startMax: number; visualsUntilLevel: number; baseOperandMax: number }> = {
  3: { startMax: 3, visualsUntilLevel: 15, baseOperandMax: 2 },
  4: { startMax: 5, visualsUntilLevel: 12, baseOperandMax: 3 },
  5: { startMax: 7, visualsUntilLevel: 10, baseOperandMax: 4 },
  6: { startMax: 10, visualsUntilLevel: 8, baseOperandMax: 5 },
  7: { startMax: 15, visualsUntilLevel: 5, baseOperandMax: 7 },
  8: { startMax: 20, visualsUntilLevel: 3, baseOperandMax: 10 },
};

/**
 * Get difficulty configuration for a specific age and level combination
 */
export function getDifficultyConfig(age: number, level: number, mode: string): DifficultyConfig {
  // Clamp age to supported range
  const clampedAge = Math.min(Math.max(age, 3), 8);
  const baseConfig = AGE_BASE_CONFIG[clampedAge];
  
  // Calculate progression multipliers
  const levelProgression = Math.min(level / 20, 1); // 0 to 1 as level goes from 1 to 20
  
  // Calculate number ranges based on age and level
  const maxNumber = Math.round(baseConfig.startMax + (levelProgression * (50 - baseConfig.startMax)));
  const operandMax = Math.round(baseConfig.baseOperandMax + (levelProgression * (25 - baseConfig.baseOperandMax)));
  
  // Determine if visuals should be shown
  const includeVisuals = level <= baseConfig.visualsUntilLevel;
  
  // Determine problem complexity
  const allowMissingNumber = level > 10 || clampedAge >= 6;
  const allowMultiStep = level > 15 || clampedAge >= 7;
  
  return {
    maxNumber,
    operandRange: [0, operandMax],
    resultRange: [0, maxNumber],
    includeVisuals,
    visualType: includeVisuals ? 'objects' : 'none',
    problemTypes: getProblemTypesForLevel(mode, clampedAge, level),
    allowMissingNumber,
    allowMultiStep,
    timeLimit: mode === 'speed-math' ? getSpeedTimeLimit(clampedAge, level) : undefined,
  };
}

/**
 * Get specific difficulty parameters for Addition mode
 */
export function getAdditionConfig(age: number, level: number): {
  maxSum: number;
  operandMax: number;
  showVisuals: boolean;
  includeMissingAddend: boolean;
} {
  const configs: Record<number, Record<number, { maxSum: number; operandMax: number; showVisuals: boolean; includeMissingAddend: boolean }>> = {
    3: {
      1: { maxSum: 3, operandMax: 2, showVisuals: true, includeMissingAddend: false },
      2: { maxSum: 4, operandMax: 2, showVisuals: true, includeMissingAddend: false },
      3: { maxSum: 5, operandMax: 3, showVisuals: true, includeMissingAddend: false },
      4: { maxSum: 5, operandMax: 3, showVisuals: true, includeMissingAddend: false },
      5: { maxSum: 6, operandMax: 4, showVisuals: true, includeMissingAddend: false },
    },
    4: {
      1: { maxSum: 5, operandMax: 3, showVisuals: true, includeMissingAddend: false },
      2: { maxSum: 6, operandMax: 4, showVisuals: true, includeMissingAddend: false },
      3: { maxSum: 7, operandMax: 4, showVisuals: true, includeMissingAddend: false },
      4: { maxSum: 8, operandMax: 5, showVisuals: true, includeMissingAddend: false },
      5: { maxSum: 10, operandMax: 5, showVisuals: true, includeMissingAddend: false },
    },
    5: {
      1: { maxSum: 6, operandMax: 4, showVisuals: true, includeMissingAddend: false },
      2: { maxSum: 8, operandMax: 5, showVisuals: true, includeMissingAddend: false },
      3: { maxSum: 10, operandMax: 6, showVisuals: true, includeMissingAddend: false },
      4: { maxSum: 10, operandMax: 6, showVisuals: false, includeMissingAddend: false },
      5: { maxSum: 12, operandMax: 7, showVisuals: false, includeMissingAddend: false },
    },
    6: {
      1: { maxSum: 10, operandMax: 6, showVisuals: true, includeMissingAddend: false },
      2: { maxSum: 12, operandMax: 7, showVisuals: false, includeMissingAddend: false },
      3: { maxSum: 15, operandMax: 8, showVisuals: false, includeMissingAddend: false },
      4: { maxSum: 18, operandMax: 10, showVisuals: false, includeMissingAddend: true },
      5: { maxSum: 20, operandMax: 10, showVisuals: false, includeMissingAddend: true },
    },
    7: {
      1: { maxSum: 15, operandMax: 8, showVisuals: false, includeMissingAddend: false },
      2: { maxSum: 18, operandMax: 10, showVisuals: false, includeMissingAddend: false },
      3: { maxSum: 20, operandMax: 12, showVisuals: false, includeMissingAddend: true },
      4: { maxSum: 25, operandMax: 15, showVisuals: false, includeMissingAddend: true },
      5: { maxSum: 30, operandMax: 15, showVisuals: false, includeMissingAddend: true },
    },
    8: {
      1: { maxSum: 20, operandMax: 12, showVisuals: false, includeMissingAddend: false },
      2: { maxSum: 25, operandMax: 15, showVisuals: false, includeMissingAddend: true },
      3: { maxSum: 30, operandMax: 18, showVisuals: false, includeMissingAddend: true },
      4: { maxSum: 40, operandMax: 20, showVisuals: false, includeMissingAddend: true },
      5: { maxSum: 50, operandMax: 25, showVisuals: false, includeMissingAddend: true },
    },
  };

  const clampedAge = Math.min(Math.max(age, 3), 8);
  const ageConfig = configs[clampedAge];
  
  // Interpolate for levels beyond 5
  if (level <= 5) {
    return ageConfig[level] || ageConfig[1];
  }
  
  // For levels 6-20, scale up from level 5
  const base = ageConfig[5];
  const levelMultiplier = 1 + ((level - 5) * 0.15); // 15% increase per level beyond 5
  
  return {
    maxSum: Math.round(base.maxSum * levelMultiplier),
    operandMax: Math.round(base.operandMax * levelMultiplier),
    showVisuals: false,
    includeMissingAddend: level > 8 || clampedAge >= 6,
  };
}

/**
 * Get specific difficulty parameters for Subtraction mode
 */
export function getSubtractionConfig(age: number, level: number): {
  maxMinuend: number;
  showVisuals: boolean;
  allowBorrowing: boolean;
} {
  const clampedAge = Math.min(Math.max(age, 3), 8);
  
  const baseMax: Record<number, number> = { 3: 5, 4: 8, 5: 10, 6: 15, 7: 20, 8: 30 };
  const visualsUntil: Record<number, number> = { 3: 15, 4: 12, 5: 8, 6: 5, 7: 3, 8: 2 };
  const borrowingFrom: Record<number, number> = { 3: 20, 4: 18, 5: 15, 6: 10, 7: 8, 8: 5 };
  
  const levelMultiplier = 1 + ((level - 1) * 0.12);
  
  return {
    maxMinuend: Math.round(baseMax[clampedAge] * levelMultiplier),
    showVisuals: level <= visualsUntil[clampedAge],
    allowBorrowing: level >= borrowingFrom[clampedAge],
  };
}

/**
 * Get specific difficulty parameters for Multiplication mode
 */
export function getMultiplicationConfig(age: number, level: number): {
  availableTables: number[];
  maxMultiplicand: number;
  showVisuals: boolean;
  useArrayVisualization: boolean;
} {
  const clampedAge = Math.min(Math.max(age, 5), 8); // Multiplication starts at age 5
  
  // Tables introduced progressively
  const tablesByAgeLevel: Record<number, Record<number, number[]>> = {
    5: {
      1: [2], 2: [2], 3: [2, 5], 4: [2, 5], 5: [2, 5, 10],
    },
    6: {
      1: [2, 5], 2: [2, 5, 10], 3: [2, 3, 5], 4: [2, 3, 4, 5], 5: [2, 3, 4, 5, 10],
    },
    7: {
      1: [2, 3, 5], 2: [2, 3, 4, 5], 3: [2, 3, 4, 5, 6], 4: [2, 3, 4, 5, 6, 7], 5: [2, 3, 4, 5, 6, 7, 8],
    },
    8: {
      1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6, 7], 3: [2, 3, 4, 5, 6, 7, 8], 4: [2, 3, 4, 5, 6, 7, 8, 9], 5: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
  };
  
  const effectiveLevel = Math.min(level, 5);
  const tables = tablesByAgeLevel[clampedAge]?.[effectiveLevel] || [2, 5];
  
  // Add more tables for higher levels
  if (level > 5) {
    const extraTables = [3, 4, 6, 7, 8, 9, 11, 12].filter(t => !tables.includes(t));
    const tablesToAdd = Math.min(level - 5, extraTables.length);
    tables.push(...extraTables.slice(0, tablesToAdd));
  }
  
  return {
    availableTables: tables,
    maxMultiplicand: Math.min(5 + Math.floor(level / 3), 12),
    showVisuals: level <= (clampedAge <= 6 ? 8 : 4),
    useArrayVisualization: level <= 5,
  };
}

/**
 * Get specific difficulty parameters for Division mode
 */
export function getDivisionConfig(age: number, level: number): {
  maxDividend: number;
  divisors: number[];
  showVisuals: boolean;
  allowRemainders: boolean;
} {
  const clampedAge = Math.min(Math.max(age, 6), 8); // Division starts at age 6
  
  const baseMax: Record<number, number> = { 6: 20, 7: 50, 8: 100 };
  const visualsUntil: Record<number, number> = { 6: 10, 7: 6, 8: 4 };
  const remaindersFrom: Record<number, number> = { 6: 15, 7: 12, 8: 8 };
  
  const levelMultiplier = 1 + ((level - 1) * 0.1);
  
  // Divisors based on age and level
  const baseDivisors: Record<number, number[]> = { 6: [2], 7: [2, 5], 8: [2, 3, 4, 5] };
  const allDivisors = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  const divisors = [...baseDivisors[clampedAge]];
  if (level > 3) {
    const extra = allDivisors.filter(d => !divisors.includes(d));
    divisors.push(...extra.slice(0, Math.floor((level - 3) / 2)));
  }
  
  return {
    maxDividend: Math.round(baseMax[clampedAge] * levelMultiplier),
    divisors,
    showVisuals: level <= visualsUntil[clampedAge],
    allowRemainders: level >= remaindersFrom[clampedAge],
  };
}

/**
 * Get skip counting configuration
 */
export function getSkipCountingConfig(age: number, level: number): {
  skipBy: number[];
  maxNumber: number;
  showVisuals: boolean;
} {
  const clampedAge = Math.min(Math.max(age, 3), 8);
  
  const skipPatterns: Record<number, Record<number, number[]>> = {
    3: { 1: [2], 2: [2], 3: [2, 5], 4: [2, 5], 5: [2, 5, 10] },
    4: { 1: [2], 2: [2, 5], 3: [2, 5, 10], 4: [2, 5, 10], 5: [2, 3, 5, 10] },
    5: { 1: [2, 5], 2: [2, 5, 10], 3: [2, 3, 5, 10], 4: [2, 3, 4, 5, 10], 5: [2, 3, 4, 5, 10] },
    6: { 1: [2, 3, 5], 2: [2, 3, 4, 5], 3: [2, 3, 4, 5, 6], 4: [2, 3, 4, 5, 6, 7], 5: [2, 3, 4, 5, 6, 7, 8] },
    7: { 1: [2, 3, 4, 5], 2: [2, 3, 4, 5, 6], 3: [2, 3, 4, 5, 6, 7, 8], 4: [2, 3, 4, 5, 6, 7, 8, 9], 5: [2, 3, 4, 5, 6, 7, 8, 9, 10] },
    8: { 1: [3, 4, 5, 6], 2: [3, 4, 5, 6, 7, 8], 3: [3, 4, 5, 6, 7, 8, 9], 4: [4, 6, 7, 8, 9, 11], 5: [6, 7, 8, 9, 11, 12] },
  };
  
  const effectiveLevel = Math.min(level, 5);
  const skipBy = skipPatterns[clampedAge]?.[effectiveLevel] || [2, 5];
  
  const baseMax: Record<number, number> = { 3: 20, 4: 30, 5: 50, 6: 100, 7: 100, 8: 150 };
  
  return {
    skipBy,
    maxNumber: baseMax[clampedAge] + (level * 5),
    showVisuals: level <= (9 - clampedAge), // Younger = more visuals
  };
}

/**
 * Get time-telling configuration
 */
export function getTimeConfig(age: number, level: number): {
  hourOnly: boolean;
  halfHour: boolean;
  quarterHour: boolean;
  fiveMinutes: boolean;
  anyMinutes: boolean;
} {
  const clampedAge = Math.min(Math.max(age, 4), 8);
  
  // Progressive complexity
  if (clampedAge <= 4 || level <= 2) {
    return { hourOnly: true, halfHour: false, quarterHour: false, fiveMinutes: false, anyMinutes: false };
  }
  if (clampedAge <= 5 || level <= 4) {
    return { hourOnly: false, halfHour: true, quarterHour: false, fiveMinutes: false, anyMinutes: false };
  }
  if (clampedAge <= 6 || level <= 6) {
    return { hourOnly: false, halfHour: true, quarterHour: true, fiveMinutes: false, anyMinutes: false };
  }
  if (level <= 10) {
    return { hourOnly: false, halfHour: true, quarterHour: true, fiveMinutes: true, anyMinutes: false };
  }
  
  return { hourOnly: false, halfHour: true, quarterHour: true, fiveMinutes: true, anyMinutes: true };
}

/**
 * Get money configuration
 */
export function getMoneyConfig(age: number, level: number): {
  coinTypes: string[];
  maxCents: number;
  includeBills: boolean;
  includeMakingChange: boolean;
} {
  const clampedAge = Math.min(Math.max(age, 5), 8);
  
  const coinProgress: Record<number, Record<number, string[]>> = {
    5: { 1: ['penny'], 2: ['penny', 'nickel'], 3: ['penny', 'nickel', 'dime'], 4: ['penny', 'nickel', 'dime'], 5: ['penny', 'nickel', 'dime', 'quarter'] },
    6: { 1: ['penny', 'nickel'], 2: ['penny', 'nickel', 'dime'], 3: ['penny', 'nickel', 'dime', 'quarter'], 4: ['penny', 'nickel', 'dime', 'quarter'], 5: ['penny', 'nickel', 'dime', 'quarter'] },
    7: { 1: ['nickel', 'dime'], 2: ['nickel', 'dime', 'quarter'], 3: ['penny', 'nickel', 'dime', 'quarter'], 4: ['penny', 'nickel', 'dime', 'quarter'], 5: ['penny', 'nickel', 'dime', 'quarter'] },
    8: { 1: ['dime', 'quarter'], 2: ['nickel', 'dime', 'quarter'], 3: ['penny', 'nickel', 'dime', 'quarter'], 4: ['penny', 'nickel', 'dime', 'quarter'], 5: ['penny', 'nickel', 'dime', 'quarter'] },
  };
  
  const effectiveLevel = Math.min(level, 5);
  const coins = coinProgress[clampedAge]?.[effectiveLevel] || ['penny', 'nickel', 'dime', 'quarter'];
  
  return {
    coinTypes: coins,
    maxCents: 25 + (level * 15) + ((clampedAge - 5) * 25),
    includeBills: level > 10 && clampedAge >= 7,
    includeMakingChange: level > 8 && clampedAge >= 6,
  };
}

/**
 * Get place value configuration
 */
export function getPlaceValueConfig(age: number, level: number): {
  maxDigits: number;
  includeDecimals: boolean;
  problemTypes: ('identify' | 'expand' | 'compose' | 'compare')[];
} {
  const clampedAge = Math.min(Math.max(age, 5), 8);
  
  const digitsByAge: Record<number, number> = { 5: 2, 6: 3, 7: 4, 8: 5 };
  const maxDigits = Math.min(digitsByAge[clampedAge] + Math.floor(level / 5), 6);
  
  const types: ('identify' | 'expand' | 'compose' | 'compare')[] = ['identify'];
  if (level > 3 || clampedAge >= 6) types.push('expand');
  if (level > 6 || clampedAge >= 7) types.push('compose');
  if (level > 10) types.push('compare');
  
  return {
    maxDigits,
    includeDecimals: level > 15 && clampedAge >= 8,
    problemTypes: types,
  };
}

/**
 * Get number line configuration  
 */
export function getNumberLineConfig(age: number, level: number): {
  maxNumber: number;
  showAllMarks: boolean;
  jumpSize: number;
} {
  const clampedAge = Math.min(Math.max(age, 3), 8);
  
  const baseMax: Record<number, number> = { 3: 10, 4: 20, 5: 50, 6: 100, 7: 200, 8: 500 };
  
  return {
    maxNumber: baseMax[clampedAge] + (level * 10),
    showAllMarks: level <= (8 - clampedAge),
    jumpSize: level <= 5 ? 1 : level <= 10 ? 5 : 10,
  };
}

/**
 * Get measurement configuration
 */
export function getMeasurementConfig(age: number, level: number): {
  units: string[];
  maxValue: number;
  includeConversions: boolean;
} {
  const clampedAge = Math.min(Math.max(age, 5), 8);
  
  const unitsByAge: Record<number, string[]> = {
    5: ['inches', 'feet'],
    6: ['inches', 'feet', 'centimeters'],
    7: ['inches', 'feet', 'centimeters', 'meters', 'pounds'],
    8: ['inches', 'feet', 'centimeters', 'meters', 'pounds', 'kilograms', 'ounces'],
  };
  
  return {
    units: unitsByAge[clampedAge] || ['inches', 'feet'],
    maxValue: 10 + (level * 5) + ((clampedAge - 5) * 10),
    includeConversions: level > 8 && clampedAge >= 7,
  };
}

// Helper functions

function getProblemTypesForLevel(mode: string, age: number, level: number): string[] {
  const baseTypes = ['standard'];
  
  if (level > 5) baseTypes.push('visual_comparison');
  if (level > 10 || age >= 7) baseTypes.push('missing_number');
  if (level > 15 || age >= 8) baseTypes.push('word_problem');
  
  return baseTypes;
}

function getSpeedTimeLimit(age: number, level: number): number {
  // Younger kids get more time, higher levels reduce time
  const baseTime: Record<number, number> = { 3: 30, 4: 25, 5: 20, 6: 15, 7: 12, 8: 10 };
  const reduction = Math.min(level * 0.3, 5); // Max 5 second reduction
  
  return Math.max(baseTime[age] - reduction, 5); // Minimum 5 seconds
}

/**
 * Get a display-friendly description of the current difficulty
 */
export function getDifficultyDescription(age: number, level: number): string {
  if (level <= 5) return 'Beginner';
  if (level <= 10) return 'Learning';
  if (level <= 15) return 'Practicing';
  return 'Mastering';
}
