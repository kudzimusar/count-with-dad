import { VisualObjects } from './VisualObjects';
import { ShapeDisplay } from './ShapeDisplay';
import { ClockDisplay } from './ClockDisplay';
import { ArrayDisplay } from './ArrayDisplay';
import { NumberLineDisplay } from './NumberLineDisplay';
import { MoneyDisplay } from './MoneyDisplay';
import { Volume2, Lightbulb } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';
import { Problem } from '@/types/math';

interface ProblemDisplayProps {
  problem: Problem;
  showHint: boolean;
  onRequestHint?: () => void;
  hideControls?: boolean;
}

export function ProblemDisplay({ problem, showHint, onRequestHint, hideControls = false }: ProblemDisplayProps) {
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
      case 'money':
        return (
          <MoneyDisplay
            coins={(data as any).coins}
            totalCents={(data as any).totalCents}
            showValues={(data as any).showValues}
          />
        );
      case 'blocks':
        return <VisualObjects {...(data as any)} />;
      default:
        return null;
    }
  };

  return (
    <div className="problem-display flex flex-col items-center text-center w-full max-w-lg mx-auto px-1">
      {/* Question - MASSIVE and DOMINANT - Responsive sizing */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-6">
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold text-foreground leading-tight break-words max-w-full">
          {problem.question}
        </h2>
        {/* Only show speaker button if NOT hiding controls */}
        {!hideControls && (
          <button
            onClick={handleSpeakQuestion}
            className="p-1.5 sm:p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors flex-shrink-0"
            aria-label="Read question aloud"
          >
            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </button>
        )}
      </div>

      {/* Visual Aid - Only show for non-basic-addition problems - Responsive container */}
      {problem.visualAid && problem.concept !== 'addition_basic' && (
        <div className="mb-2 sm:mb-4 flex justify-center w-full max-w-[90vw] sm:max-w-full overflow-x-auto">
          {renderVisualAid()}
        </div>
      )}

      {/* Hint Display - Compact */}
      {showHint && problem.hint && (
        <div className="mb-2 sm:mb-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-50 border-2 border-yellow-300 rounded-lg sm:rounded-xl inline-block max-w-full">
          <p className="text-xs sm:text-sm text-yellow-800">
            💡 {problem.hint}
          </p>
        </div>
      )}

      {/* Friendly Hint Button - Only show if NOT hiding controls */}
      {!hideControls && !showHint && onRequestHint && (
        <button
          onClick={onRequestHint}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-xs sm:text-sm font-medium transition-colors"
        >
          <Lightbulb className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          Let me help!
        </button>
      )}
    </div>
  );
}
