import { useState, useEffect } from 'react';
import { useSound } from '@/hooks/useSound';
import { useSpeech } from '@/hooks/useSpeech';
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
  
  const { playSound } = useSound();
  const { speak } = useSpeech(voiceSettings);

  // Feature flag: Enable new math mode system
  const USE_NEW_MATH_SYSTEM = true;
  
  // Debug: Log when component renders
  useEffect(() => {
    console.log('MathScreen rendered:', { USE_NEW_MATH_SYSTEM, selectedMode, childAge });
  }, [selectedMode, childAge]);

  // Load user progress (would come from Supabase in production)
  useEffect(() => {
    // TODO: Load from Supabase user_math_progress table
    // For now, use local storage or empty object
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
    if (selected === answer) {
      // Correct
      if (soundEnabled) playSound('correct');
      onMathSolved();
      
      const message = childName 
        ? `Correct! ${a} + ${b} = ${answer}. Good job ${childName}!`
        : `Correct! ${a} + ${b} = ${answer}. Good job!`;
      setSuccessMessage(message);
      setSuccessOpen(true);

      if (voiceEnabled) {
        if (childName) {
          speak(`Correct! ${a} plus ${b} equals ${answer}. Good job ${childName}!`);
        } else {
          speak(`Correct! ${a} plus ${b} equals ${answer}. Good job!`);
        }
      }
    } else {
      // Wrong
      if (soundEnabled) playSound('wrong');
      if (voiceEnabled) speak('Oops! Try again!');
      
      // Visual feedback
      const buttons = document.querySelectorAll('.math-option');
      buttons.forEach((btn) => {
        if (btn.textContent === selected.toString()) {
          btn.classList.add('wrong-flash');
          setTimeout(() => {
            btn.classList.remove('wrong-flash');
          }, 1000);
        }
      });
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
    <section className="p-4">
      <SuccessModal
        isOpen={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          generateProblem();
        }}
        title="Correct!"
        message={successMessage}
        icon="🎉➕🌟"
        color="text-blue-600"
      />

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Math Challenge</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">Level: </span>
            <div className="flex gap-1">
              <button
                onClick={() => onLevelChange(-1)}
                disabled={level <= 1}
                className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg font-bold hover:bg-blue-200 disabled:opacity-50 transition-colors"
              >
                -
              </button>
              <span className="font-bold text-xl w-8 text-center">{level}</span>
              <button
                onClick={() => onLevelChange(1)}
                disabled={level >= maxLevel}
                className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg font-bold hover:bg-blue-200 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {level >= maxLevel ? <Lock className="h-4 w-4" /> : '+'}
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {maxLevel < 10 ? `Solve 5 more to unlock Level ${maxLevel + 1}!` : 'All levels unlocked!'}
          </div>
        </div>
        <p className="text-lg text-gray-600">Solve the addition problems!</p>
      </div>

      <div className="max-w-4xl mx-auto bg-blue-50 p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <div className="text-7xl font-bold mb-6 text-gray-800">
            {a} + {b} = ?
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="math-option bg-white hover:bg-yellow-100 py-6 rounded-xl text-3xl md:text-4xl font-bold shadow-lg hover:scale-105 transition-transform"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
