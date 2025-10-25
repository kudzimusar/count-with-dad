import { Screen, CountingMode } from '@/types';
import { Lock } from 'lucide-react';

interface MenuPanelProps {
  currentScreen: Screen;
  currentMode: CountingMode;
  unlockedPuzzleLevels: number;
  unlockedMathLevels: number;
  onScreenChange: (screen: Screen) => void;
  onModeChange: (mode: CountingMode) => void;
}

export function MenuPanel({
  currentScreen,
  currentMode,
  unlockedPuzzleLevels,
  unlockedMathLevels,
  onScreenChange,
  onModeChange,
}: MenuPanelProps) {
  const screens: { screen: Screen; label: string; emoji: string }[] = [
    { screen: 'counting', label: 'Counting', emoji: '🔢' },
    { screen: 'puzzle', label: 'Puzzles', emoji: '🧩' },
    { screen: 'math', label: 'Math', emoji: '➕' },
  ];

  const modes: { mode: CountingMode; label: string }[] = [
    { mode: 'order', label: 'Count in Order' },
    { mode: 'challenge', label: 'Number Challenge' },
    { mode: 'free', label: 'Free Play' },
  ];

  return (
    <div className="bg-white shadow-lg rounded-b-2xl p-6 space-y-6 animate-fade-in">
      {/* Screen Selection */}
      <div>
        <h3 className="text-lg font-bold mb-3 text-purple-600">Choose Activity</h3>
        <div className="grid grid-cols-3 gap-3">
          {screens.map(({ screen, label, emoji }) => (
            <button
              key={screen}
              onClick={() => onScreenChange(screen)}
              className={`p-4 rounded-xl font-bold transition-all ${
                currentScreen === screen
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            >
              <div className="text-3xl mb-2">{emoji}</div>
              <div className="text-sm">{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Mode Selection (only for counting screen) */}
      {currentScreen === 'counting' && (
        <div>
          <h3 className="text-lg font-bold mb-3 text-purple-600">Counting Mode</h3>
          <div className="flex flex-col gap-2">
            {modes.map(({ mode, label }) => (
              <button
                key={mode}
                onClick={() => onModeChange(mode)}
                className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                  currentMode === mode
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Level Unlocks Info */}
      <div className="bg-purple-50 p-4 rounded-xl">
        <h3 className="text-sm font-bold mb-2 text-purple-600">Progress</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span>Puzzle Levels</span>
            <span className="font-bold text-purple-600">{unlockedPuzzleLevels} unlocked</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Math Levels</span>
            <span className="font-bold text-purple-600">{unlockedMathLevels} unlocked</span>
          </div>
        </div>
      </div>

      {/* Parent Access */}
      <button
        onClick={() => onScreenChange('parent')}
        className="w-full bg-gray-700 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
      >
        <Lock className="h-5 w-5" />
        Parent Settings
      </button>
    </div>
  );
}
