import { Problem, ProblemType, Operation } from '@/types/math';
import {
  getAdditionConfig,
  getSubtractionConfig,
  getMultiplicationConfig,
  getDivisionConfig,
  getSkipCountingConfig,
  getTimeConfig,
  getMoneyConfig,
  getPlaceValueConfig,
  getNumberLineConfig,
  getMeasurementConfig,
} from './ageBasedDifficulty';

/**
 * Main problem generator function
 * Now accepts childAge parameter for age-appropriate difficulty scaling
 */
export function generateProblems(
  modeId: string,
  level: number,
  count: number = 10,
  childAge: number = 5 // Default age if not provided
): Problem[] {
  type ProblemGenerator = (level: number, count: number, age: number) => Problem[];
  
  const generators: Record<string, ProblemGenerator> = {
    'number-sense': generateNumberSenseProblems,
    'shapes': generateShapeProblems,
    'addition-basic': generateAdditionBasicProblems,
    'subtraction-basic': generateSubtractionBasicProblems,
    'skip-counting': generateSkipCountingProblems,
    'time': generateTimeProblems,
    'addition-advanced': generateAdditionAdvancedProblems,
    'subtraction-advanced': generateSubtractionAdvancedProblems,
    'money': generateMoneyProblems,
    'measurement': generateMeasurementProblems,
    'place-value': generatePlaceValueProblems,
    'multiplication-basic': generateMultiplicationProblems,
    'division-basic': generateDivisionProblems,
    'number-line': generateNumberLineProblems,
    'word-problems': generateWordProblems,
    'speed-math': generateSpeedMathProblems
  };

  const generator = generators[modeId];
  if (!generator) {
    throw new Error(`No generator found for mode: ${modeId}`);
  }

  return generator(level, count, childAge);
}

// ============= NUMBER SENSE =============
export function generateNumberSenseProblems(level: number, count: number, age: number = 5): Problem[] {
  const problems: Problem[] = [];
  
  // Age and level based scaling
  const baseMax = age <= 4 ? 5 : age <= 6 ? 10 : 20;
  const levelMultiplier = 1 + ((level - 1) * 0.15);
  const maxNumber = Math.round(Math.min(baseMax * levelMultiplier, 100));

  for (let i = 0; i < count; i++) {
    const num1 = randomInt(1, maxNumber);
    const num2 = randomInt(1, maxNumber);
    const larger = Math.max(num1, num2);

    // Younger children and lower levels: visual comparison
    if ((age <= 4 && level <= 10) || level <= 3) {
      problems.push({
        id: `ns-${level}-${i}`,
        type: 'visual',
        operation: 'comparison',
        question: 'Which has more?',
        visualAid: {
          type: 'objects',
          data: {
            groups: [
              { count: Math.min(num1, 10), object: '🍎' },
              { count: Math.min(num2, 10), object: '🍌' }
            ]
          }
        },
        answer: larger,
        choices: [num1, num2],
        hint: 'Count each group carefully',
        difficulty: 'easy',
        concept: 'comparison'
      });
    } else if (level <= 8 || (age <= 5 && level <= 12)) {
      // Same/different comparison
      const areSame = Math.random() < 0.5;
      const compareNum = areSame ? num1 : num2;

      problems.push({
        id: `ns-${level}-${i}`,
        type: 'visual',
        operation: 'comparison',
        question: 'Are these the same amount?',
        visualAid: {
          type: 'objects',
          data: {
            groups: [
              { count: Math.min(num1, 12), object: '⭐' },
              { count: Math.min(areSame ? num1 : compareNum, 12), object: '⭐' }
            ]
          }
        },
        answer: areSame ? 'yes' : 'no',
        choices: ['yes', 'no'],
        hint: 'Count both groups',
        difficulty: 'easy',
        concept: 'equivalence'
      });
    } else {
      // Number ordering (higher level)
      const numbers = [num1, num2, randomInt(1, maxNumber)].sort((a, b) => a - b);
      const missing = numbers[1];

      problems.push({
        id: `ns-${level}-${i}`,
        type: 'numeric',
        operation: 'comparison',
        question: `What number comes between ${numbers[0]} and ${numbers[2]}?`,
        visualAid: {
          type: 'number_line',
          data: {
            min: 0,
            max: maxNumber,
            markedPositions: [numbers[0], numbers[2]]
          }
        },
        answer: missing,
        choices: generateChoices(missing, 4),
        hint: 'Look at the number line',
        difficulty: 'medium',
        concept: 'ordering'
      });
    }
  }

  return problems;
}

