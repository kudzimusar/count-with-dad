import { Problem, ProblemType, Operation } from '@/types/math';

export function generateProblems(
  modeId: string,
  level: number,
  count: number = 10
): Problem[] {
  type ProblemGenerator = (level: number, count: number) => Problem[];
  
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

  return generator(level, count);
}

export function generateNumberSenseProblems(level: number, count: number): Problem[] {
  const problems: Problem[] = [];
  const maxNumber = level <= 5 ? 5 : level <= 10 ? 10 : 20;

  for (let i = 0; i < count; i++) {
    const num1 = randomInt(1, maxNumber);
    const num2 = randomInt(1, maxNumber);
    const larger = Math.max(num1, num2);
    const smaller = Math.min(num1, num2);

    if (level <= 5) {
      problems.push({
        id: `ns-${level}-${i}`,
        type: 'visual',
        operation: 'comparison',
        question: 'Which has more?',
        visualAid: {
          type: 'objects',
          data: {
            groups: [
              { count: num1, object: '🍎' },
              { count: num2, object: '🍌' }
            ]
          }
        },
        answer: larger,
        choices: [num1, num2],
        hint: `Count each group carefully`,
        difficulty: 'easy',
        concept: 'comparison'
      });
    } else if (level <= 10) {
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
              { count: num1, object: '⭐' },
              { count: compareNum, object: '⭐' }
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
        hint: 'Look at the number line',
        difficulty: 'medium',
        concept: 'ordering'
      });
    }
  }

  return problems;
}

export function generateAdditionBasicProblems(level: number, count: number): Problem[] {
  const problems: Problem[] = [];
  const maxSum = level <= 5 ? 5 : level <= 10 ? 10 : level <= 15 ? 15 : 20;

  for (let i = 0; i < count; i++) {
    const num1 = randomInt(0, Math.floor(maxSum / 2));
    const num2 = randomInt(0, maxSum - num1);
    const sum = num1 + num2;

    if (level <= 5) {
      problems.push({
        id: `add-${level}-${i}`,
        type: 'visual',
        operation: 'addition',
        question: `${num1} + ${num2} = ?`,
        visualAid: {
          type: 'objects',
          data: {
            groups: [
              { count: num1, object: '🍎', label: `${num1}` },
              { count: num2, object: '🍎', label: `+ ${num2}` }
            ],
            showCombined: true
          }
        },
        answer: sum,
        hint: 'Count all the objects together',
        difficulty: 'easy',
        concept: 'addition_visual'
      });
    } else if (level <= 10) {
      problems.push({
        id: `add-${level}-${i}`,
        type: 'numeric',
        operation: 'addition',
        question: `${num1} + ${num2} = ?`,
        visualAid: {
          type: 'blocks',
          data: {
            tens: 0,
            ones: num1 + num2,
            showSeparate: true,
            groups: [num1, num2]
          }
        },
        answer: sum,
        choices: generateChoices(sum, 4),
        hint: `Think: ${num1} and ${num2} more`,
        difficulty: 'medium',
        concept: 'addition_within_10'
      });
    } else {
      const knownAddend = randomInt(1, maxSum - 1);
      const missingAddend = randomInt(1, maxSum - knownAddend);
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
    }
  }

  return problems;
}

