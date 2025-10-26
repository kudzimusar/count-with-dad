export type CountingMode = 'order' | 'challenge' | 'free';
export type Screen = 'counting' | 'puzzle' | 'math' | 'parent';

export interface VoiceSettings {
  rate: number;
  pitch: number;
  voiceType: string;
}

export interface SessionRecord {
  date: string;
  duration: number;
  screen: Screen;
  mode?: CountingMode;
  score: number;
}

export interface FeedbackData {
  type: 'difficulty' | 'bug' | 'suggestion' | 'other';
  message: string;
  timestamp: string;
  context?: string;
}

export interface AppState {
  currentScreen: Screen;
  countingMode: CountingMode;
  currentNumber: number;
  highestCount: number;
  stars: number;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  puzzleLevel: number;
  mathLevel: number;
  challengeLevel: number;
  puzzlesSolved: number;
  mathSolved: number;
  challengeNumber: number | null;
  parentCode: number[];
  selectedPuzzleNumber: number | null;
  puzzleSequence: number[];
  uiVisible: boolean;
  menuOpen: boolean;
  childName: string;
  childAge: number;
  childAvatar: string;
  childGender?: 'boy' | 'girl' | 'other' | 'prefer-not-to-say';
  parentEmail?: string;
  parentRelationship?: string;
  registeredAt?: string;
  dailyGoal: number;
  sessionHistory: SessionRecord[];
  voiceSettings: VoiceSettings;
  timeLimit: number;
  unlockedPuzzleLevels: number;
  unlockedMathLevels: number;
  completedNumbers: number[];
  correctAnswersCount: number;
  feedbackHistory: FeedbackData[];
  hasCompletedOnboarding: boolean;
}