// ============= ADDITION BASIC =============
export function generateAdditionBasicProblems(level: number, count: number, age: number = 5): Problem[] {
  const problems: Problem[] = [];
  const config = getAdditionConfig(age, level);

  for (let i = 0; i < count; i++) {
    const num1 = randomInt(0, Math.floor(config.operandMax / 2));
    const num2 = randomInt(0, Math.min(config.maxSum - num1, config.operandMax));
    const sum = num1 + num2;

    // Should we include missing addend problems?
    const doMissingAddend = config.includeMissingAddend && Math.random() < 0.3;

    if (doMissingAddend) {
      const knownAddend = randomInt(1, Math.floor(config.operandMax / 2));
      const missingAddend = randomInt(1, Math.min(config.maxSum - knownAddend, config.operandMax / 2));
      const total = knownAddend + missingAddend;

      problems.push({
        id: `add-${level}-${i}`,
        type: 'missing_number',
        operation: 'addition',
        question: `${knownAddend} + ? = ${total}`,
        answer: missingAddend,
        choices: generateChoices(missingAddend, 4),
        hint: `What number plus ${knownAddend} equals ${total}?`,
        difficulty: 'hard',
        concept: 'missing_addend'
      });
    } else {
      // Standard addition with optional visuals
      const problem: Problem = {
        id: `add-${level}-${i}`,
        type: config.showVisuals ? 'visual' : 'numeric',
        operation: 'addition',
        question: `${num1} + ${num2} = ?`,
        answer: sum,
        choices: generateChoices(sum, 4),
        hint: `Think: ${num1} and ${num2} more`,
        difficulty: level <= 5 ? 'easy' : level <= 10 ? 'medium' : 'hard',
        concept: 'addition_basic'
      };

      if (config.showVisuals && sum <= 12) {
        problem.visualAid = {
          type: 'objects',
          data: {
            groups: [
              { count: num1, object: '🔵' },
              { count: num2, object: '🔵' }
            ]
          }
        };
      }

      problems.push(problem);
    }
  }

  return problems;
}

// ============= SUBTRACTION BASIC =============
export function generateSubtractionBasicProblems(level: number, count: number, age: number = 5): Problem[] {
  const problems: Problem[] = [];
  const config = getSubtractionConfig(age, level);

  for (let i = 0; i < count; i++) {
    // Generate minuend first, then subtrahend (ensure positive result)
    const minuend = randomInt(Math.floor(config.maxMinuend / 2), config.maxMinuend);
    const subtrahend = randomInt(1, minuend - 1);
    const difference = minuend - subtrahend;

    const problem: Problem = {
      id: `sub-${level}-${i}`,
      type: config.showVisuals ? 'visual' : 'numeric',
      operation: 'subtraction',
      question: `${minuend} - ${subtrahend} = ?`,
      answer: difference,
      choices: generateChoices(difference, 4),
      hint: `Start with ${minuend} and take away ${subtrahend}`,
      difficulty: level <= 5 ? 'easy' : level <= 10 ? 'medium' : 'hard',
      concept: 'subtraction_basic'
    };

    if (config.showVisuals && minuend <= 15) {
      problem.visualAid = {
        type: 'objects',
        data: {
          groups: [
            { count: minuend, object: '🍪', label: 'Start with' },
            { count: subtrahend, object: '❌', label: 'Take away' }
          ]
        }
      };
    }

    problems.push(problem);
  }

  return problems;
}

