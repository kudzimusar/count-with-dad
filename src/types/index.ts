export type CountingMode = 'order' | 'challenge' | 'free';
export type Screen = 'counting' | 'puzzle' | 'math' | 'parent';

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
}
