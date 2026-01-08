/**
 * Age Variant Configuration System
 * 
 * Defines age-specific metadata for ALL modes:
 * - 3 Counting modes (order, challenge, free)
 * - 1 Puzzle mode
 * - 16 Math modes
 * 
 * Each mode shows to ALL ages but with appropriate difficulty and descriptions.
 */

export interface AgeVariantConfig {
  displayName: string;
  description: string;
  learningOutcome: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  questionPreview: string;
  conceptFocus: string;
  isConceptual: boolean;
  visualAidLevel: 'always' | 'optional' | 'minimal' | 'none';
}

export interface CountingAgeConfig {
  maxNumber: number;
  description: string;
  autoVoice: boolean;
  speedGoal?: boolean;
  choices?: number;
  exploration?: boolean;
}

export interface PuzzleAgeConfig {
  maxLevel: number;
  numbersToArrange: number;
  description: string;
  visualHints: boolean;
}

// ============================================
// COUNTING MODE AGE VARIANTS
// ============================================

export const COUNTING_AGE_VARIANTS: Record<string, Record<number, CountingAgeConfig>> = {
  'counting-order': {
    3: { maxNumber: 20, description: 'Count to 20 with voice guidance', autoVoice: true },
    4: { maxNumber: 30, description: 'Count to 30 with help', autoVoice: true },
    5: { maxNumber: 50, description: 'Count to 50 independently', autoVoice: false },
    6: { maxNumber: 70, description: 'Count to 70 fluently', autoVoice: false },
    7: { maxNumber: 100, description: 'Count to 100', autoVoice: false },
    8: { maxNumber: 100, description: 'Count to 100 perfectly', autoVoice: false, speedGoal: true }
  },
  'counting-challenge': {
    3: { maxNumber: 10, description: 'Find numbers up to 10', autoVoice: true, choices: 3 },
    4: { maxNumber: 20, description: 'Find numbers up to 20', autoVoice: true, choices: 4 },
    5: { maxNumber: 30, description: 'Find numbers up to 30', autoVoice: false, choices: 4 },
    6: { maxNumber: 50, description: 'Find numbers up to 50', autoVoice: false, choices: 5 },
    7: { maxNumber: 70, description: 'Find numbers up to 70', autoVoice: false, choices: 6 },
    8: { maxNumber: 100, description: 'Find any number quickly', autoVoice: false, choices: 6, speedGoal: true }
  },
  'counting-free': {
    3: { maxNumber: 20, description: 'Explore numbers up to 20', autoVoice: true, exploration: true },
    4: { maxNumber: 30, description: 'Explore numbers up to 30', autoVoice: true, exploration: true },
    5: { maxNumber: 50, description: 'Explore numbers up to 50', autoVoice: false, exploration: true },
    6: { maxNumber: 70, description: 'Explore numbers up to 70', autoVoice: false, exploration: true },
    7: { maxNumber: 100, description: 'Explore all numbers', autoVoice: false, exploration: true },
    8: { maxNumber: 100, description: 'Master all numbers', autoVoice: false, exploration: true }
  }
};

// ============================================
// PUZZLE MODE AGE VARIANTS
// ============================================

export const PUZZLE_AGE_VARIANTS: Record<number, PuzzleAgeConfig> = {
  3: { maxLevel: 2, numbersToArrange: 5, description: 'Arrange 5 numbers in order', visualHints: true },
  4: { maxLevel: 4, numbersToArrange: 6, description: 'Arrange 6 numbers in order', visualHints: true },
  5: { maxLevel: 6, numbersToArrange: 7, description: 'Arrange up to 7 numbers', visualHints: true },
  6: { maxLevel: 8, numbersToArrange: 8, description: 'Arrange up to 8 numbers', visualHints: false },
  7: { maxLevel: 10, numbersToArrange: 9, description: 'Arrange up to 9 numbers', visualHints: false },
  8: { maxLevel: 10, numbersToArrange: 10, description: 'Master all puzzle levels', visualHints: false }
};

// ============================================
// MATH MODE AGE VARIANTS
// ============================================

