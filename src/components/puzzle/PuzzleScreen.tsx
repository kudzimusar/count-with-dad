import { useState, useEffect } from 'react';
import { COLORS } from '@/utils/constants';
import { useSound } from '@/hooks/useSound';
import { useSpeech } from '@/hooks/useSpeech';
import { SuccessModal } from '@/components/modals/SuccessModal';
import { createConfetti } from '@/utils/animations';
import { Lock } from 'lucide-react';

interface PuzzleScreenProps {
  level: number;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  childName: string;
  maxLevel: number;
  onLevelChange: (delta: number) => void;
  onPuzzleSolved: () => void;
}

export function PuzzleScreen({ 
  level, 
  soundEnabled, 
  voiceEnabled,
  childName,
  maxLevel,
  onLevelChange, 
  onPuzzleSolved 
}: PuzzleScreenProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [shuffled, setShuffled] = useState<number[]>([]);
  const [slots, setSlots] = useState<(number | null)[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  
  const { playSound } = useSound();
  const { speak } = useSpeech();

  useEffect(() => {
    initPuzzle();
  }, [level]);

  const initPuzzle = () => {
    const levelConfig: Record<number, { start: number; count: number }> = {
      1: { start: 1, count: 5 },
      2: { start: 6, count: 5 },
      3: { start: 11, count: 6 },
      4: { start: 17, count: 6 },
      5: { start: 23, count: 7 },
      6: { start: 30, count: 7 },
      7: { start: 37, count: 8 },
      8: { start: 45, count: 8 },
      9: { start: 53, count: 9 },
      10: { start: 62, count: 10 },
    };

    const config = levelConfig[level] || levelConfig[1];
    const newSequence = Array.from({ length: config.count }, (_, i) => config.start + i);
    const newShuffled = [...newSequence].sort(() => Math.random() - 0.5);
    
    setSequence(newSequence);
    setShuffled(newShuffled);
    setSlots(Array(newSequence.length).fill(null));
    setSelectedNumber(null);
  };

  const handleNumberClick = (num: number) => {
    const availableNumbers = shuffled.filter(n => !slots.includes(n));
    if (!availableNumbers.includes(num)) return;

    setSelectedNumber(num);
    if (voiceEnabled) {
      speak(`Now tap where ${num} goes`);
    }
  };

  const handleSlotClick = (index: number) => {
    if (selectedNumber === null) return;
    if (slots[index] !== null) return;

    const expectedNumber = sequence[index];

    if (selectedNumber === expectedNumber) {
      // Correct placement
      const newSlots = [...slots];
      newSlots[index] = selectedNumber;
      setSlots(newSlots);
      setSelectedNumber(null);

      if (soundEnabled) playSound('correct');

      // Check if puzzle is complete
      if (newSlots.every(slot => slot !== null)) {
        onPuzzleSolved();
        if (soundEnabled) playSound('celebrate');
        if (voiceEnabled) speak(`Amazing ${childName}! You solved the puzzle!`);
        setSuccessOpen(true);
        createConfetti();
      }
    } else {
      // Wrong placement
      if (soundEnabled) playSound('wrong');
      if (voiceEnabled) speak('Oops! Try a different spot.');
      
      const slotEl = document.querySelectorAll('.puzzle-slot')[index];
      if (slotEl) {
        slotEl.classList.add('wrong-flash');
        setTimeout(() => {
          slotEl.classList.remove('wrong-flash');
        }, 1000);
      }
    }
  };

  const successMessage = `You put the numbers in order: ${sequence.join(', ')}!`;

  return (
    <section className="p-4">
      <SuccessModal
        isOpen={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          initPuzzle();
        }}
        title="Great Job!"
        message={successMessage}
        icon="🎉🧩🌟"
        color="text-green-600"
      />

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-purple-600 mb-4">Number Puzzles</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">Level: </span>
            <div className="flex gap-1">
              <button
                onClick={() => onLevelChange(-1)}
                disabled={level <= 1}
                className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg font-bold hover:bg-purple-200 disabled:opacity-50 transition-colors"
              >
                -
              </button>
              <span className="font-bold text-xl w-8 text-center">{level}</span>
              <button
                onClick={() => onLevelChange(1)}
                disabled={level >= maxLevel}
                className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg font-bold hover:bg-purple-200 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {level >= maxLevel ? <Lock className="h-4 w-4" /> : '+'}
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {maxLevel < 10 ? `Solve 3 more to unlock Level ${maxLevel + 1}!` : 'All levels unlocked!'}
          </div>
        </div>
        <p className="text-lg text-gray-600">Tap a number below, then tap where it goes!</p>
      </div>

      <div className="max-w-4xl mx-auto bg-purple-50 p-6 rounded-2xl shadow-lg">
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {slots.map((slot, index) => (
            <div
              key={index}
              onClick={() => handleSlotClick(index)}
              className={`puzzle-slot w-16 h-16 md:w-20 md:h-20 border-2 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold cursor-pointer transition-all ${
                slot !== null
                  ? 'border-solid border-green-500 bg-green-100'
                  : selectedNumber === sequence[index]
                  ? 'highlight'
                  : 'border-dashed border-purple-400 bg-white'
              }`}
              style={slot !== null ? { backgroundColor: COLORS[Math.floor((slot - 1) / 10) % COLORS.length] } : {}}
            >
              {slot}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {shuffled.map((num) => {
            const isUsed = slots.includes(num);
            if (isUsed) return null;

            return (
              <div
                key={num}
                onClick={() => handleNumberClick(num)}
                className={`puzzle-number w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-95 ${
                  selectedNumber === num ? 'ring-4 ring-yellow-400 scale-110' : ''
                }`}
              >
                {num}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
