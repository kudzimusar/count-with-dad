import { Star, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface LevelCompleteModalProps {
  result: {
    level: number;
    problemsAttempted: number;
    problemsCorrect: number;
    accuracy: number;
    timeSpent: number;
    starsEarned: 0 | 1 | 2 | 3;
    passed: boolean;
    averageTimePerProblem: number;
  };
  modeName: string;
  onNext: () => void;
  onRetry: () => void;
  onExit: () => void;
  newBadges?: string[];
}

export function LevelCompleteModal({
  result,
  modeName,
  onNext,
  onRetry,
  onExit,
  newBadges = []
}: LevelCompleteModalProps) {

  useEffect(() => {
    if (result.passed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [result.passed]);

  const renderStars = () => {
    return (
      <div className="flex justify-center gap-2 my-6">
        {[1, 2, 3].map(i => (
          <Star
            key={i}
            size={64}
            className={i <= result.starsEarned ? 'text-yellow-400 animate-bounce' : 'text-gray-300'}
            fill={i <= result.starsEarned ? 'currentColor' : 'none'}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 md:p-12 max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          {result.passed ? (
            <>
              <div className="text-7xl mb-4">🎉</div>
              <h2 className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                Level Complete!
              </h2>
              <p className="text-xl text-gray-600">
                {modeName} - Level {result.level}
              </p>
            </>
          ) : (
            <>
              <div className="text-7xl mb-4">💪</div>
              <h2 className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">
                Keep Trying!
              </h2>
              <p className="text-xl text-gray-600">
                You'll get it next time!
              </p>
            </>
          )}
        </div>

        {/* Stars */}
        {renderStars()}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-purple-50 p-4 rounded-2xl text-center">
            <div className="text-3xl font-bold text-purple-600">
              {result.problemsCorrect}/{result.problemsAttempted}
            </div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl text-center">
            <div className="text-3xl font-bold text-blue-600">
              {Math.round(result.accuracy * 100)}%
            </div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
        </div>

        {/* New Badges */}
        {newBadges.length > 0 && (
          <div className="mb-8 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl">
            <h3 className="text-2xl font-bold text-center mb-4">
              🏆 New Badges Earned!
            </h3>
            <div className="flex justify-center gap-4">
              {newBadges.map(badge => (
                <div key={badge} className="text-center">
                  <div className="text-5xl mb-2">🏅</div>
                  <div className="text-sm font-semibold">{badge}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          {result.passed ? (
            <>
              <button
                onClick={onNext}
                className="py-4 px-8 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-2xl font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Next Level <ArrowRight size={28} />
              </button>
              <button
                onClick={onRetry}
                className="py-3 px-8 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xl font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={24} /> Try Again for 3 Stars
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onRetry}
                className="py-4 px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-2xl font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <RotateCcw size={28} /> Try Again
              </button>
            </>
          )}

          <button
            onClick={onExit}
            className="py-3 px-8 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 text-xl font-semibold rounded-2xl transition-all"
          >
            Back to Modes
          </button>
        </div>
      </div>
    </div>
  );
}