// ============= SKIP COUNTING =============
export function generateSkipCountingProblems(level: number, count: number, age: number = 5): Problem[] {
  const problems: Problem[] = [];
  const config = getSkipCountingConfig(age, level);

  for (let i = 0; i < count; i++) {
    // Pick a skip pattern based on age/level
    const skipBy = config.skipBy[randomInt(0, config.skipBy.length - 1)];
    
    // Generate a sequence with one missing number
    const startMultiple = randomInt(1, Math.floor((config.maxNumber / skipBy) - 4));
    const sequence = [
      startMultiple * skipBy,
      (startMultiple + 1) * skipBy,
      (startMultiple + 2) * skipBy,
      (startMultiple + 3) * skipBy,
    ];
    
    // Which position is missing?
    const missingIndex = randomInt(1, 2); // Middle positions
    const answer = sequence[missingIndex];
    const displaySequence = sequence.map((n, idx) => idx === missingIndex ? '?' : n.toString());

    problems.push({
      id: `skip-${level}-${i}`,
      type: config.showVisuals ? 'visual' : 'numeric',
      operation: 'skip_counting',
      question: `Count by ${skipBy}s: ${displaySequence.join(', ')}`,
      visualAid: config.showVisuals ? {
        type: 'number_line',
        data: {
          min: sequence[0] - skipBy,
          max: sequence[3] + skipBy,
          markedPositions: sequence.filter((_, idx) => idx !== missingIndex),
          jumps: [{ from: sequence[0], to: sequence[1], label: `+${skipBy}` }]
        }
      } : undefined,
      answer: answer.toString(),
      choices: [
        (answer - skipBy).toString(),
        answer.toString(),
        (answer + skipBy).toString(),
        (answer + skipBy * 2).toString()
      ].sort(() => Math.random() - 0.5),
      hint: `Each number increases by ${skipBy}`,
      difficulty: skipBy <= 5 ? 'easy' : 'medium',
      concept: 'skip_counting'
    });
  }

  return problems;
}

// ============= TIME =============
export function generateTimeProblems(level: number, count: number, age: number = 5): Problem[] {
  const problems: Problem[] = [];
  const config = getTimeConfig(age, level);

  for (let i = 0; i < count; i++) {
    let hour = randomInt(1, 12);
    let minute = 0;

    // Determine minute based on difficulty
    if (config.anyMinutes) {
      minute = randomInt(0, 59);
    } else if (config.fiveMinutes) {
      minute = randomInt(0, 11) * 5;
    } else if (config.quarterHour) {
      minute = [0, 15, 30, 45][randomInt(0, 3)];
    } else if (config.halfHour) {
      minute = [0, 30][randomInt(0, 1)];
    }

    const timeString = `${hour}:${minute.toString().padStart(2, '0')}`;
    
    // Generate wrong choices
    const choices = [timeString];
    while (choices.length < 4) {
      const wrongHour = randomInt(1, 12);
      let wrongMinute = minute;
      if (!config.hourOnly) {
        wrongMinute = config.fiveMinutes ? randomInt(0, 11) * 5 :
                      config.quarterHour ? [0, 15, 30, 45][randomInt(0, 3)] :
                      config.halfHour ? [0, 30][randomInt(0, 1)] : 0;
      }
      const wrongTime = `${wrongHour}:${wrongMinute.toString().padStart(2, '0')}`;
      if (!choices.includes(wrongTime)) {
        choices.push(wrongTime);
      }
    }

    problems.push({
      id: `time-${level}-${i}`,
      type: 'visual',
      operation: 'comparison',
      question: 'What time is it?',
      visualAid: {
        type: 'clock',
        data: { hour, minute }
      },
      answer: timeString,
      choices: choices.sort(() => Math.random() - 0.5),
      hint: config.hourOnly ? 'Look at where the short hand points' : 'Look at both hands',
      difficulty: config.hourOnly ? 'easy' : config.anyMinutes ? 'hard' : 'medium',
      concept: 'time_telling'
    });
  }

  return problems;
}

