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
    <div className="problem-display bg-card rounded-3xl p-8 shadow-2xl max-w-3xl mx-auto">
      {/* Question Text */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground flex-1">
          {problem.question}
        </h2>
        <button
          onClick={handleSpeakQuestion}
          className="ml-4 p-3 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors"
          aria-label="Read question aloud"
        >
          <Volume2 size={32} className="text-primary" />
        </button>
      </div>

      {/* Visual Aid */}
      {problem.visualAid && (
        <div className="mb-8">
          {renderVisualAid()}
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
