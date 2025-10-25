import { useState, useRef, KeyboardEvent } from 'react';
import { PARENT_CODE } from '@/utils/constants';

interface ParentGateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ParentGate({ isOpen, onClose, onSuccess }: ParentGateProps) {
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  if (!isOpen) return null;

  const handleInput = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = () => {
    const enteredCode = code.map(d => parseInt(d) || 0);
    const isCorrect = enteredCode.every((digit, index) => digit === PARENT_CODE[index]);

    if (isCorrect) {
      onSuccess();
      setCode(['', '', '', '']);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[1000] flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Parent Access</h2>
        <p className="text-gray-600 mb-6 text-center">Enter the code to access parent settings</p>
        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="number"
              value={code[index]}
              onChange={(e) => handleInput(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 border-2 border-purple-300 rounded-lg text-center text-xl font-bold"
              maxLength={1}
              min="0"
              max="9"
            />
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors"
        >
          Submit
        </button>
        {error && (
          <p className="text-red-500 text-center mt-4">Incorrect code. Try again.</p>
        )}
      </div>
    </div>
  );
}