// ============= ADDITION ADVANCED =============
export function generateAdditionAdvancedProblems(level: number, count: number, age: number = 6): Problem[] {
  const problems: Problem[] = [];
  
  // Advanced addition: larger numbers, potentially multi-digit
  const baseConfig = getAdditionConfig(Math.max(age, 6), level);
  const maxSum = Math.min(baseConfig.maxSum * 2, 100);

  for (let i = 0; i < count; i++) {
    // Two-digit + one-digit or two-digit + two-digit based on level
    let num1: number, num2: number;
    
    if (level <= 5) {
      num1 = randomInt(10, 20);
      num2 = randomInt(1, 10);
    } else if (level <= 10) {
      num1 = randomInt(10, 30);
      num2 = randomInt(5, 20);
    } else if (level <= 15) {
      num1 = randomInt(20, 50);
      num2 = randomInt(10, 30);
    } else {
      num1 = randomInt(30, 70);
      num2 = randomInt(20, Math.min(maxSum - num1, 50));
    }

    const sum = num1 + num2;

    problems.push({
      id: `add-adv-${level}-${i}`,
      type: 'numeric',
      operation: 'addition',
      question: `${num1} + ${num2} = ?`,
      answer: sum,
      choices: generateChoices(sum, 4),
      hint: 'Add the ones first, then the tens',
      difficulty: level <= 5 ? 'medium' : 'hard',
      concept: 'addition_advanced'
    });
  }

  return problems;
}

// ============= SUBTRACTION ADVANCED =============
export function generateSubtractionAdvancedProblems(level: number, count: number, age: number = 6): Problem[] {
  const problems: Problem[] = [];
  const config = getSubtractionConfig(Math.max(age, 6), level);

  for (let i = 0; i < count; i++) {
    // Larger numbers for advanced subtraction
    let minuend: number, subtrahend: number;
    
    if (level <= 5) {
      minuend = randomInt(15, 30);
      subtrahend = randomInt(5, 15);
    } else if (level <= 10) {
      minuend = randomInt(25, 50);
      subtrahend = randomInt(10, 25);
    } else if (level <= 15) {
      minuend = randomInt(40, 80);
      subtrahend = randomInt(15, 40);
    } else {
      minuend = randomInt(50, 100);
      subtrahend = randomInt(20, minuend - 10);
    }

    const difference = minuend - subtrahend;

    problems.push({
      id: `sub-adv-${level}-${i}`,
      type: 'numeric',
      operation: 'subtraction',
      question: `${minuend} - ${subtrahend} = ?`,
      answer: difference,
      choices: generateChoices(difference, 4),
      hint: config.allowBorrowing ? 'You may need to borrow from the tens' : 'Subtract carefully',
      difficulty: level <= 5 ? 'medium' : 'hard',
      concept: 'subtraction_advanced'
    });
  }

  return problems;
}

// ============= MONEY =============
export function generateMoneyProblems(level: number, count: number, age: number = 5): Problem[] {
  const problems: Problem[] = [];
  const config = getMoneyConfig(age, level);

  const coinValues: Record<string, number> = {
    penny: 1,
    nickel: 5,
    dime: 10,
    quarter: 25,
  };

  for (let i = 0; i < count; i++) {
    // Build a collection of coins
    const selectedCoins: Array<{ type: string; count: number }> = [];
    let totalCents = 0;
    
    // Add 1-3 types of coins
    const coinTypesToUse = shuffleArray([...config.coinTypes]).slice(0, randomInt(1, Math.min(3, config.coinTypes.length)));
    
    for (const coinType of coinTypesToUse) {
      const maxCount = Math.floor((config.maxCents - totalCents) / coinValues[coinType]);
      if (maxCount > 0) {
        const coinCount = randomInt(1, Math.min(maxCount, 4));
        selectedCoins.push({ type: coinType, count: coinCount });
        totalCents += coinCount * coinValues[coinType];
      }
    }

    if (totalCents === 0) {
      totalCents = 25;
      selectedCoins.push({ type: 'quarter', count: 1 });
    }

    problems.push({
      id: `money-${level}-${i}`,
      type: 'visual',
      operation: 'addition',
      question: 'How much money is this?',
      visualAid: {
        type: 'money',
        data: {
          coins: selectedCoins,
          totalCents
        }
      },
      answer: totalCents.toString(),
      choices: generateMoneyChoices(totalCents),
      hint: 'Add up all the coins',
      difficulty: config.coinTypes.length <= 2 ? 'easy' : 'medium',
      concept: 'money_counting'
    });
  }

  return problems;
}

