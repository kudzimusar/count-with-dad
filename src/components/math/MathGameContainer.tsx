import { useState, useEffect } from 'react';
import { generateProblems } from '@/utils/mathProblems';
import { ProblemDisplay } from './shared/ProblemDisplay';
import { NumberInput } from './shared/NumberInput';
import { LevelCompleteModal } from '../modals/LevelCompleteModal';
import { GameModeWrapper } from '../game/GameModeWrapper';
import { useSound } from '@/hooks/useSound';
import { useSpeech } from '@/hooks/useSpeech';
import { VoiceSettings } from '@/types';
import { Problem } from '@/types/math';
import { MATH_MODES } from '@/utils/mathLevels';

interface MathGameContainerProps {
  modeId: string;
  level: number;
  userId: string;
  childName?: string;
  voiceSettings: VoiceSettings;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  onComplete: (result: {
    passed: boolean;
    stars: number;
    accuracy: number;
    timeSpent: number;
  }) => void;
  onExit: () => void;
}

export function MathGameContainer({
  modeId,
  level,
  userId,
  childName,
  voiceSettings,
  soundEnabled,
  voiceEnabled,
  onComplete,
  onExit
}: MathGameContainerProps) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);

  const { playSound } = useSound();
  const { speak } = useSpeech(voiceSettings);

  // Generate problems for this level
  useEffect(() => {
    const generated = generateProblems(modeId, level, 10);
    setProblems(generated);
    setCurrentProblemIndex(0);
    setScore(0);
    setStartTime(Date.now());
    setTimeSpent(0);
  }, [modeId, level]);

  // Auto-speak the question when a new problem appears
  useEffect(() => {
    if (currentProblem && voiceEnabled) {
      const spokenQuestion = currentProblem.question
        .replace(/\+/g, 'plus')
        .replace(/-/g, 'minus')
        .replace(/×/g, 'times')
        .replace(/=/g, 'equals')
        .replace(/\?/g, 'what?');
      
      setTimeout(() => {
        speak(spokenQuestion);
      }, 300);
    }
  }, [currentProblemIndex, voiceEnabled]);

  // Track time spent
  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startTime]);

  const currentProblem = problems[currentProblemIndex];

  const handleAnswer = (userAnswer: number | string) => {
    if (!currentProblem) return;

    const correct = userAnswer === currentProblem.answer;
    const isLastProblem = currentProblemIndex === problems.length - 1;
    
    // Track new score for accurate calculation
    const newScore = correct ? score + 1 : score;

    if (correct) {
      setScore(newScore);
      if (soundEnabled) playSound('correct');
      if (voiceEnabled) {
        // Speak the full equation with answer and personalized praise
        const equation = currentProblem.question.replace('?', String(currentProblem.answer));
        const spokenEquation = equation
          .replace(/\+/g, 'plus')
          .replace(/-/g, 'minus')
          .replace(/×/g, 'times')
          .replace(/=/g, 'equals');
        const message = childName
          ? `${spokenEquation}, Good job ${childName}!`
          : `${spokenEquation}, Good job!`;
        speak(message);
      }
    } else {
      if (soundEnabled) playSound('wrong');
      if (voiceEnabled) {
        const message = childName
          ? `Oops! Try again, ${childName}!`
          : 'Oops! Try again!';
        speak(message);
      }
    }

    if (isLastProblem) {
      // Level complete - use newScore for accurate calculation
      const accuracy = newScore / problems.length;
      const stars = calculateStars(accuracy);
      const passed = accuracy >= 0.8;

      setShowCompleteModal(true);
      setStartTime(null);

      if (passed && voiceEnabled) {
        const message = childName
          ? `Amazing, ${childName}! Level complete! You got ${stars} stars!`
          : `Level complete! You got ${stars} stars!`;
        speak(message);
      }
    } else {
      // Move to next problem
      setTimeout(() => {
        setCurrentProblemIndex(currentProblemIndex + 1);
        setShowHint(false);
      }, 1000);
    }
  };

  const handleComplete = () => {
    const accuracy = score / problems.length;
    const stars = calculateStars(accuracy);
    const passed = accuracy >= 0.8;

    onComplete({
      passed,
      stars,
      accuracy,
      timeSpent
    });

    setShowCompleteModal(false);
  };

  const handleRetry = () => {
    setShowCompleteModal(false);
    const generated = generateProblems(modeId, level, 10);
    setProblems(generated);
    setCurrentProblemIndex(0);
    setScore(0);
    setStartTime(Date.now());
  };

  if (!currentProblem) return null;

  return (
    <GameModeWrapper
      onExit={onExit}
      totalProblems={problems.length}
      currentProblem={currentProblemIndex}
    >
      {/* Main content - Question and Visual */}
      <div className="flex-1 flex flex-col justify-center items-center px-2 overflow-hidden">
        <ProblemDisplay
          problem={currentProblem}
          showHint={showHint}
          onRequestHint={() => setShowHint(true)}
          hideControls={currentProblem.concept === 'addition_basic'}
        />
      </div>

      {/* Answer area - Always visible at bottom */}
      <div className="flex-shrink-0 px-2 pb-4 pt-2">
        <NumberInput
          min={0}
          max={100}
          onSubmit={handleAnswer}
          correctAnswer={currentProblem.answer}
          showFeedback={true}
          multipleChoice={currentProblem.choices}
        />
      </div>

      {/* Level Complete Modal */}
      {showCompleteModal && (
        <LevelCompleteModal
          result={{
            level,
            problemsAttempted: problems.length,
            problemsCorrect: score,
            accuracy: score / problems.length,
            timeSpent,
            starsEarned: calculateStars(score / problems.length),
            passed: score / problems.length >= 0.8,
            averageTimePerProblem: timeSpent / problems.length
          }}
          modeName={MATH_MODES.find(m => m.id === modeId)?.displayName || modeId}
          onNext={handleComplete}
          onRetry={handleRetry}
          onExit={onExit}
        />
      )}
    </GameModeWrapper>
  );
}

function calculateStars(accuracy: number): 0 | 1 | 2 | 3 {
  if (accuracy >= 1.0) return 3;
  if (accuracy >= 0.9) return 2;
  if (accuracy >= 0.8) return 1;
  return 0;
}
