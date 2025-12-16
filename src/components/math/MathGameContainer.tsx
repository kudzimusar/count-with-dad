import { useState, useEffect, useMemo } from 'react';
import { generateProblems } from '@/utils/mathProblems';
import { ProblemDisplay } from './shared/ProblemDisplay';
import { NumberInput } from './shared/NumberInput';
import { LevelCompleteModal } from '../modals/LevelCompleteModal';
import { useSound } from '@/hooks/useSound';
import { useSpeech } from '@/hooks/useSpeech';
import { VoiceSettings } from '@/types';
import { Problem } from '@/types/math';

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

    if (correct) {
      setScore(score + 1);
      if (soundEnabled) playSound('correct');
      if (voiceEnabled) {
        const message = childName
          ? `Correct! Great job, ${childName}!`
          : 'Correct! Great job!';
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
      // Level complete
      const accuracy = score / problems.length;
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
    <div className="math-game-container p-4">
      {/* Progress */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">
          Problem {currentProblemIndex + 1} of {problems.length}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg font-semibold"
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          <button
            onClick={onExit}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Problem Display */}
      <ProblemDisplay
        problem={currentProblem}
        showHint={showHint}
        onRequestHint={() => setShowHint(true)}
      />

      {/* Answer Input */}
      <div className="mt-8">
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
    </div>
  );
}

function calculateStars(accuracy: number): 0 | 1 | 2 | 3 {
  if (accuracy >= 1.0) return 3;
  if (accuracy >= 0.9) return 2;
  if (accuracy >= 0.8) return 1;
  return 0;
}

// Import MATH_MODES from mathLevels
import { MATH_MODES } from '@/utils/mathLevels';