// ============= MEASUREMENT =============
export function generateMeasurementProblems(level: number, count: number, age: number = 5): Problem[] {
  const problems: Problem[] = [];
  const config = getMeasurementConfig(age, level);

  for (let i = 0; i < count; i++) {
    // For basic levels: comparison problems
    if (level <= 5) {
      const length1 = randomInt(3, config.maxValue);
      const length2 = randomInt(3, config.maxValue);
      const longer = length1 > length2 ? 'red' : 'blue';

      problems.push({
        id: `measure-${level}-${i}`,
        type: 'visual',
        operation: 'comparison',
        question: 'Which is longer?',
        visualAid: {
          type: 'objects',
          data: {
            items: [
              { length: length1, color: 'red' },
              { length: length2, color: 'blue' }
            ]
          }
        },
        answer: longer,
        choices: ['red', 'blue'],
        hint: 'Compare the lengths',
        difficulty: 'easy',
        concept: 'measurement_comparison'
      });
    } else {
      // Reading measurements
      const unit = config.units[randomInt(0, config.units.length - 1)];
      const value = randomInt(1, config.maxValue);

      problems.push({
        id: `measure-${level}-${i}`,
        type: 'visual',
        operation: 'comparison',
        question: `How many ${unit} is this?`,
        visualAid: {
          type: 'objects',
          data: {
            ruler: true,
            value,
            unit
          }
        },
        answer: value.toString(),
        choices: generateChoices(value, 4).map(String),
        hint: `Count the ${unit}`,
        difficulty: 'medium',
        concept: 'measurement_reading'
      });
    }
  }

  return problems;
}

// ============= PLACE VALUE =============
export function generatePlaceValueProblems(level: number, count: number, age: number = 5): Problem[] {
  const problems: Problem[] = [];
  const config = getPlaceValueConfig(age, level);

  for (let i = 0; i < count; i++) {
    // Generate a number based on maxDigits
    const maxValue = Math.pow(10, config.maxDigits) - 1;
    const minValue = Math.pow(10, config.maxDigits - 1);
    const number = randomInt(minValue, maxValue);

    const tens = Math.floor(number / 10) % 10;
    const ones = number % 10;
    const hundreds = Math.floor(number / 100) % 10;

    // Choose problem type based on config
    const problemType = config.problemTypes[randomInt(0, config.problemTypes.length - 1)];

    if (problemType === 'identify' && config.maxDigits <= 2) {
      problems.push({
        id: `place-${level}-${i}`,
        type: 'numeric',
        operation: 'place_value',
        question: `How many tens and ones in ${number}?`,
        answer: `${tens} tens, ${ones} ones`,
        choices: [
          `${tens} tens, ${ones} ones`,
          `${ones} tens, ${tens} ones`,
          `${number} ones`,
          `${tens + 1} tens, ${ones} ones`
        ].sort(() => Math.random() - 0.5),
        hint: 'Break down the number by place',
        difficulty: 'medium',
        concept: 'place_value_identify'
      });
    } else if (problemType === 'expand' || config.maxDigits > 2) {
      // Expanded form
      const expanded = config.maxDigits === 2
        ? `${tens * 10} + ${ones}`
        : `${hundreds * 100} + ${tens * 10} + ${ones}`;

      problems.push({
        id: `place-${level}-${i}`,
        type: 'numeric',
        operation: 'place_value',
        question: `What is the expanded form of ${number}?`,
        answer: expanded,
        choices: [
          expanded,
          `${ones * 10} + ${tens}`,
          `${number}`,
          `${tens} + ${ones}`
        ].sort(() => Math.random() - 0.5),
        hint: 'Separate by place value',
        difficulty: 'hard',
        concept: 'place_value_expand'
      });
    } else {
      // Compose from parts
      problems.push({
        id: `place-${level}-${i}`,
        type: 'numeric',
        operation: 'place_value',
        question: `${tens} tens and ${ones} ones = ?`,
        answer: number.toString(),
        choices: generateChoices(number, 4).map(String),
        hint: 'Put the tens and ones together',
        difficulty: 'medium',
        concept: 'place_value_compose'
      });
    }
  }

  return problems;
}

