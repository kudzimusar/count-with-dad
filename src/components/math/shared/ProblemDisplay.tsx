import { VisualObjects } from './VisualObjects';
import { ShapeDisplay } from './ShapeDisplay';
import { ClockDisplay } from './ClockDisplay';
import { ArrayDisplay } from './ArrayDisplay';
import { NumberLineDisplay } from './NumberLineDisplay';
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

  const renderVisualAid = () => {
    if (!problem.visualAid) return null;

    const { type, data } = problem.visualAid;

    switch (type) {
      case 'objects':
        return <VisualObjects {...(data as any)} />;
      case 'shape':
        return <ShapeDisplay shape={(data as any).shape} color={(data as any).color} />;
      case 'clock':
        return <ClockDisplay hour={(data as any).hour} minute={(data as any).minute} />;
      case 'array':
        return <ArrayDisplay rows={(data as any).rows} columns={(data as any).columns} showGrouping={(data as any).showGrouping} />;
      case 'number_line':
        return (
          <NumberLineDisplay
            min={(data as any).min}
            max={(data as any).max}
            markedPositions={(data as any).markedPositions}
            jumps={(data as any).jumps}
          />
        );
      case 'blocks':
        return <VisualObjects {...(data as any)} />;
      default:
        return null;
    }
  };

  return (
    <div className="problem-display bg-card rounded-2xl p-4 md:p-6 shadow-xl max-w-2xl mx-auto">
      {/* Question Text */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl md:text-4xl font-bold text-foreground flex-1">
          {problem.question}
        </h2>
        <button
          onClick={handleSpeakQuestion}
          className="ml-3 p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors"
          aria-label="Read question aloud"
        >
          <Volume2 size={24} className="text-primary" />
        </button>
      </div>

      {/* Visual Aid - Compact */}
      {problem.visualAid && (
        <div className="mb-3">
          {renderVisualAid()}
        </div>
      )}

      {/* Hint Display - Compact */}
      {showHint && problem.hint && (
        <div className="mb-3 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
          <p className="text-sm md:text-base text-yellow-800">
            💡 <strong>Hint:</strong> {problem.hint}
          </p>
        </div>
      )}

      {/* Hint Request Button - Smaller */}
      {!showHint && onRequestHint && (
        <div className="text-center">
          <button
            onClick={onRequestHint}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-bold rounded-full transition-colors"
          >
            Need a hint? 💡
          </button>
        </div>
      )}
    </div>
  );
}
