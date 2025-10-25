import { CountingMode } from '@/types';
import { COLORS } from '@/utils/constants';

interface CountingGridProps {
  currentNumber: number;
  countingMode: CountingMode;
  challengeNumber: number | null;
  onNumberClick: (num: number) => void;
}

export function CountingGrid({
  currentNumber,
  countingMode,
  challengeNumber,
  onNumberClick,
}: CountingGridProps) {
  const numbers = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-10 gap-2 max-w-4xl mx-auto">
      {numbers.map((num) => {
        const colorIndex = Math.floor((num - 1) / 10);
        const isNext = num === currentNumber;
        const isCompleted = num < currentNumber;
        const isChallengeTarget = countingMode === 'challenge' && num === challengeNumber;

        return (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            className={`number-bubble aspect-square flex items-center justify-center text-2xl md:text-3xl font-bold rounded-lg transition-all duration-300 ${
              isNext && countingMode === 'order'
                ? 'ring-4 ring-green-400 shadow-lg scale-110'
                : isChallengeTarget
                ? 'ring-4 ring-yellow-400 shadow-lg scale-110 animate-pulse'
                : isCompleted && countingMode === 'order'
                ? 'completed-number'
                : 'shadow-md hover:scale-105'
            }`}
            style={{ backgroundColor: COLORS[colorIndex] }}
          >
            {num}
          </button>
        );
      })}
    </div>
  );
}
