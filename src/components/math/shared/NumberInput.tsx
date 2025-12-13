import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface NumberInputProps {
  min?: number;
  max?: number;
  onSubmit: (answer: number | string) => void;
  correctAnswer?: number | string;
  showFeedback?: boolean;
  multipleChoice?: Array<number | string>;
}

export function NumberInput({
  min = 0,
  max = 100,
  onSubmit,
  correctAnswer,
  showFeedback = true,
  multipleChoice
}: NumberInputProps) {
  const [value, setValue] = useState<string>('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleNumberClick = (num: number) => {
    setValue(value + num);
  };

  const handleClear = () => {
    setValue('');
    setFeedback(null);
  };

  const handleSubmit = () => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;

    if (showFeedback && correctAnswer !== undefined) {
      setFeedback(numValue === correctAnswer ? 'correct' : 'wrong');
      setTimeout(() => {
        onSubmit(numValue);
        setValue('');
        setFeedback(null);
      }, 1500);
    } else {
      onSubmit(numValue);
      setValue('');
    }
  };

  const handleMultipleChoiceClick = (choice: number | string) => {
    if (showFeedback && correctAnswer !== undefined) {
      setFeedback(choice === correctAnswer ? 'correct' : 'wrong');
      setTimeout(() => {
        onSubmit(choice);
        setFeedback(null);
      }, 1500);
    } else {
      onSubmit(choice);
    }
  };

  // Multiple Choice Mode
  if (multipleChoice) {
    return (
      <div className="number-input-multiple-choice grid grid-cols-2 gap-4 max-w-md mx-auto">
        {multipleChoice.map((choice, idx) => (
          <button
            key={idx}
            onClick={() => handleMultipleChoiceClick(choice)}
            disabled={feedback !== null}
            className={`py-8 text-5xl font-bold rounded-3xl shadow-xl transition-all transform ${
              feedback === 'correct' && choice === correctAnswer
                ? 'bg-green-500 text-white scale-110'
                : feedback === 'wrong' && choice === correctAnswer
                ? 'bg-red-500 text-white animate-pulse'
                : feedback !== null
                ? 'opacity-50'
                : 'bg-white hover:bg-purple-50 hover:scale-105 active:scale-95'
            }`}
          >
            {choice}
            {feedback === 'correct' && choice === correctAnswer && (
              <Check className="inline ml-2" size={40} />
            )}
            {feedback === 'wrong' && choice !== correctAnswer && value === choice.toString() && (
              <X className="inline ml-2" size={40} />
            )}
          </button>
        ))}
      </div>
    );
  }

  // Numeric Keypad Mode
  return (
    <div className="number-input-keypad max-w-md mx-auto">
      {/* Display */}
      <div className={`mb-6 p-6 rounded-3xl text-center text-6xl font-bold transition-colors ${
        feedback === 'correct'
          ? 'bg-green-100 text-green-600'
          : feedback === 'wrong'
          ? 'bg-red-100 text-red-600 animate-pulse'
          : 'bg-purple-50 text-purple-900'
      }`}>
        {value || '_'}
        {feedback === 'correct' && <Check className="inline ml-4" size={48} />}
        {feedback === 'wrong' && <X className="inline ml-4" size={48} />}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            disabled={feedback !== null}
            className="py-6 text-4xl font-bold bg-white hover:bg-purple-50 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleClear}
          disabled={feedback !== null}
          className="py-6 text-2xl font-bold bg-gray-200 hover:bg-gray-300 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          Clear
        </button>
        <button
          onClick={() => handleNumberClick(0)}
          disabled={feedback !== null}
          className="py-6 text-4xl font-bold bg-white hover:bg-purple-50 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          0
        </button>
        <button
          onClick={handleSubmit}
          disabled={!value || feedback !== null}
          className="py-6 text-2xl font-bold bg-green-500 hover:bg-green-600 text-white rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          ✓ Submit
        </button>
      </div>
    </div>
  );
}
