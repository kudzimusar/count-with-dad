import { useState, useEffect } from 'react';
import { useSound } from '@/hooks/useSound';
import { useSpeech } from '@/hooks/useSpeech';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { SuccessModal } from '@/components/modals/SuccessModal';
import { MathModeSelector } from './MathModeSelector';
import { MathGameContainer } from './MathGameContainer';
import { VoiceSettings } from '@/types';
import { Lock } from 'lucide-react';

interface MathScreenProps {
  level: number;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  childName: string;
  childAge: number;
  voiceSettings: VoiceSettings;
  maxLevel: number;
  userId?: string;
  onLevelChange: (delta: number) => void;
  onMathSolved: () => void;
}

export function MathScreen({ 
  level, 
  soundEnabled, 
  voiceEnabled,
  childName,
  childAge,
  voiceSettings,
  maxLevel,
  userId = 'guest',
  onLevelChange, 
  onMathSolved 
}: MathScreenProps) {
  // State for new math mode system
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState(level);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [userStars, setUserStars] = useState<Record<string, number>>({});
  // Legacy state for old math system (backward compatibility)
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [answer, setAnswer] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const { playSound } = useSound();
  const { speak } = useSpeech(voiceSettings);
  const { saveProgress, saveSession, trackEvent } = useSupabaseData(userId);

  // Feature flag: Enable new math mode system
  // Set to true to use the new modular math system with all modes
  const USE_NEW_MATH_SYSTEM = true;
  
  // Debug: Log when component renders
  useEffect(() => {
    console.log('MathScreen rendered:', { USE_NEW_MATH_SYSTEM, selectedMode, childAge });
  }, [selectedMode, childAge]);

  // Load user progress from localStorage (and sync with Supabase)
  useEffect(() => {
    const savedProgress = localStorage.getItem('mathProgress');
    if (savedProgress) {
      try {
        setUserProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error('Failed to parse math progress', e);
      }
    }
  }, []);

  // Legacy problem generation (kept for backward compatibility)
  useEffect(() => {
    if (!USE_NEW_MATH_SYSTEM || !selectedMode) {
      generateProblem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, selectedMode]);

  const generateProblem = () => {
    const levelConfig: Record<number, { maxNumber: number; maxSum: number }> = {
      1: { maxNumber: 5, maxSum: 10 },
      2: { maxNumber: 6, maxSum: 12 },
      3: { maxNumber: 7, maxSum: 14 },
      4: { maxNumber: 8, maxSum: 16 },
      5: { maxNumber: 9, maxSum: 18 },
      6: { maxNumber: 10, maxSum: 20 },
      7: { maxNumber: 12, maxSum: 24 },
      8: { maxNumber: 15, maxSum: 30 },
      9: { maxNumber: 18, maxSum: 36 },
      10: { maxNumber: 20, maxSum: 40 },
    };

    const config = levelConfig[level] || levelConfig[1];
    let newA, newB, newAnswer;

    do {
      newA = Math.floor(Math.random() * config.maxNumber) + 1;
      newB = Math.floor(Math.random() * config.maxNumber) + 1;
      newAnswer = newA + newB;
    } while (newAnswer > config.maxSum);

    setA(newA);
    setB(newB);
    setAnswer(newAnswer);

    // Generate options
    const newOptions = [newAnswer];
    while (newOptions.length < 4) {
      const randomOption = Math.floor(Math.random() * config.maxSum) + 1;
      if (!newOptions.includes(randomOption) && randomOption <= config.maxSum) {
        newOptions.push(randomOption);
      }
    }

    setOptions(newOptions.sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (selected: number) => {
    setSelectedAnswer(selected);
    
    if (selected === answer) {
      // Correct
      setIsCorrect(true);
      if (soundEnabled) playSound('correct');
      onMathSolved();
      
      const message = childName 
        ? `Correct! ${a} + ${b} = ${answer}. Good job ${childName}!`
        : `Correct! ${a} + ${b} = ${answer}. Good job!`;
      setSuccessMessage(message);
      
      // Save to backend
      saveProgress({ mathLevel: level });
      saveSession({
        date: new Date().toISOString().split('T')[0],
        duration: 0,
        screen: 'math',
        score: 1,
      });
      trackEvent('math_problem_solved', {
        level,
        problem: `${a} + ${b} = ${answer}`,
        correct: true,
      });
      
      // Show modal after brief delay to show the yellow highlight
      setTimeout(() => {
        setSuccessOpen(true);
      }, 300);

      if (voiceEnabled) {
        if (childName) {
          speak(`Correct! ${a} plus ${b} equals ${answer}. Good job ${childName}!`);
        } else {
          speak(`Correct! ${a} plus ${b} equals ${answer}. Good job!`);
        }
      }
    } else {
      // Wrong
      setIsCorrect(false);
      if (soundEnabled) playSound('wrong');
      if (voiceEnabled) speak('Oops! Try again!');
      
      // Track wrong answer
      trackEvent('math_problem_attempt', {
        level,
        problem: `${a} + ${b}`,
        userAnswer: selected,
        correctAnswer: answer,
        correct: false,
      });
      
      // Reset after feedback
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 800);
    }
  };

  // Handle mode selection from MathModeSelector
  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    // Set initial level for selected mode
    const modeProgress = userProgress[modeId] || 1;
    setCurrentLevel(modeProgress);
  };

  // Handle game completion from MathGameContainer
  const handleGameComplete = (result: {
    passed: boolean;
    stars: number;
    accuracy: number;
    timeSpent: number;
  }) => {
    if (result.passed) {
      // Update progress
      const newLevel = currentLevel + 1;
      setCurrentLevel(newLevel);
      setUserProgress(prev => ({
        ...prev,
        [selectedMode!]: newLevel
      }));
      
      // Save to localStorage (would save to Supabase in production)
      localStorage.setItem('mathProgress', JSON.stringify({
        ...userProgress,
        [selectedMode!]: newLevel
      }));

      // Update stars
      setUserStars(prev => ({
        ...prev,
        [selectedMode!]: (prev[selectedMode!] || 0) + result.stars
      }));

      // Trigger parent callback
      onMathSolved();
    }
  };

  // Show new math mode selector if no mode selected
  if (USE_NEW_MATH_SYSTEM && !selectedMode) {
    return (
      <section className="p-4">
        <MathModeSelector
          userAge={childAge || 5}
          userProgress={userProgress}
          userStars={userStars}
          onSelectMode={handleModeSelect}
        />
      </section>
    );
  }

  // Show new math game container if mode is selected (fullscreen)
  if (USE_NEW_MATH_SYSTEM && selectedMode) {
    return (
      <MathGameContainer
        modeId={selectedMode}
        level={currentLevel}
        userId={userId}
        childName={childName}
        voiceSettings={voiceSettings}
        soundEnabled={soundEnabled}
        voiceEnabled={voiceEnabled}
        onComplete={handleGameComplete}
        onExit={() => setSelectedMode(null)}
      />
    );
  }

  // Legacy math screen (backward compatibility)
  return (
    <section className="p-4 min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-100">
      <SuccessModal
        isOpen={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          setSelectedAnswer(null);
          setIsCorrect(null);
          generateProblem();
        }}
        title="Correct!"
        message={`Correct! ${a} + ${b} = ${answer}`}
        icon="🎉➕⭐"
        color="text-blue-600"
      />

      {/* Header Card */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-3xl shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Math Challenge</h2>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-lg font-medium">Level:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onLevelChange(-1)}
              disabled={level <= 1}
              className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg font-bold text-xl hover:bg-blue-200 disabled:opacity-50 transition-colors"
            >
              -
            </button>
            <span className="font-bold text-2xl w-8 text-center">{level}</span>
            <button
              onClick={() => onLevelChange(1)}
              disabled={level >= maxLevel}
              className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg font-bold text-xl hover:bg-blue-200 disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              {level >= maxLevel ? <Lock className="h-5 w-5" /> : '+'}
            </button>
          </div>
        </div>
        <p className="text-lg text-gray-600">Solve the addition problems!</p>
      </div>

      {/* Problem Card */}
      <div className="max-w-4xl mx-auto bg-blue-50 p-8 rounded-3xl shadow-lg">
        {/* Question */}
        <div className="text-center mb-8">
          <div className="text-7xl md:text-8xl font-bold text-gray-800">
            {a} + {b} = ?
          </div>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {options.map((option) => {
            const isSelected = selectedAnswer === option;
            const showCorrect = isSelected && isCorrect === true;
            const showWrong = isSelected && isCorrect === false;
            
            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null && isCorrect === true}
                className={`
                  py-8 rounded-2xl text-4xl md:text-5xl font-bold shadow-lg
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
      </div>
    </section>
  );
}
