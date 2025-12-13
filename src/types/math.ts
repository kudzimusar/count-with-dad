export type ModeCategory = 'foundation' | 'operations' | 'applications' | 'advanced';
export type ProblemType = 'visual' | 'numeric' | 'word_problem' | 'missing_number' | 'comparison' | 'pattern' | 'measurement';
export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'comparison' | 'skip_counting' | 'place_value';

export interface MathMode {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  description: string;
  ageRange: [number, number];
  totalLevels: number;
  category: ModeCategory;
  skills: string[];
  unlockRequirements: UnlockRequirement[];
}

export interface UnlockRequirement {
  type: 'level_complete' | 'accuracy_threshold' | 'streak' | 'multi_mode' | 'age_gate';
  modeId?: string;
  level?: number;
  accuracy?: number;
  streak?: number;
  alternativeRequirements?: UnlockRequirement[][];
  minAge?: number;
}

export interface MathLevel {
  modeId: string;
  levelNumber: number;
  difficultyTier: 'easy' | 'medium' | 'hard';
  numberRangeMin: number;
  numberRangeMax: number;
  problemTypes: ProblemType[];
  hasVisualAids: boolean;
  hasTutorialVideo: boolean;
  tutorialVideoUrl?: string;
  estimatedTimeMinutes: number;
}

export interface Problem {
  id: string;
  type: ProblemType;
  operation: Operation;
  question: string;
  visualAid?: VisualAid;
  answer: number | string;
  choices?: Array<number | string>;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  concept: string;
}

export interface VisualAid {
  type: 'objects' | 'number_line' | 'array' | 'money' | 'clock' | 'blocks';
  data: any;
}

export interface LevelAttempt {
  userId: string;
  modeId: string;
  levelNumber: number;
  attemptNumber: number;
  problemsAttempted: number;
  problemsCorrect: number;
  accuracy: number;
  starsEarned: 0 | 1 | 2 | 3;
  timeSpentSeconds: number;
  averageTimePerProblem: number;
  hintsUsed: number;
  passed: boolean;
  completedAt: Date;
}

export interface UserProgress {
  userId: string;
  modeId: string;
  currentLevel: number;
  highestLevelReached: number;
  totalStarsEarned: number;
  totalProblemsAttempted: number;
  totalProblemsCorrect: number;
  overallAccuracy: number;
  totalTimeSpentSeconds: number;
  lastPlayedAt: Date;
}

export interface ProblemAttempt {
  userId: string;
  modeId: string;
  levelNumber: number;
  problemType: ProblemType;
  problemData: any;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  hintUsed: boolean;
  attemptNumber: number;
  createdAt: Date;
}
