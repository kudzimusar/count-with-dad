import { VisualObjects } from './VisualObjects';
import { ShapeDisplay } from './ShapeDisplay';
import { ClockDisplay } from './ClockDisplay';
import { ArrayDisplay } from './ArrayDisplay';
import { NumberLineDisplay } from './NumberLineDisplay';
import { Volume2, Lightbulb } from 'lucide-react';
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
        return <ShapeDisplay shape={(data as any).shape} color={(data as any).color} size={140} />;
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
    <div className="problem-display flex flex-col items-center text-center w-full max-w-lg mx-auto">
      {/* Question - DOMINANT */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl md:text-4xl font-bold text-foreground leading-tight">
          {problem.question}
        </h2>
        <button
          onClick={handleSpeakQuestion}
          className="p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors flex-shrink-0"
          aria-label="Read question aloud"
        >
          <Volume2 size={20} className="text-primary" />
        </button>
      </div>

      {/* Visual Aid - Centered */}
      {problem.visualAid && (
        <div className="mb-4 flex justify-center">
          {renderVisualAid()}
        </div>
      )}

      {/* Hint Display - Compact */}
      {showHint && problem.hint && (
        <div className="mb-3 px-4 py-2 bg-yellow-50 border-2 border-yellow-300 rounded-xl inline-block">
          <p className="text-sm text-yellow-800">
            💡 {problem.hint}
          </p>
        </div>
      )}

      {/* Friendly Hint Button */}
      {!showHint && onRequestHint && (
        <button
          onClick={onRequestHint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-sm font-medium transition-colors"
        >
          <Lightbulb size={18} />
          Let me help!
        </button>
      )}
    </div>
  );
}
