import { CountingMode } from '@/types';
import { COLORS } from '@/utils/constants';

interface CountingGridProps {
  currentNumber: number;
  countingMode: CountingMode;
  challengeNumber: number | null;
  completedNumbers: number[];
  onNumberClick: (num: number) => void;
  maxVisibleNumber?: number;
}

export function CountingGrid({
  currentNumber,
  countingMode,
  challengeNumber,
  completedNumbers,
  onNumberClick,
  maxVisibleNumber = 100,
}: CountingGridProps) {
  const numbers = Array.from({ length: maxVisibleNumber }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4 max-w-4xl mx-auto pb-8">
      {numbers.map((num) => {
        const colorIndex = Math.floor((num - 1) / 10);
        const isNext = num === currentNumber;
        const isCompleted = num < currentNumber;
        const hasCheckmark = completedNumbers.includes(num);
        const isChallengeTarget = countingMode === 'challenge' && num === challengeNumber;

        return (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            className={`number-bubble aspect-square flex items-center justify-center text-3xl sm:text-4xl md:text-3xl lg:text-4xl font-bold rounded-lg transition-all duration-300 relative ${
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
            {hasCheckmark && (
              <span className="absolute top-0 right-0 text-green-600 text-xl">✓</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