// ============= MULTIPLICATION =============
export function generateMultiplicationProblems(level: number, count: number, age: number = 5): Problem[] {
  const problems: Problem[] = [];
  const config = getMultiplicationConfig(age, level);

  for (let i = 0; i < count; i++) {
    const multiplier = config.availableTables[randomInt(0, config.availableTables.length - 1)];
    const multiplicand = randomInt(1, config.maxMultiplicand);
    const product = multiplier * multiplicand;

    if (config.useArrayVisualization) {
      problems.push({
        id: `mult-${level}-${i}`,
        type: 'visual',
        operation: 'multiplication',
        question: `${multiplicand} groups of ${multiplier}`,
        visualAid: {
          type: 'array',
          data: {
            rows: multiplicand,
            columns: multiplier,
            showGrouping: true
          }
        },
        answer: product,
        choices: generateChoices(product, 4),
        hint: 'Count all the dots',
        difficulty: 'easy',
        concept: 'equal_groups'
      });
    } else if (config.showVisuals) {
      const repeated = Array(multiplicand).fill(multiplier).join(' + ');
      problems.push({
        id: `mult-${level}-${i}`,
        type: 'numeric',
        operation: 'multiplication',
        question: `${repeated} = ${multiplier} × ${multiplicand} = ?`,
        answer: product,
        choices: generateChoices(product, 4),
        hint: `Add ${multiplier} together ${multiplicand} times`,
        difficulty: 'medium',
        concept: 'repeated_addition'
      });
    } else {
      problems.push({
        id: `mult-${level}-${i}`,
        type: 'numeric',
        operation: 'multiplication',
        question: `${multiplier} × ${multiplicand} = ?`,
        answer: product,
        choices: generateChoices(product, 4),
        hint: `Think of the ${multiplier}s times table`,
        difficulty: 'medium',
        concept: 'multiplication_facts'
      });
    }
  }

  return problems;
}

// ============= DIVISION =============
export function generateDivisionProblems(level: number, count: number, age: number = 6): Problem[] {
  const problems: Problem[] = [];
  const config = getDivisionConfig(age, level);

  for (let i = 0; i < count; i++) {
    // Pick a divisor
    const divisor = config.divisors[randomInt(0, config.divisors.length - 1)];
    // Generate a dividend that divides evenly (or with remainder if allowed)
    const quotient = randomInt(1, Math.floor(config.maxDividend / divisor));
    const dividend = divisor * quotient;

    if (config.showVisuals) {
      problems.push({
        id: `div-${level}-${i}`,
        type: 'visual',
        operation: 'division',
        question: `Share ${dividend} cookies equally between ${divisor} people`,
        visualAid: {
          type: 'objects',
          data: {
            total: dividend,
            groups: divisor
          }
        },
        answer: quotient.toString(),
        choices: generateChoices(quotient, 4).map(String),
        hint: 'Divide equally into groups',
        difficulty: 'easy',
        concept: 'equal_sharing'
      });
    } else {
      problems.push({
        id: `div-${level}-${i}`,
        type: 'numeric',
        operation: 'division',
        question: `${dividend} ÷ ${divisor} = ?`,
        answer: quotient,
        choices: generateChoices(quotient, 4),
        hint: `How many times does ${divisor} go into ${dividend}?`,
        difficulty: level <= 5 ? 'medium' : 'hard',
        concept: 'division_facts'
      });
    }
  }

  return problems;
}

// ============= NUMBER LINE =============
export function generateNumberLineProblems(level: number, count: number, age: number = 5): Problem[] {
  const problems: Problem[] = [];
  const config = getNumberLineConfig(age, level);

  for (let i = 0; i < count; i++) {
    const target = randomInt(1, config.maxNumber);
    const lineMax = Math.ceil(target / 10) * 10 + 10; // Round up to nice number

    problems.push({
      id: `line-${level}-${i}`,
      type: 'visual',
      operation: 'comparison',
      question: `Where does ${target} go on the number line?`,
      visualAid: {
        type: 'number_line',
        data: {
          min: 0,
          max: lineMax,
          markedPositions: config.showAllMarks
            ? Array.from({ length: lineMax / config.jumpSize + 1 }, (_, i) => i * config.jumpSize)
            : [0, lineMax]
        }
      },
      answer: target.toString(),
      choices: [
        target.toString(),
        (target - config.jumpSize).toString(),
        (target + config.jumpSize).toString(),
        (target + config.jumpSize * 2).toString()
      ].filter(v => parseInt(v) >= 0).sort(() => Math.random() - 0.5).slice(0, 4),
      hint: 'Find the position on the line',
      difficulty: config.maxNumber <= 20 ? 'easy' : 'medium',
      concept: 'number_line'
    });
  }

  return problems;
}

