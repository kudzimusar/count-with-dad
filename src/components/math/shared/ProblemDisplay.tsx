import { VisualObjects } from './VisualObjects';
import { Volume2 } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';
import { Problem } from '@/types/math';

interface ProblemDisplayProps {
  problem: Problem;
  showHint: boolean;
  onRequestHint?: () => void;
}

export function ProblemDisplay({ problem, showHint, onRequestHint }: ProblemDisplayProps) {
  const { speak } = useSpeech();

  const handleSpeakQuestion = () => {
    speak(problem.question);
  };

  return (
    <div className="problem-display bg-white rounded-3xl p-8 shadow-2xl max-w-3xl mx-auto">
      {/* Question Text */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 flex-1">
          {problem.question}
        </h2>
        <button
          onClick={handleSpeakQuestion}
          className="ml-4 p-3 bg-purple-100 hover:bg-purple-200 rounded-full transition-colors"
          aria-label="Read question aloud"
        >
          <Volume2 size={32} className="text-purple-600" />
        </button>
      </div>

      {/* Visual Aid */}
      {problem.visualAid && (
        <div className="mb-8">
          {problem.visualAid.type === 'objects' && (
            <VisualObjects {...problem.visualAid.data} />
          )}
        </div>
      )}

      {/* Hint Display */}
      {showHint && problem.hint && (
        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-2xl">
          <p className="text-lg text-yellow-800">
            💡 <strong>Hint:</strong> {problem.hint}
          </p>
        </div>
      )}

      {/* Hint Request Button */}
      {!showHint && onRequestHint && (
        <div className="text-center mb-6">
          <button
            onClick={onRequestHint}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-full transition-colors"
          >
            Need a hint? 💡
          </button>
        </div>
      )}
    </div>
  );
}
