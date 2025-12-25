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
  const [selectedChoice, setSelectedChoice] = useState<number | string | null>(null);

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
    setSelectedChoice(choice);
    if (showFeedback && correctAnswer !== undefined) {
      setFeedback(choice === correctAnswer ? 'correct' : 'wrong');
      setTimeout(() => {
        onSubmit(choice);
        setFeedback(null);
        setSelectedChoice(null);
      }, 1500);
    } else {
      onSubmit(choice);
    }
  };

  // Detect Yes/No comparison questions
  const isYesNoQuestion = multipleChoice?.length === 2 && 
    multipleChoice.every(c => 
      typeof c === 'string' && 
      ['yes', 'no'].includes(String(c).toLowerCase())
    );

  // Yes/No Comparison Mode - Large centered buttons
  if (multipleChoice && isYesNoQuestion) {
    return (
      <div className="answer-grid cols-2 max-w-sm mx-auto">
        {multipleChoice.map((choice, idx) => {
          const isYes = String(choice).toLowerCase() === 'yes';
          const isSelected = selectedChoice === choice;
          const isCorrect = feedback === 'correct' && choice === correctAnswer;
          const isWrong = feedback === 'wrong' && isSelected;
          
          return (
            <button
              key={idx}
              onClick={() => handleMultipleChoiceClick(choice)}
              disabled={feedback !== null}
              className={`btn-child flex items-center justify-center gap-2 py-5 text-2xl rounded-2xl shadow-lg transition-all ${
                isCorrect
                  ? 'bg-green-500 text-white scale-105'
                  : isWrong
                  ? 'bg-red-500 text-white animate-pulse'
                  : feedback !== null
                  ? 'opacity-50'
                  : isYes
                  ? 'btn-yes hover:scale-105 active:scale-95'
                  : 'btn-no hover:scale-105 active:scale-95'
              }`}
            >
              {isYes ? <Check size={28} strokeWidth={3} /> : <X size={28} strokeWidth={3} />}
              {choice}
            </button>
          );
        })}
      </div>
    );
  }

  // 4-Choice Mode - 2x2 grid with legacy yellow highlight styling
  if (multipleChoice && multipleChoice.length === 4) {
    return (
      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto px-2">
        {multipleChoice.map((choice, idx) => {
          const isSelected = selectedChoice === choice;
          const isCorrect = feedback === 'correct' && choice === correctAnswer;
          const isWrong = feedback === 'wrong' && isSelected;
          
          return (
            <button
              key={idx}
              onClick={() => handleMultipleChoiceClick(choice)}
              disabled={feedback !== null}
              className={`
                py-6 md:py-8 text-4xl md:text-5xl font-bold rounded-2xl shadow-lg 
                transition-all duration-200
                ${isCorrect
                  ? 'bg-yellow-300 scale-105'
                  : isWrong
                  ? 'bg-red-200 animate-shake'
                  : feedback !== null
                  ? 'opacity-50 bg-white'
                  : 'bg-white hover:bg-yellow-100 hover:scale-105 active:scale-95 text-gray-900'}
              `}
            >
              {choice}
            </button>
          );
        })}
      </div>
    );
  }

  // Multiple Choice Mode - Other sizes
  if (multipleChoice) {
    const cols = multipleChoice.length <= 2 ? 'cols-2' : 'cols-3';
    
    return (
      <div className={`answer-grid ${cols}`}>
        {multipleChoice.map((choice, idx) => {
          const isSelected = selectedChoice === choice;
          const isCorrect = feedback === 'correct' && choice === correctAnswer;
          const isWrong = feedback === 'wrong' && isSelected;
          
          return (
            <button
              key={idx}
              onClick={() => handleMultipleChoiceClick(choice)}
              disabled={feedback !== null}
              className={`btn-child py-4 text-xl md:text-2xl rounded-2xl shadow-lg transition-all ${
                isCorrect
                  ? 'bg-green-500 text-white scale-105'
                  : isWrong
                  ? 'bg-red-500 text-white animate-pulse'
                  : feedback !== null
                  ? 'opacity-50 bg-card'
                  : 'bg-card hover:bg-primary/10 hover:scale-105 active:scale-95 border-2 border-border'
              }`}
            >
              {choice}
              {isCorrect && <Check className="inline ml-2" size={20} />}
              {isWrong && <X className="inline ml-2" size={20} />}
            </button>
          );
        })}
      </div>
    );
  }

  // Numeric Keypad Mode - Compact
  return (
    <div className="max-w-xs mx-auto">
      {/* Display */}
      <div className={`mb-3 p-4 rounded-2xl text-center text-4xl font-bold transition-colors ${
        feedback === 'correct'
          ? 'bg-green-100 text-green-600'
          : feedback === 'wrong'
          ? 'bg-red-100 text-red-600 animate-pulse'
          : 'bg-card text-foreground border-2 border-border'
      }`}>
        {value || '_'}
        {feedback === 'correct' && <Check className="inline ml-3" size={32} />}
        {feedback === 'wrong' && <X className="inline ml-3" size={32} />}
      </div>

      {/* Keypad - Compact */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            disabled={feedback !== null}
            className="py-3 text-2xl font-bold bg-card hover:bg-primary/10 rounded-xl shadow transition-all hover:scale-105 active:scale-95 disabled:opacity-50 border border-border"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleClear}
          disabled={feedback !== null}
          className="py-3 text-lg font-bold bg-muted hover:bg-muted/80 rounded-xl shadow transition-all active:scale-95"
        >
          Clear
        </button>
        <button
          onClick={() => handleNumberClick(0)}
          disabled={feedback !== null}
          className="py-3 text-2xl font-bold bg-card hover:bg-primary/10 rounded-xl shadow transition-all hover:scale-105 active:scale-95 disabled:opacity-50 border border-border"
        >
          0
        </button>
        <button
          onClick={handleSubmit}
          disabled={!value || feedback !== null}
          className="py-3 text-lg font-bold bg-green-500 hover:bg-green-600 text-white rounded-xl shadow transition-all active:scale-95 disabled:opacity-50"
        >
          ✓
        </button>
      </div>
    </div>
  );
}