// ============= SHAPES =============
export function generateShapeProblems(level: number, count: number, age: number = 5): Problem[] {
  const basicShapes = ['circle', 'square', 'triangle'];
  const mediumShapes = ['circle', 'square', 'triangle', 'rectangle', 'oval'];
  const advancedShapes = ['circle', 'square', 'triangle', 'rectangle', 'oval', 'star', 'pentagon', 'hexagon', 'diamond'];
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

  // Shape selection based on age and level
  let shapes: string[];
  if (age <= 4 || level <= 3) {
    shapes = basicShapes;
  } else if (age <= 6 || level <= 8) {
    shapes = mediumShapes;
  } else {
    shapes = advancedShapes;
  }

  return Array(count).fill(0).map((_, i) => {
    const shape = shapes[randomInt(0, shapes.length - 1)];
    const color = colors[randomInt(0, colors.length - 1)];
    const wrongChoices = shapes.filter(s => s !== shape);
    const choices = shuffleArray([shape, ...wrongChoices.slice(0, 3)]).slice(0, 4);

    return {
      id: `shape-${level}-${i}`,
      type: 'visual' as ProblemType,
      operation: 'comparison' as Operation,
      question: 'What shape is this?',
      visualAid: {
        type: 'shape' as const,
        data: { shape, color }
      },
      answer: shape,
      choices,
      hint: 'Look at the number of sides and corners',
      difficulty: shapes.length <= 3 ? 'easy' : shapes.length <= 5 ? 'medium' : 'hard',
      concept: 'shape_recognition'
    };
  });
}

// ============= WORD PROBLEMS =============
export function generateWordProblems(level: number, count: number, age: number = 5): Problem[] {
  const problems: Problem[] = [];
  
  // Scale numbers based on age and level
  const maxNum = age <= 4 ? 5 : age <= 6 ? 10 : age <= 7 ? 20 : 30;
  const levelMultiplier = 1 + ((level - 1) * 0.1);
  const scaledMax = Math.round(maxNum * levelMultiplier);

  const scenarios = [
    {
      template: "{name} has {num1} {item}. {friend} gives {pronoun} {num2} more. How many {item} does {name} have now?",
      operation: 'addition' as Operation,
      items: ['apples', 'toys', 'books', 'cookies', 'stickers'],
      names: ['Emma', 'Noah', 'Olivia', 'Liam', 'Sophia'],
      friends: ['Dad', 'Mom', 'Grandma', 'a friend']
    },
    {
      template: "{name} had {num1} {item}. {pronoun2} gave {num2} to {friend}. How many {item} does {name} have left?",
      operation: 'subtraction' as Operation,
      items: ['stickers', 'marbles', 'candies', 'crayons', 'pencils'],
      names: ['Mia', 'James', 'Ava', 'Lucas', 'Isabella'],
      friends: ['a friend', 'brother', 'sister']
    }
  ];

  // Only add multiplication for older kids or higher levels
  if (age >= 6 || level >= 8) {
    scenarios.push({
      template: "There are {num1} boxes. Each box has {num2} {item}. How many {item} are there in total?",
      operation: 'multiplication' as Operation,
      items: ['toys', 'pencils', 'cookies', 'balls', 'books'],
      names: ['Alex', 'Taylor', 'Jordan'],
      friends: ['']
    });
  }

  for (let i = 0; i < count; i++) {
    const scenario = scenarios[randomInt(0, scenarios.length - 1)];
    const item = scenario.items[randomInt(0, scenario.items.length - 1)];
    const name = scenario.names[randomInt(0, scenario.names.length - 1)];
    const friend = scenario.friends[randomInt(0, scenario.friends.length - 1)];
    const pronoun = ['Emma', 'Olivia', 'Sophia', 'Mia', 'Ava', 'Isabella'].includes(name) ? 'her' : 'him';
    const pronoun2 = ['Emma', 'Olivia', 'Sophia', 'Mia', 'Ava', 'Isabella'].includes(name) ? 'She' : 'He';

    let num1 = randomInt(2, scaledMax);
    let num2 = randomInt(1, scenario.operation === 'subtraction' ? num1 - 1 : Math.floor(scaledMax / 2));

    // For multiplication, keep numbers smaller
    if (scenario.operation === 'multiplication') {
      num1 = randomInt(2, Math.min(5, scaledMax / 5));
      num2 = randomInt(2, Math.min(6, scaledMax / 3));
    }

    let answer: number;
    switch (scenario.operation) {
      case 'addition':
        answer = num1 + num2;
        break;
      case 'subtraction':
        answer = num1 - num2;
        break;
      case 'multiplication':
        answer = num1 * num2;
        break;
      default:
        answer = 0;
    }

    const question = scenario.template
      .replace(/{num1}/g, num1.toString())
      .replace(/{num2}/g, num2.toString())
      .replace(/{item}/g, item)
      .replace(/{name}/g, name)
      .replace(/{friend}/g, friend)
      .replace(/{pronoun}/g, pronoun)
      .replace(/{pronoun2}/g, pronoun2);

    problems.push({
      id: `word-${level}-${i}`,
      type: 'word_problem',
      operation: scenario.operation,
      question,
      visualAid: {
        type: 'objects',
        data: {
          scenario: scenario.template,
          illustration: `illustration_${item}.png`
        }
      },
      answer,
      choices: generateChoices(answer, 4),
      hint: `Look for key words: "${scenario.operation === 'addition' ? 'more, total, altogether' : scenario.operation === 'subtraction' ? 'left, gave away, remaining' : 'each, in total, altogether'}"`,
      difficulty: scenario.operation === 'multiplication' ? 'hard' : level <= 5 ? 'easy' : 'medium',
      concept: `word_problem_${scenario.operation}`
    });
  }

  return problems;
}

