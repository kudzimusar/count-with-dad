interface LevelUnlockModalProps {
  isOpen: boolean;
  level: number;
  gameType: 'puzzle' | 'math';
  onClose: () => void;
}

export function LevelUnlockModal({ isOpen, level, gameType, onClose }: LevelUnlockModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-scale-in shadow-2xl">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold mb-2 text-purple-600">Level Unlocked!</h2>
        <p className="text-xl mb-6">
          You've unlocked {gameType === 'puzzle' ? 'Puzzle' : 'Math'} Level {level}!
        </p>
        <p className="text-gray-600 mb-6">
          Keep up the great work! You're doing amazing!
        </p>
        <button
          onClick={onClose}
          className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