export const MATH_AGE_VARIANTS: Record<string, Record<number, AgeVariantConfig>> = {
  // FOUNDATION MODES
  'number-sense': {
    3: {
      displayName: 'Number Friends',
      description: 'Meet numbers 1-10',
      learningOutcome: 'Recognize numbers 1-10',
      difficultyLevel: 1,
      questionPreview: 'Which is more: 2 or 3?',
      conceptFocus: 'number_recognition',
      isConceptual: false,
      visualAidLevel: 'always'
    },
    4: {
      displayName: 'Number Comparison',
      description: 'Compare numbers up to 20',
      learningOutcome: 'Compare and order numbers',
      difficultyLevel: 2,
      questionPreview: 'Put 5, 8, 3 in order',
      conceptFocus: 'comparison',
      isConceptual: false,
      visualAidLevel: 'always'
    },
    5: {
      displayName: 'Number Sense',
      description: 'Compare numbers up to 50',
      learningOutcome: 'Order numbers fluently',
      difficultyLevel: 3,
      questionPreview: 'Which comes between 23 and 25?',
      conceptFocus: 'ordering',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    6: {
      displayName: 'Number Sense',
      description: 'Work with numbers to 100',
      learningOutcome: 'Master number relationships',
      difficultyLevel: 4,
      questionPreview: '67 is closer to 60 or 70?',
      conceptFocus: 'estimation',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    7: {
      displayName: 'Number Sense Master',
      description: 'Advanced number relationships',
      learningOutcome: 'Estimate and round numbers',
      difficultyLevel: 4,
      questionPreview: 'Round 47 to nearest 10',
      conceptFocus: 'rounding',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    8: {
      displayName: 'Number Sense Expert',
      description: 'Numbers to 1000 and beyond',
      learningOutcome: 'Master large number comparison',
      difficultyLevel: 5,
      questionPreview: 'Order: 456, 465, 546',
      conceptFocus: 'large_numbers',
      isConceptual: false,
      visualAidLevel: 'none'
    }
  },

  'shapes': {
    3: {
      displayName: 'Shape Friends',
      description: 'Meet circles, squares, and triangles',
      learningOutcome: 'Identify basic shapes',
      difficultyLevel: 1,
      questionPreview: 'Find the circle!',
      conceptFocus: 'basic_shapes',
      isConceptual: false,
      visualAidLevel: 'always'
    },
    4: {
      displayName: 'Shape Explorer',
      description: 'Learn more shapes and colors',
      learningOutcome: 'Identify 6 shapes',
      difficultyLevel: 2,
      questionPreview: 'What shape has 4 equal sides?',
      conceptFocus: 'shape_properties',
      isConceptual: false,
      visualAidLevel: 'always'
    },
    5: {
      displayName: 'Shapes & Patterns',
      description: 'Find patterns in shapes',
      learningOutcome: 'Complete shape patterns',
      difficultyLevel: 3,
      questionPreview: '🔵🔴🔵🔴 What comes next?',
      conceptFocus: 'patterns',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    6: {
      displayName: 'Shapes & Patterns',
      description: 'Complex patterns and symmetry',
      learningOutcome: 'Identify symmetry',
      difficultyLevel: 4,
      questionPreview: 'Draw the line of symmetry',
      conceptFocus: 'symmetry',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    7: {
      displayName: 'Geometry Basics',
      description: '3D shapes and angles',
      learningOutcome: 'Identify 3D shapes',
      difficultyLevel: 4,
      questionPreview: 'How many faces does a cube have?',
      conceptFocus: '3d_shapes',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    8: {
      displayName: 'Geometry',
      description: 'Angles, perimeter, area concepts',
      learningOutcome: 'Understand geometric properties',
      difficultyLevel: 5,
      questionPreview: 'Is this angle acute or obtuse?',
      conceptFocus: 'geometry',
      isConceptual: false,
      visualAidLevel: 'minimal'
    }
  },

  'skip-counting': {
    3: {
      displayName: 'Counting by 2s',
      description: 'Count pairs of things',
      learningOutcome: 'Count by 2s to 10',
      difficultyLevel: 1,
      questionPreview: '2 shoes, 4 shoes, 6 shoes...',
      conceptFocus: 'counting_pairs',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    4: {
      displayName: 'Skip Counting Fun',
      description: 'Count by 2s and 5s',
      learningOutcome: 'Skip count to 20',
      difficultyLevel: 2,
      questionPreview: '5, 10, 15, __?',
      conceptFocus: 'skip_2s_5s',
      isConceptual: false,
      visualAidLevel: 'always'
    },
    5: {
      displayName: 'Skip Counting',
      description: 'Count by 2s, 5s, and 10s',
      learningOutcome: 'Skip count to 50',
      difficultyLevel: 3,
      questionPreview: '10, 20, 30, __?',
      conceptFocus: 'skip_patterns',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    6: {
      displayName: 'Skip Counting',
      description: 'Count by 2s, 5s, 10s to 100',
      learningOutcome: 'Master skip counting patterns',
      difficultyLevel: 3,
      questionPreview: 'Count by 5s from 35 to 60',
      conceptFocus: 'extended_patterns',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    7: {
      displayName: 'Pattern Counting',
      description: 'Count by 3s, 4s, and more',
      learningOutcome: 'Count by any number',
      difficultyLevel: 4,
      questionPreview: '3, 6, 9, 12, __?',
      conceptFocus: 'multiplication_readiness',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    8: {
      displayName: 'Advanced Patterns',
      description: 'Complex counting patterns',
      learningOutcome: 'Master multiplication patterns',
      difficultyLevel: 5,
      questionPreview: 'What pattern: 7, 14, 21, 28?',
      conceptFocus: 'pattern_analysis',
      isConceptual: false,
      visualAidLevel: 'none'
    }
  },

  'number-line': {
    3: {
      displayName: 'Number Path',
      description: 'Walk along numbers 1-10',
      learningOutcome: 'Use a simple number path',
      difficultyLevel: 1,
      questionPreview: 'Hop to number 5!',
      conceptFocus: 'number_path',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    4: {
      displayName: 'Number Line Explorer',
      description: 'Jump on the number line',
      learningOutcome: 'Navigate number line to 20',
      difficultyLevel: 2,
      questionPreview: 'Start at 3, jump 2. Where are you?',
      conceptFocus: 'jumping',
      isConceptual: false,
      visualAidLevel: 'always'
    },
    5: {
      displayName: 'Number Line',
      description: 'Use number lines for math',
      learningOutcome: 'Add and subtract on number line',
      difficultyLevel: 3,
      questionPreview: '8 + 5 on the number line',
      conceptFocus: 'operations',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    6: {
      displayName: 'Number Line',
      description: 'Number lines to 100',
      learningOutcome: 'Estimate positions',
      difficultyLevel: 3,
      questionPreview: 'Where does 67 go?',
      conceptFocus: 'estimation',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    7: {
      displayName: 'Number Line Mastery',
      description: 'Multi-step operations',
      learningOutcome: 'Complex number line problems',
      difficultyLevel: 4,
      questionPreview: 'Start at 25, add 18, subtract 7',
      conceptFocus: 'multi_step',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    8: {
      displayName: 'Number Line Expert',
      description: 'Fractions and decimals',
      learningOutcome: 'Place fractions on number lines',
      difficultyLevel: 5,
      questionPreview: 'Where does 1/2 go between 0 and 1?',
      conceptFocus: 'fractions',
      isConceptual: false,
      visualAidLevel: 'minimal'
    }
  },

  'place-value': {
    3: {
      displayName: 'Counting Groups',
      description: 'Group objects together',
      learningOutcome: 'Understand grouping',
      difficultyLevel: 1,
      questionPreview: 'How many groups of 2?',
      conceptFocus: 'grouping_intro',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    4: {
      displayName: 'Tens and Ones',
      description: 'Introduction to tens',
      learningOutcome: 'Count by tens',
      difficultyLevel: 2,
      questionPreview: '10 + 10 = ?',
      conceptFocus: 'tens_intro',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    5: {
      displayName: 'Place Value',
      description: 'Tens and ones to 99',
      learningOutcome: 'Identify tens and ones',
      difficultyLevel: 3,
      questionPreview: '34 = __ tens and __ ones',
      conceptFocus: 'tens_ones',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    6: {
      displayName: 'Place Value',
      description: 'Hundreds, tens, ones',
      learningOutcome: 'Work with 3-digit numbers',
      difficultyLevel: 4,
      questionPreview: '245 = 2 hundreds, __ tens, 5 ones',
      conceptFocus: 'hundreds',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    7: {
      displayName: 'Place Value Master',
      description: 'Thousands and beyond',
      learningOutcome: 'Understand large numbers',
      difficultyLevel: 4,
      questionPreview: 'What is the value of 7 in 3,754?',
      conceptFocus: 'thousands',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    8: {
      displayName: 'Place Value Expert',
      description: 'Decimals and place value',
      learningOutcome: 'Master decimal place value',
      difficultyLevel: 5,
      questionPreview: 'What is 0.7 + 0.25?',
      conceptFocus: 'decimals',
      isConceptual: false,
      visualAidLevel: 'minimal'
    }
  },

  // OPERATIONS MODES
  'addition-basic': {
    3: {
      displayName: 'Adding Together',
      description: 'Put groups together',
      learningOutcome: 'Add within 5',
      difficultyLevel: 1,
      questionPreview: '2 + 1 = ?',
      conceptFocus: 'combining',
      isConceptual: false,
      visualAidLevel: 'always'
    },
    4: {
      displayName: 'Addition Practice',
      description: 'Add numbers up to 10',
      learningOutcome: 'Add within 10',
      difficultyLevel: 2,
      questionPreview: '3 + 4 = ?',
      conceptFocus: 'sums_to_10',
      isConceptual: false,
      visualAidLevel: 'always'
    },
    5: {
      displayName: 'Addition',
      description: 'Add numbers up to 20',
      learningOutcome: 'Add within 20',
      difficultyLevel: 3,
      questionPreview: '8 + 7 = ?',
      conceptFocus: 'sums_to_20',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    6: {
      displayName: 'Addition',
      description: 'Mental math to 50',
      learningOutcome: 'Fast addition to 50',
      difficultyLevel: 3,
      questionPreview: '23 + 14 = ?',
      conceptFocus: 'mental_math',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    7: {
      displayName: 'Addition Fluency',
      description: 'Add quickly and accurately',
      learningOutcome: 'Fluent addition to 100',
      difficultyLevel: 4,
      questionPreview: '47 + 28 = ?',
      conceptFocus: 'fluency',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    8: {
      displayName: 'Advanced Addition',
      description: 'Mental math to 100+',
      learningOutcome: 'Master mental addition',
      difficultyLevel: 5,
      questionPreview: '67 + 45 = ?',
      conceptFocus: 'automaticity',
      isConceptual: false,
      visualAidLevel: 'none'
    }
  },

  'subtraction-basic': {
    3: {
      displayName: 'Taking Away',
      description: 'Take things away',
      learningOutcome: 'Subtract within 5',
      difficultyLevel: 1,
      questionPreview: '3 take away 1 = ?',
      conceptFocus: 'taking_away',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    4: {
      displayName: 'Subtraction Practice',
      description: 'Subtract within 10',
      learningOutcome: 'Subtract within 10',
      difficultyLevel: 2,
      questionPreview: '7 - 3 = ?',
      conceptFocus: 'subtraction_to_10',
      isConceptual: false,
      visualAidLevel: 'always'
    },
    5: {
      displayName: 'Subtraction',
      description: 'Subtract within 20',
      learningOutcome: 'Subtract within 20',
      difficultyLevel: 3,
      questionPreview: '15 - 7 = ?',
      conceptFocus: 'subtraction_to_20',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    6: {
      displayName: 'Subtraction',
      description: 'Mental subtraction to 50',
      learningOutcome: 'Fast subtraction to 50',
      difficultyLevel: 3,
      questionPreview: '34 - 17 = ?',
      conceptFocus: 'mental_subtraction',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    7: {
      displayName: 'Subtraction Fluency',
      description: 'Subtract quickly to 100',
      learningOutcome: 'Fluent subtraction to 100',
      difficultyLevel: 4,
      questionPreview: '72 - 35 = ?',
      conceptFocus: 'fluency',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    8: {
      displayName: 'Advanced Subtraction',
      description: 'Master mental subtraction',
      learningOutcome: 'Master subtraction strategies',
      difficultyLevel: 5,
      questionPreview: '143 - 67 = ?',
      conceptFocus: 'strategies',
      isConceptual: false,
      visualAidLevel: 'none'
    }
  },

  'addition-advanced': {
    3: {
      displayName: 'Big Adding',
      description: 'Add bigger groups',
      learningOutcome: 'Explore larger addition',
      difficultyLevel: 1,
      questionPreview: '5 + 5 = ?',
      conceptFocus: 'bigger_sums',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    4: {
      displayName: 'Adding Tens',
      description: 'Add with tens',
      learningOutcome: 'Add multiples of 10',
      difficultyLevel: 2,
      questionPreview: '10 + 10 = ?',
      conceptFocus: 'tens_addition',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    5: {
      displayName: 'Big Addition',
      description: 'Add two-digit numbers',
      learningOutcome: 'Add without regrouping',
      difficultyLevel: 3,
      questionPreview: '23 + 14 = ?',
      conceptFocus: 'two_digit',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    6: {
      displayName: 'Big Addition',
      description: 'Add with carrying',
      learningOutcome: 'Add with regrouping',
      difficultyLevel: 4,
      questionPreview: '47 + 38 = ?',
      conceptFocus: 'regrouping',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    7: {
      displayName: 'Big Addition',
      description: 'Add 3-digit numbers',
      learningOutcome: 'Add hundreds',
      difficultyLevel: 4,
      questionPreview: '234 + 178 = ?',
      conceptFocus: 'hundreds',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    8: {
      displayName: 'Big Addition Master',
      description: 'Multi-digit addition',
      learningOutcome: 'Master complex addition',
      difficultyLevel: 5,
      questionPreview: '1,456 + 2,789 = ?',
      conceptFocus: 'mastery',
      isConceptual: false,
      visualAidLevel: 'none'
    }
  },

  'subtraction-advanced': {
    3: {
      displayName: 'Big Taking Away',
      description: 'Take away from bigger groups',
      learningOutcome: 'Explore larger subtraction',
      difficultyLevel: 1,
      questionPreview: '10 - 5 = ?',
      conceptFocus: 'bigger_differences',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    4: {
      displayName: 'Subtracting Tens',
      description: 'Subtract with tens',
      learningOutcome: 'Subtract multiples of 10',
      difficultyLevel: 2,
      questionPreview: '20 - 10 = ?',
      conceptFocus: 'tens_subtraction',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    5: {
      displayName: 'Big Subtraction',
      description: 'Subtract two-digit numbers',
      learningOutcome: 'Subtract without borrowing',
      difficultyLevel: 3,
      questionPreview: '45 - 23 = ?',
      conceptFocus: 'two_digit',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    6: {
      displayName: 'Big Subtraction',
      description: 'Subtract with borrowing',
      learningOutcome: 'Subtract with regrouping',
      difficultyLevel: 4,
      questionPreview: '52 - 28 = ?',
      conceptFocus: 'regrouping',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    7: {
      displayName: 'Big Subtraction',
      description: 'Subtract 3-digit numbers',
      learningOutcome: 'Subtract hundreds',
      difficultyLevel: 4,
      questionPreview: '432 - 178 = ?',
      conceptFocus: 'hundreds',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    8: {
      displayName: 'Big Subtraction Master',
      description: 'Multi-digit subtraction',
      learningOutcome: 'Master complex subtraction',
      difficultyLevel: 5,
      questionPreview: '5,002 - 1,789 = ?',
      conceptFocus: 'mastery',
      isConceptual: false,
      visualAidLevel: 'none'
    }
  },

  // APPLICATIONS MODES
  'time': {
    3: {
      displayName: 'Clock Friends',
      description: 'Learn about clocks',
      learningOutcome: 'Identify clock parts',
      difficultyLevel: 1,
      questionPreview: 'Find the hour hand!',
      conceptFocus: 'clock_intro',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    4: {
      displayName: 'Time Explorer',
      description: 'Tell time to the hour',
      learningOutcome: 'Read hour times',
      difficultyLevel: 2,
      questionPreview: 'What time is it? (3:00)',
      conceptFocus: 'hours',
      isConceptual: false,
      visualAidLevel: 'always'
    },
    5: {
      displayName: 'Time Basics',
      description: 'Tell time to half hour',
      learningOutcome: 'Read half hour times',
      difficultyLevel: 3,
      questionPreview: 'Show 2:30 on the clock',
      conceptFocus: 'half_hours',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    6: {
      displayName: 'Time Basics',
      description: 'Tell time to 5 minutes',
      learningOutcome: 'Read 5-minute intervals',
      difficultyLevel: 3,
      questionPreview: 'What time is 4:25?',
      conceptFocus: 'five_minutes',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    7: {
      displayName: 'Time Mastery',
      description: 'Tell time to the minute',
      learningOutcome: 'Read any time',
      difficultyLevel: 4,
      questionPreview: 'What time is 7:47?',
      conceptFocus: 'any_minute',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    8: {
      displayName: 'Time Expert',
      description: 'Time problems and elapsed time',
      learningOutcome: 'Calculate elapsed time',
      difficultyLevel: 5,
      questionPreview: 'From 2:15 to 4:30 is how long?',
      conceptFocus: 'elapsed_time',
      isConceptual: false,
      visualAidLevel: 'minimal'
    }
  },

  'money': {
    3: {
      displayName: 'Coin Friends',
      description: 'Meet the coins',
      learningOutcome: 'Identify coins',
      difficultyLevel: 1,
      questionPreview: 'Find the penny!',
      conceptFocus: 'coin_recognition',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    4: {
      displayName: 'Coin Values',
      description: 'Learn coin values',
      learningOutcome: 'Know penny, nickel, dime',
      difficultyLevel: 2,
      questionPreview: 'A nickel is worth how many cents?',
      conceptFocus: 'coin_values',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    5: {
      displayName: 'Money & Value',
      description: 'Count coins',
      learningOutcome: 'Count mixed coins',
      difficultyLevel: 3,
      questionPreview: '2 dimes + 1 nickel = ?',
      conceptFocus: 'counting_coins',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    6: {
      displayName: 'Money & Value',
      description: 'Make amounts with coins',
      learningOutcome: 'Make change',
      difficultyLevel: 4,
      questionPreview: 'Make 47 cents',
      conceptFocus: 'making_amounts',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    7: {
      displayName: 'Money Master',
      description: 'Bills and coins together',
      learningOutcome: 'Work with bills',
      difficultyLevel: 4,
      questionPreview: '$5.00 - $3.47 = ?',
      conceptFocus: 'bills_coins',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    8: {
      displayName: 'Money Expert',
      description: 'Real-world money problems',
      learningOutcome: 'Solve purchase problems',
      difficultyLevel: 5,
      questionPreview: 'Buy $7.89 item with $10',
      conceptFocus: 'real_world',
      isConceptual: false,
      visualAidLevel: 'minimal'
    }
  },

  'measurement': {
    3: {
      displayName: 'Big and Small',
      description: 'Compare sizes',
      learningOutcome: 'Compare by size',
      difficultyLevel: 1,
      questionPreview: 'Which is bigger?',
      conceptFocus: 'size_comparison',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    4: {
      displayName: 'Measuring Fun',
      description: 'Use objects to measure',
      learningOutcome: 'Measure with objects',
      difficultyLevel: 2,
      questionPreview: 'How many cubes long?',
      conceptFocus: 'non_standard',
      isConceptual: false,
      visualAidLevel: 'always'
    },
    5: {
      displayName: 'Measurement',
      description: 'Use rulers and inches',
      learningOutcome: 'Measure in inches',
      difficultyLevel: 3,
      questionPreview: 'How many inches long?',
      conceptFocus: 'inches',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    6: {
      displayName: 'Measurement',
      description: 'Inches, feet, centimeters',
      learningOutcome: 'Use different units',
      difficultyLevel: 3,
      questionPreview: 'How many feet in 24 inches?',
      conceptFocus: 'conversions',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    7: {
      displayName: 'Measurement Master',
      description: 'Weight, capacity, length',
      learningOutcome: 'Measure various attributes',
      difficultyLevel: 4,
      questionPreview: 'How many cups in a quart?',
      conceptFocus: 'multiple_units',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    8: {
      displayName: 'Measurement Expert',
      description: 'Complex measurement problems',
      learningOutcome: 'Solve measurement problems',
      difficultyLevel: 5,
      questionPreview: 'Convert 3.5 meters to cm',
      conceptFocus: 'problem_solving',
      isConceptual: false,
      visualAidLevel: 'minimal'
    }
  },

  'word-problems': {
    3: {
      displayName: 'Story Time',
      description: 'Math in simple stories',
      learningOutcome: 'Understand story problems',
      difficultyLevel: 1,
      questionPreview: 'You have 2 apples. Get 1 more!',
      conceptFocus: 'story_intro',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    4: {
      displayName: 'Story Math',
      description: 'Solve picture stories',
      learningOutcome: 'Solve simple stories',
      difficultyLevel: 2,
      questionPreview: '3 birds flew away. 2 left. How many started?',
      conceptFocus: 'picture_stories',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    5: {
      displayName: 'Word Problems',
      description: 'Addition and subtraction stories',
      learningOutcome: 'Solve add/subtract stories',
      difficultyLevel: 3,
      questionPreview: 'Tom has 8 toys. Gets 5 more. Total?',
      conceptFocus: 'add_subtract',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    6: {
      displayName: 'Word Problems',
      description: 'Multi-step word problems',
      learningOutcome: 'Solve two-step problems',
      difficultyLevel: 4,
      questionPreview: 'Had 15, gave away 7, got 3 back...',
      conceptFocus: 'multi_step',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    7: {
      displayName: 'Word Problems Master',
      description: 'All operations in stories',
      learningOutcome: 'Choose correct operations',
      difficultyLevel: 4,
      questionPreview: '24 cookies shared by 4 friends...',
      conceptFocus: 'operation_choice',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    8: {
      displayName: 'Word Problems Expert',
      description: 'Complex real-world problems',
      learningOutcome: 'Master word problems',
      difficultyLevel: 5,
      questionPreview: 'Multi-step shopping problem',
      conceptFocus: 'complex_real_world',
      isConceptual: false,
      visualAidLevel: 'minimal'
    }
  },

  // ADVANCED MODES
  'multiplication-basic': {
    3: {
      displayName: 'Groups of Things',
      description: 'Learn about equal groups',
      learningOutcome: 'Understand grouping',
      difficultyLevel: 1,
      questionPreview: 'How many groups of 2?',
      conceptFocus: 'grouping',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    4: {
      displayName: 'Equal Groups',
      description: 'Count equal groups',
      learningOutcome: 'Count groups of 2 and 5',
      difficultyLevel: 2,
      questionPreview: '3 groups of 2 = ?',
      conceptFocus: 'repeated_addition',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    5: {
      displayName: 'Multiplication Intro',
      description: 'Learn the × symbol',
      learningOutcome: 'Understand multiplication',
      difficultyLevel: 3,
      questionPreview: '2 × 3 = ?',
      conceptFocus: 'multiplication_symbol',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    6: {
      displayName: 'Multiplication',
      description: 'Learn 2s, 5s, 10s tables',
      learningOutcome: 'Master easy tables',
      difficultyLevel: 4,
      questionPreview: '5 × 4 = ?',
      conceptFocus: 'easy_tables',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    7: {
      displayName: 'Multiplication',
      description: 'All tables to 10',
      learningOutcome: 'Know times tables',
      difficultyLevel: 4,
      questionPreview: '7 × 8 = ?',
      conceptFocus: 'all_tables',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    8: {
      displayName: 'Multiplication Master',
      description: 'Tables to 12, patterns',
      learningOutcome: 'Master multiplication',
      difficultyLevel: 5,
      questionPreview: '12 × 11 = ?',
      conceptFocus: 'mastery',
      isConceptual: false,
      visualAidLevel: 'none'
    }
  },

  'division-basic': {
    3: {
      displayName: 'Sharing Fairly',
      description: 'Share things equally',
      learningOutcome: 'Share between 2',
      difficultyLevel: 1,
      questionPreview: 'Share 4 cookies with 2 friends',
      conceptFocus: 'fair_sharing',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    4: {
      displayName: 'Sharing Practice',
      description: 'Share with more friends',
      learningOutcome: 'Share between 2-4',
      difficultyLevel: 2,
      questionPreview: '6 toys shared by 3 = ?',
      conceptFocus: 'equal_sharing',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    5: {
      displayName: 'Division Intro',
      description: 'Learn the ÷ symbol',
      learningOutcome: 'Understand division',
      difficultyLevel: 3,
      questionPreview: '8 ÷ 2 = ?',
      conceptFocus: 'division_symbol',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    6: {
      displayName: 'Division',
      description: 'Divide by 2, 5, 10',
      learningOutcome: 'Master easy division',
      difficultyLevel: 4,
      questionPreview: '20 ÷ 5 = ?',
      conceptFocus: 'easy_division',
      isConceptual: false,
      visualAidLevel: 'optional'
    },
    7: {
      displayName: 'Division',
      description: 'Division facts to 100',
      learningOutcome: 'Know division facts',
      difficultyLevel: 4,
      questionPreview: '56 ÷ 7 = ?',
      conceptFocus: 'division_facts',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    8: {
      displayName: 'Division Master',
      description: 'Division with remainders',
      learningOutcome: 'Handle remainders',
      difficultyLevel: 5,
      questionPreview: '25 ÷ 4 = ? R ?',
      conceptFocus: 'remainders',
      isConceptual: false,
      visualAidLevel: 'minimal'
    }
  },

  'speed-math': {
    3: {
      displayName: 'Quick Counting',
      description: 'Count objects quickly',
      learningOutcome: 'Quick recognition',
      difficultyLevel: 1,
      questionPreview: 'How many dots? (1-5)',
      conceptFocus: 'subitizing',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    4: {
      displayName: 'Fast Friends',
      description: 'Quick number recognition',
      learningOutcome: 'Fast counting to 10',
      difficultyLevel: 2,
      questionPreview: 'Quick! 3 + 2 = ?',
      conceptFocus: 'quick_facts',
      isConceptual: true,
      visualAidLevel: 'always'
    },
    5: {
      displayName: 'Speed Math',
      description: 'Practice math facts',
      learningOutcome: 'Fast addition to 10',
      difficultyLevel: 3,
      questionPreview: 'Beat the timer: 5 + 4 = ?',
      conceptFocus: 'timed_practice',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    6: {
      displayName: 'Speed Challenge',
      description: 'Timed math practice',
      learningOutcome: 'Fast facts to 20',
      difficultyLevel: 4,
      questionPreview: '30 seconds: How many can you solve?',
      conceptFocus: 'speed_drill',
      isConceptual: false,
      visualAidLevel: 'minimal'
    },
    7: {
      displayName: 'Speed Challenge',
      description: 'All operations timed',
      learningOutcome: 'Fast all operations',
      difficultyLevel: 4,
      questionPreview: 'Mixed operations speed test',
      conceptFocus: 'mixed_speed',
      isConceptual: false,
      visualAidLevel: 'none'
    },
    8: {
      displayName: 'Speed Champion',
      description: 'Ultimate speed challenge',
      learningOutcome: 'Math automaticity',
      difficultyLevel: 5,
      questionPreview: 'Championship speed round!',
      conceptFocus: 'automaticity',
      isConceptual: false,
      visualAidLevel: 'none'
    }
  }
};

// ============================================
// CONCEPTUAL CONTENT FOR YOUNG CHILDREN
// ============================================

export interface ConceptualActivity {
  type: 'visual' | 'interactive' | 'counting' | 'grouping' | 'story';
  prompt: string;
  hasAssessment: boolean;
  acceptRange?: boolean;
}

export interface ConceptualContent {
  type: 'story_based' | 'interactive_visual' | 'exploration';
  title: string;
  description: string;
  activities: ConceptualActivity[];
}

// Modes where very young children (age 3-4) get conceptual introduction only
export const CONCEPTUAL_ONLY_MODES: Record<string, number> = {
  'multiplication-basic': 5,  // Below age 5 = conceptual only
  'division-basic': 5,        // Below age 5 = conceptual only
  'word-problems': 5,         // Below age 5 = conceptual only
  'speed-math': 5,            // Below age 5 = conceptual only
  'addition-advanced': 5,     // Below age 5 = conceptual only
  'subtraction-advanced': 5,  // Below age 5 = conceptual only
  'place-value': 5,           // Below age 5 = conceptual only
  'money': 5                  // Below age 5 = conceptual only
};

export const CONCEPTUAL_CONTENT: Record<string, Record<number, ConceptualContent>> = {
  'multiplication-basic': {
    3: {
      type: 'story_based',
      title: 'Groups of Things',
      description: 'Learn about equal groups through fun pictures',
      activities: [
        { type: 'visual', prompt: 'Look at the groups of apples!', hasAssessment: false },
        { type: 'counting', prompt: 'Count how many in each group', hasAssessment: true, acceptRange: true }
      ]
    },
    4: {
      type: 'interactive_visual',
      title: 'Equal Groups',
      description: 'Make groups and count together',
      activities: [
        { type: 'grouping', prompt: 'Put 2 apples in each basket', hasAssessment: false },
        { type: 'counting', prompt: 'How many apples altogether?', hasAssessment: true }
      ]
    }
  },
  'division-basic': {
    3: {
      type: 'story_based',
      title: 'Sharing with Friends',
      description: 'Learn to share things fairly',
      activities: [
        { type: 'visual', prompt: 'Share these cookies with your friends!', hasAssessment: false },
        { type: 'interactive', prompt: 'Give each friend the same amount', hasAssessment: false }
      ]
    },
    4: {
      type: 'interactive_visual',
      title: 'Fair Sharing',
      description: 'Everyone gets the same!',
      activities: [
        { type: 'grouping', prompt: 'Share 6 toys between 2 friends', hasAssessment: false },
        { type: 'counting', prompt: 'How many does each friend get?', hasAssessment: true }
      ]
    }
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getCountingAgeConfig(age: number, mode: string): CountingAgeConfig {
  const modeKey = `counting-${mode}` as keyof typeof COUNTING_AGE_VARIANTS;
  const variants = COUNTING_AGE_VARIANTS[modeKey];
  
  if (!variants) {
    // Fallback for unknown modes
    return { maxNumber: 20, description: 'Count numbers', autoVoice: true };
  }
  
  // Clamp age to valid range
  const clampedAge = Math.max(3, Math.min(8, age));
  return variants[clampedAge] || variants[3];
}

export function getPuzzleAgeConfig(age: number): PuzzleAgeConfig {
  const clampedAge = Math.max(3, Math.min(8, age));
  return PUZZLE_AGE_VARIANTS[clampedAge] || PUZZLE_AGE_VARIANTS[3];
}

export function getMathAgeVariant(modeId: string, age: number): AgeVariantConfig | null {
  const modeVariants = MATH_AGE_VARIANTS[modeId];
  if (!modeVariants) return null;
  
  const clampedAge = Math.max(3, Math.min(8, age));
  return modeVariants[clampedAge] || modeVariants[3];
}

export function isConceptualMode(modeId: string, age: number): boolean {
  const conceptualAge = CONCEPTUAL_ONLY_MODES[modeId];
  return conceptualAge !== undefined && age < conceptualAge;
}

export function getConceptualContent(modeId: string, age: number): ConceptualContent | null {
  const modeContent = CONCEPTUAL_CONTENT[modeId];
  if (!modeContent) return null;
  
  return modeContent[age] || null;
}

export function getAgeDescription(modeId: string, age: number): string {
  const variant = getMathAgeVariant(modeId, age);
  return variant?.description || 'Learn and practice';
}

export function getAgeDifficultyLevel(modeId: string, age: number): number {
  const variant = getMathAgeVariant(modeId, age);
  return variant?.difficultyLevel || 1;
}