// ============= SPEED MATH =============
export function generateSpeedMathProblems(level: number, count: number, age: number = 5): Problem[] {
  const problems: Problem[] = [];
  
  // Speed math adapts based on age - simpler operations for younger kids
  const config = getAdditionConfig(age, level);
  
  for (let i = 0; i < count; i++) {
    // Mix of addition and subtraction (no multiplication for young kids)
    const useSubtraction = age >= 5 && Math.random() < 0.4;
    
    let num1: number, num2: number, answer: number, question: string;
    
    if (useSubtraction) {
      num1 = randomInt(Math.floor(config.maxSum / 2), config.maxSum);
      num2 = randomInt(1, num1 - 1);
      answer = num1 - num2;
      question = `${num1} - ${num2} = ?`;
    } else {
      num1 = randomInt(1, config.operandMax);
      num2 = randomInt(1, Math.min(config.maxSum - num1, config.operandMax));
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
    }

    problems.push({
      id: `speed-${level}-${i}`,
      type: 'numeric',
      operation: useSubtraction ? 'subtraction' : 'addition',
      question,
      answer,
      choices: generateChoices(answer, 4),
      hint: 'Answer quickly!',
      difficulty: 'hard',
      concept: 'speed_math'
    });
  }

  return problems;
}

// ============= UTILITY FUNCTIONS =============

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateChoices(correctAnswer: number | string, count: number): Array<number | string> {
  const choices: Set<number | string> = new Set([correctAnswer]);

  if (typeof correctAnswer === 'number') {
    while (choices.size < count) {
      const offset = randomInt(-5, 5);
      const choice = correctAnswer + offset;
      if (choice >= 0 && choice !== correctAnswer) {
        choices.add(choice);
      }
    }
  }

  return Array.from(choices).sort(() => Math.random() - 0.5);
}

function generateMoneyChoices(correctCents: number): string[] {
  const choices = [correctCents.toString()];
  const offsets = [-10, -5, 5, 10, 15, -15, 25, -25];
  
  for (const offset of shuffleArray(offsets)) {
    if (choices.length >= 4) break;
    const wrong = correctCents + offset;
    if (wrong > 0 && !choices.includes(wrong.toString())) {
      choices.push(wrong.toString());
    }
  }
  
  while (choices.length < 4) {
    choices.push((correctCents + randomInt(1, 50)).toString());
  }
  
  return choices.sort(() => Math.random() - 0.5);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
