import { useState, useEffect } from 'react';
import { generateProblems } from '@/utils/mathProblems';
import { ProblemDisplay } from './shared/ProblemDisplay';
import { NumberInput } from './shared/NumberInput';
import { LevelCompleteModal } from '../modals/LevelCompleteModal';
import { SuccessModal } from '../modals/SuccessModal';
import { GameModeWrapper } from '../game/GameModeWrapper';
import { useSound } from '@/hooks/useSound';
import { useSpeech } from '@/hooks/useSpeech';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { VoiceSettings } from '@/types';
import { Problem } from '@/types/math';
import { MATH_MODES } from '@/utils/mathLevels';
import { Lock } from 'lucide-react';

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(level);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const { playSound } = useSound();
  const { speak } = useSpeech(voiceSettings);
  const { saveProgress, saveSession, trackEvent } = useSupabaseData(userId);

  const mode = MATH_MODES.find(m => m.id === modeId);
  const maxLevel = mode?.totalLevels || 20;

  // Generate problems for this level
  useEffect(() => {
    const generated = generateProblems(modeId, currentLevel, 10);
    setProblems(generated);
    setCurrentProblemIndex(0);
    setScore(0);
    setStartTime(Date.now());
    setTimeSpent(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [modeId, currentLevel]);

  // Auto-speak the question when a new problem appears
  useEffect(() => {
    if (currentProblem && voiceEnabled) {
      const spokenQuestion = currentProblem.question
        .replace(/\+/g, 'plus')
        .replace(/-/g, 'minus')
        .replace(/×/g, 'times')
        .replace(/÷/g, 'divided by')
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

  const handleLevelChange = (delta: number) => {
    const newLevel = currentLevel + delta;
    if (newLevel >= 1 && newLevel <= maxLevel) {
      setCurrentLevel(newLevel);
    }
  };

  const handleAnswer = (userAnswer: number | string) => {
    if (!currentProblem) return;

    setSelectedAnswer(userAnswer);
    const correct = userAnswer === currentProblem.answer;
    const isLastProblem = currentProblemIndex === problems.length - 1;
    
    // Track new score for accurate calculation
    const newScore = correct ? score + 1 : score;

    if (correct) {
      setIsCorrect(true);
      setScore(newScore);
      if (soundEnabled) playSound('correct');
      
      // Build personalized success message
      const equation = currentProblem.question.replace('?', String(currentProblem.answer));
      const message = childName
        ? `Correct! ${equation}. Good job ${childName}!`
        : `Correct! ${equation}. Good job!`;
      setSuccessMessage(message);
      
      // Voice feedback with personalized praise
      if (voiceEnabled) {
        const spokenEquation = equation
          .replace(/\+/g, 'plus')
          .replace(/-/g, 'minus')
          .replace(/×/g, 'times')
          .replace(/÷/g, 'divided by')
          .replace(/=/g, 'equals');
        const voiceMessage = childName
          ? `${spokenEquation}, Good job ${childName}!`
          : `${spokenEquation}, Good job!`;
        speak(voiceMessage);
      }

      // Save to backend
      saveProgress({ mathLevel: currentLevel });
      saveSession({
        date: new Date().toISOString().split('T')[0],
        duration: 0,
        screen: 'math',
        score: 1,
      });
      trackEvent('math_problem_solved', {
        mode: modeId,
        level: currentLevel,
        problem: currentProblem.question,
        answer: currentProblem.answer,
        correct: true,
      });

      // Show success modal after brief delay to show yellow highlight
      setTimeout(() => {
        setShowSuccessModal(true);
      }, 300);
    } else {
      setIsCorrect(false);
      if (soundEnabled) playSound('wrong');
      if (voiceEnabled) {
        const message = childName
          ? `Oops! Try again, ${childName}!`
          : 'Oops! Try again!';
        speak(message);
      }

      // Track wrong answer
      trackEvent('math_problem_attempt', {
        mode: modeId,
        level: currentLevel,
        problem: currentProblem.question,
        userAnswer,
        correctAnswer: currentProblem.answer,
        correct: false,
      });

      // Reset after feedback
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 800);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSelectedAnswer(null);
    setIsCorrect(null);

    const isLastProblem = currentProblemIndex === problems.length - 1;
    
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
      setCurrentProblemIndex(currentProblemIndex + 1);
      setShowHint(false);
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
    const generated = generateProblems(modeId, currentLevel, 10);
    setProblems(generated);
    setCurrentProblemIndex(0);
    setScore(0);
    setStartTime(Date.now());
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  if (!currentProblem) return null;

  return (
    <GameModeWrapper
      onExit={onExit}
      totalProblems={problems.length}
      currentProblem={currentProblemIndex}
    >
      {/* Success Modal - Legacy style celebration */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Correct!"
        message={successMessage}
        icon="🎉➕⭐"
        color="text-blue-600"
      />

      {/* Header Card - Legacy style level selector */}
      <div className="px-4 pt-4 pb-2">
        <div className="max-w-4xl mx-auto bg-white p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-blue-600">
              {mode?.displayName || 'Math Challenge'}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Level:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLevelChange(-1)}
                  disabled={currentLevel <= 1}
                  className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-200 disabled:opacity-50 transition-colors"
                >
                  -
                </button>
                <span className="font-bold text-xl w-6 text-center">{currentLevel}</span>
                <button
                  onClick={() => handleLevelChange(1)}
                  disabled={currentLevel >= maxLevel}
                  className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-200 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  {currentLevel >= maxLevel ? <Lock className="h-4 w-4" /> : '+'}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-300"
                style={{ width: `${((currentProblemIndex) / problems.length) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">
              {currentProblemIndex + 1}/{problems.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main content - Question and Visual (Legacy design) */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 overflow-hidden">
        <div className="max-w-4xl w-full bg-blue-50 p-6 md:p-8 rounded-3xl shadow-lg">
          <ProblemDisplay
            problem={currentProblem}
            showHint={showHint}
            onRequestHint={() => setShowHint(true)}
            hideControls={currentProblem.concept === 'addition_basic'}
          />
        </div>
      </div>

      {/* Answer area - Legacy styled buttons */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2">
        <div className="max-w-2xl mx-auto">
          {currentProblem.choices ? (
            <div className="grid grid-cols-2 gap-4">
              {currentProblem.choices.map((option) => {
                const isSelected = selectedAnswer === option;
                const showCorrect = isSelected && isCorrect === true;
                const showWrong = isSelected && isCorrect === false;
                
                return (
                  <button
                    key={String(option)}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null && isCorrect === true}
                    className={`
                      py-6 md:py-8 rounded-2xl text-4xl md:text-5xl font-bold shadow-lg
                      transition-all duration-200
                      ${showCorrect 
                        ? 'bg-yellow-300 scale-105' 
                        : showWrong 
                          ? 'bg-red-200 animate-shake' 
                          : 'bg-white hover:bg-yellow-100 hover:scale-105'}
                      ${selectedAnswer !== null && isCorrect === true && !isSelected ? 'opacity-50' : ''}
                    `}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          ) : (
            <NumberInput
              min={0}
              max={100}
              onSubmit={handleAnswer}
              correctAnswer={currentProblem.answer}
              showFeedback={true}
            />
          )}
        </div>
      </div>

      {/* Level Complete Modal */}
      {showCompleteModal && (
        <LevelCompleteModal
          result={{
            level: currentLevel,
            problemsAttempted: problems.length,
            problemsCorrect: score,
            accuracy: score / problems.length,
            timeSpent,
            starsEarned: calculateStars(score / problems.length),
            passed: score / problems.length >= 0.8,
            averageTimePerProblem: timeSpent / problems.length
          }}
          modeName={mode?.displayName || modeId}
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
