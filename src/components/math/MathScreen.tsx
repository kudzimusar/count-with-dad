import { useState, useEffect } from 'react';
import { useSound } from '@/hooks/useSound';
import { useSpeech } from '@/hooks/useSpeech';
import { SuccessModal } from '@/components/modals/SuccessModal';

interface MathScreenProps {
  level: number;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  onLevelChange: (delta: number) => void;
  onMathSolved: () => void;
}

export function MathScreen({ 
  level, 
  soundEnabled, 
  voiceEnabled,
  onLevelChange, 
  onMathSolved 
}: MathScreenProps) {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [answer, setAnswer] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { playSound } = useSound();
  const { speak } = useSpeech();

  useEffect(() => {
    generateProblem();
  }, [level]);

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
      
      const message = `Correct! ${a} + ${b} = ${answer}`;
      setSuccessMessage(message);
      setSuccessOpen(true);

      if (voiceEnabled) {
        speak(`Correct! ${a} plus ${b} equals ${answer}`);
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
                disabled={level >= 10}
                className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg font-bold hover:bg-blue-200 disabled:opacity-50 transition-colors"
              >
                +
              </button>
            </div>
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