export function generateMultiplicationProblems(level: number, count: number): Problem[] {
  const problems: Problem[] = [];
  const availableFacts = level <= 5 ? [2] : level <= 10 ? [2, 5] : [2, 5, 10];

  for (let i = 0; i < count; i++) {
    const multiplier = availableFacts[randomInt(0, availableFacts.length - 1)];
    const multiplicand = randomInt(1, 10);
    const product = multiplier * multiplicand;

    if (level <= 5) {
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
        hint: 'Count all the dots',
        difficulty: 'easy',
        concept: 'equal_groups'
      });
    } else if (level <= 10) {
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

export function generateWordProblems(level: number, count: number): Problem[] {
  const problems: Problem[] = [];
  const scenarios = [
    {
      template: "Dad has {num1} {item1}. You give him {num2} more. How many does he have now?",
      operation: 'addition' as Operation,
      items: ['apples', 'toys', 'books', 'cookies']
    },
    {
      template: "You had {num1} {item1}. You gave away {num2}. How many do you have left?",
      operation: 'subtraction' as Operation,
      items: ['stickers', 'marbles', 'candies', 'crayons']
    },
    {
      template: "There are {num1} boxes. Each box has {num2} {item1}. How many {item1} in total?",
      operation: 'multiplication' as Operation,
      items: ['toys', 'pencils', 'cookies', 'balls']
    }
  ];

  for (let i = 0; i < count; i++) {
    const scenario = scenarios[randomInt(0, scenarios.length - 1)];
    const item = scenario.items[randomInt(0, scenario.items.length - 1)];

    const num1 = randomInt(1, level <= 5 ? 5 : level <= 10 ? 10 : 20);
    const num2 = randomInt(1, level <= 5 ? 5 : level <= 10 ? 10 : 20);

    let answer: number;
    switch (scenario.operation) {
      case 'addition':
        answer = num1 + num2;
        break;
      case 'subtraction':
        answer = Math.max(0, num1 - num2);
        break;
      case 'multiplication':
        answer = num1 * num2;
        break;
      default:
        answer = 0;
    }

    const question = scenario.template
      .replace('{num1}', num1.toString())
      .replace('{num2}', num2.toString())
      .replace('{item1}', item)
      .replace('{item1}', item);

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
      hint: `Look for the key words: "${scenario.operation === 'addition' ? 'more, total' : scenario.operation === 'subtraction' ? 'left, away' : 'each, total'}"`,
      difficulty: level <= 5 ? 'easy' : level <= 15 ? 'medium' : 'hard',
      concept: `word_problem_${scenario.operation}`
    });
  }

  return problems;
}

// Utility functions
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

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Placeholder generators for other modes
export function generateShapeProblems(level: number, count: number): Problem[] {
  const basicShapes = ['circle', 'square', 'triangle'];
  const mediumShapes = ['circle', 'square', 'triangle', 'rectangle', 'oval'];
  const advancedShapes = ['circle', 'square', 'triangle', 'rectangle', 'oval', 'star', 'pentagon', 'hexagon', 'diamond'];
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

  const shapes = level <= 5 ? basicShapes : level <= 10 ? mediumShapes : advancedShapes;

  return Array(count).fill(0).map((_, i) => {
    const shape = shapes[randomInt(0, shapes.length - 1)];
    const color = colors[randomInt(0, colors.length - 1)];
    const wrongChoices = shapes.filter(s => s !== shape);
    const choices = shuffle([shape, ...wrongChoices.slice(0, 3)]).slice(0, 4);

    return {
      id: `shape-${level}-${i}`,
      type: 'visual' as ProblemType,
      operation: 'comparison' as Operation,
      question: 'What shape is this?',
      visualAid: {
        type: 'shape' as const,
        data: {
          shape,
          color
        }
      },
      answer: shape,
      choices,
      hint: `Look at the number of sides and corners`,
      difficulty: level <= 5 ? 'easy' : level <= 10 ? 'medium' : 'hard',
      concept: 'shape_recognition'
    };
  });
}

export function generateSubtractionBasicProblems(level: number, count: number): Problem[] {
  return Array(count).fill(0).map((_, i) => ({
    id: `sub-${level}-${i}`,
    type: 'numeric',
    operation: 'subtraction',
    question: `${randomInt(5, 10)} - ${randomInt(1, 4)} = ?`,
    answer: randomInt(1, 9),
    choices: generateChoices(randomInt(1, 9), 4),
    hint: 'Subtract the smaller number',
    difficulty: 'medium',
    concept: 'subtraction_basic'
  }));
}

export function generateSkipCountingProblems(level: number, count: number): Problem[] {
  return Array(count).fill(0).map((_, i) => ({
    id: `skip-${level}-${i}`,
    type: 'numeric',
    operation: 'skip_counting',
    question: 'Count by 2s: 2, 4, ?, 8',
    answer: '6',
    choices: ['5', '6', '7', '8'],
    hint: 'Skip count by 2s',
    difficulty: 'medium',
    concept: 'skip_counting'
  }));
}

export function generateTimeProblems(level: number, count: number): Problem[] {
  return Array(count).fill(0).map((_, i) => ({
    id: `time-${level}-${i}`,
    type: 'visual',
    operation: 'comparison',
    question: 'What time is it?',
    visualAid: {
      type: 'clock',
      data: {
        hour: 3,
        minute: 0
      }
    },
    answer: '3:00',
    choices: ['2:00', '3:00', '4:00', '5:00'],
    hint: 'Look at the clock',
    difficulty: 'medium',
    concept: 'time_telling'
  }));
}

