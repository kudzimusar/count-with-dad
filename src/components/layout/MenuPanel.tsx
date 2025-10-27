import { Screen, CountingMode } from '@/types';
import { UserCircle, Lock } from 'lucide-react';
import { ProgressTracker } from './ProgressTracker';

interface MenuPanelProps {
  currentScreen: Screen;
  currentMode: CountingMode;
  unlockedPuzzleLevels: number;
  unlockedMathLevels: number;
  correctAnswersCount: number;
  subscriptionStatus: 'free' | 'trial' | 'premium';
  onScreenChange: (screen: Screen) => void;
  onModeChange: (mode: CountingMode) => void;
  onAskParent: () => void;
  onPremiumFeatureClick: (feature: string) => void;
}

export function MenuPanel({
  currentScreen,
  currentMode,
  unlockedPuzzleLevels,
  unlockedMathLevels,
  correctAnswersCount,
  subscriptionStatus,
  onScreenChange,
  onModeChange,
  onAskParent,
  onPremiumFeatureClick,
}: MenuPanelProps) {
  const isPremium = subscriptionStatus === 'premium';
  
  const screens: { screen: Screen; label: string; emoji: string; isPremium?: boolean }[] = [
    { screen: 'counting', label: 'Counting', emoji: '🔢' },
    { screen: 'puzzle', label: 'Puzzles', emoji: '🧩', isPremium: false },
    { screen: 'math', label: 'Math', emoji: '➕', isPremium: false },
  ];

  const modes: { mode: CountingMode; label: string; isPremium?: boolean }[] = [
    { mode: 'order', label: 'Count in Order', isPremium: false },
    { mode: 'challenge', label: 'Number Challenge', isPremium: true },
    { mode: 'free', label: 'Free Play', isPremium: false },
  ];

  const handleScreenClick = (screen: Screen, locked: boolean) => {
    if (locked && !isPremium) {
      onPremiumFeatureClick(screen === 'puzzle' ? 'Advanced Puzzles' : 'Advanced Math');
    } else {
      onScreenChange(screen);
    }
  };

  const handleModeClick = (mode: CountingMode, locked: boolean) => {
    if (locked && !isPremium) {
      onPremiumFeatureClick('Number Challenge Mode');
    } else {
      onModeChange(mode);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-b-2xl p-6 space-y-6 animate-fade-in">
      {/* Screen Selection */}
      <div>
        <h3 className="text-lg font-bold mb-3 text-purple-600">Choose Activity</h3>
        <div className="grid grid-cols-3 gap-3">
          {screens.map(({ screen, label, emoji, isPremium: screenIsPremium }) => {
            const isLocked = screenIsPremium && !isPremium;
            return (
              <button
                key={screen}
                onClick={() => handleScreenClick(screen, isLocked)}
                className={`p-4 rounded-xl font-bold transition-all relative ${
                  currentScreen === screen
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }`}
              >
                {isLocked && (
                  <div className="absolute top-2 right-2">
                    <Lock className="h-4 w-4" />
                  </div>
                )}
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="text-sm">{label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Selection (only for counting screen) */}
      {currentScreen === 'counting' && (
        <div>
          <h3 className="text-lg font-bold mb-3 text-purple-600">Counting Mode</h3>
          <div className="flex flex-col gap-2">
            {modes.map(({ mode, label, isPremium: modeIsPremium }) => {
              const isLocked = modeIsPremium && !isPremium;
              return (
                <button
                  key={mode}
                  onClick={() => handleModeClick(mode, isLocked)}
                  className={`px-4 py-3 rounded-lg font-bold text-sm transition-all relative ${
                    currentMode === mode
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{label}</span>
                    {isLocked && <Lock className="h-4 w-4" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress Tracker */}
      <div>
        <h3 className="text-lg font-bold mb-3 text-purple-600">Level Progress</h3>
        <ProgressTracker 
          current={correctAnswersCount % 10} 
          target={10} 
          label="Next Level Unlock"
        />
      </div>

      {/* Level Unlocks Info */}
      <div className="bg-purple-50 p-4 rounded-xl">
        <h3 className="text-sm font-bold mb-2 text-purple-600">Progress</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span>Puzzle Levels</span>
            <span className="font-bold text-purple-600">
              {unlockedPuzzleLevels} unlocked {!isPremium && unlockedPuzzleLevels >= 3 && '🔒'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Math Levels</span>
            <span className="font-bold text-purple-600">
              {unlockedMathLevels} unlocked {!isPremium && unlockedMathLevels >= 3 && '🔒'}
            </span>
          </div>
          {!isPremium && (
            <p className="text-xs text-muted-foreground mt-2">
              Upgrade to unlock all 10 levels!
            </p>
          )}
        </div>
      </div>

      {/* Ask Parent */}
      <button
        onClick={onAskParent}
        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
      >
        <UserCircle className="h-6 w-6" />
        Ask Parent
      </button>
    </div>
  );
}
