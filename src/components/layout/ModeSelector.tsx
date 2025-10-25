import { CountingMode } from '@/types';

interface ModeSelectorProps {
  currentMode: CountingMode;
  onModeChange: (mode: CountingMode) => void;
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const modes: { mode: CountingMode; label: string }[] = [
    { mode: 'order', label: 'Count in Order' },
    { mode: 'challenge', label: 'Number Challenge' },
    { mode: 'free', label: 'Free Play' },
  ];

  return (
    <div className="bg-white shadow-md py-3 px-6 flex justify-center gap-2">
      {modes.map(({ mode, label }) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className={`px-3 py-2 rounded-lg font-bold text-sm transition-colors ${
            currentMode === mode
              ? 'bg-purple-600 text-white'
              : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