export function generateAdditionAdvancedProblems(level: number, count: number): Problem[] {
  return Array(count).fill(0).map((_, i) => ({
    id: `add-adv-${level}-${i}`,
    type: 'numeric',
    operation: 'addition',
    question: `${randomInt(10, 20)} + ${randomInt(10, 20)} = ?`,
    answer: randomInt(20, 40),
    choices: generateChoices(randomInt(20, 40), 4),
    hint: 'Add the tens and ones separately',
    difficulty: 'hard',
    concept: 'addition_advanced'
  }));
}

export function generateSubtractionAdvancedProblems(level: number, count: number): Problem[] {
  return Array(count).fill(0).map((_, i) => ({
    id: `sub-adv-${level}-${i}`,
    type: 'numeric',
    operation: 'subtraction',
    question: `${randomInt(20, 30)} - ${randomInt(10, 15)} = ?`,
    answer: randomInt(5, 20),
    choices: generateChoices(randomInt(5, 20), 4),
    hint: 'Subtract carefully',
    difficulty: 'hard',
    concept: 'subtraction_advanced'
  }));
}

export function generateMoneyProblems(level: number, count: number): Problem[] {
  return Array(count).fill(0).map((_, i) => ({
    id: `money-${level}-${i}`,
    type: 'visual',
    operation: 'addition',
    question: 'How much money is this?',
    visualAid: {
      type: 'money',
      data: {
        coins: [{ type: 'quarter', count: 2 }],
        totalCents: 50
      }
    },
    answer: '50',
    choices: ['25', '50', '75', '100'],
    hint: 'Count the coins',
    difficulty: 'medium',
    concept: 'money_counting'
  }));
}

export function generateMeasurementProblems(level: number, count: number): Problem[] {
  return Array(count).fill(0).map((_, i) => ({
    id: `measure-${level}-${i}`,
    type: 'visual',
    operation: 'comparison',
    question: 'Which is longer?',
    visualAid: {
      type: 'objects',
      data: {
        items: [
          { length: 10, color: 'red' },
          { length: 15, color: 'blue' }
        ]
      }
    },
    answer: 'blue',
    choices: ['red', 'blue'],
    hint: 'Compare the lengths',
    difficulty: 'easy',
    concept: 'measurement'
  }));
}

export function generatePlaceValueProblems(level: number, count: number): Problem[] {
  return Array(count).fill(0).map((_, i) => ({
    id: `place-${level}-${i}`,
    type: 'numeric',
    operation: 'place_value',
    question: 'How many tens and ones in 23?',
    answer: '2 tens, 3 ones',
    choices: ['2 tens, 3 ones', '3 tens, 2 ones', '23 ones'],
    hint: 'Break down the number',
    difficulty: 'medium',
    concept: 'place_value'
  }));
}

export function generateDivisionProblems(level: number, count: number): Problem[] {
  return Array(count).fill(0).map((_, i) => ({
    id: `div-${level}-${i}`,
    type: 'visual',
    operation: 'division',
    question: 'Share 8 cookies equally between 2 people',
    visualAid: {
      type: 'objects',
      data: {
        total: 8,
        groups: 2
      }
    },
    answer: '4',
    choices: ['2', '4', '6', '8'],
    hint: 'Divide equally',
    difficulty: 'medium',
    concept: 'division'
  }));
}

export function generateNumberLineProblems(level: number, count: number): Problem[] {
  return Array(count).fill(0).map((_, i) => ({
    id: `line-${level}-${i}`,
    type: 'visual',
    operation: 'comparison',
    question: 'Where does 5 go on the number line?',
    visualAid: {
      type: 'number_line',
      data: {
        min: 0,
        max: 10,
        markedPositions: [0, 10]
      }
    },
    answer: '5',
    choices: ['3', '5', '7', '9'],
    hint: 'Find the middle',
    difficulty: 'medium',
    concept: 'number_line'
  }));
}

export function generateSpeedMathProblems(level: number, count: number): Problem[] {
  return Array(count).fill(0).map((_, i) => ({
    id: `speed-${level}-${i}`,
    type: 'numeric',
    operation: 'addition',
    question: `${randomInt(1, 10)} + ${randomInt(1, 10)} = ?`,
    answer: randomInt(2, 20),
    choices: generateChoices(randomInt(2, 20), 4),
    hint: 'Answer quickly!',
    difficulty: 'hard',
    concept: 'speed_math'
  }));
}
