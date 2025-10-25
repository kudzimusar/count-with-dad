import { useState, useEffect } from 'react';
import { AppState, CountingMode, Screen } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSound } from '@/hooks/useSound';
import { useSpeech } from '@/hooks/useSpeech';
import { createSticker, createConfetti } from '@/utils/animations';
import { Header } from '@/components/layout/Header';
import { ModeSelector } from '@/components/layout/ModeSelector';
import { Navigation } from '@/components/layout/Navigation';
import { ParentGate } from '@/components/modals/ParentGate';
import { CelebrationModal } from '@/components/modals/CelebrationModal';
import { SuccessModal } from '@/components/modals/SuccessModal';
import { CountingGrid } from '@/components/counting/CountingGrid';
import { ProgressBar } from '@/components/counting/ProgressBar';
import { ChallengeDisplay } from '@/components/counting/ChallengeDisplay';
import { ParentDashboard } from '@/components/parent/ParentDashboard';
import { PuzzleScreen } from '@/components/puzzle/PuzzleScreen';
import { MathScreen } from '@/components/math/MathScreen';

const initialState: AppState = {
  currentScreen: 'counting',
  countingMode: 'order',
  currentNumber: 1,
  highestCount: 0,
  stars: 0,
  soundEnabled: true,
  voiceEnabled: true,
  puzzleLevel: 1,
  mathLevel: 1,
  challengeLevel: 1,
  puzzlesSolved: 0,
  mathSolved: 0,
  challengeNumber: null,
  parentCode: [1, 1, 1, 1],
  selectedPuzzleNumber: null,
  puzzleSequence: [],
  uiVisible: true,
};

const Index = () => {
  const [state, setState] = useLocalStorage<AppState>('countingAppState', initialState);
  const [parentGateOpen, setParentGateOpen] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  
  const { playSound } = useSound();
  const { speak } = useSpeech();

  // Generate challenge number
  const generateChallenge = () => {
    const levelMap: Record<number, number> = {
      1: 20, 2: 30, 3: 40, 4: 50, 5: 60, 6: 70, 7: 80, 8: 90, 9: 100, 10: 100
    };
    const maxNumber = levelMap[state.challengeLevel] || 20;
    const newChallenge = Math.floor(Math.random() * maxNumber) + 1;
    
    setState(prev => ({ ...prev, challengeNumber: newChallenge }));
    
    if (state.voiceEnabled) {
      speak(`Find the number ${newChallenge}`);
    }
  };

  // Initialize challenge on mode change
  useEffect(() => {
    if (state.countingMode === 'challenge' && !state.challengeNumber) {
      generateChallenge();
    }
  }, [state.countingMode]);

  const handleModeChange = (mode: CountingMode) => {
    setState(prev => ({ ...prev, countingMode: mode }));
    if (mode === 'challenge') {
      generateChallenge();
    }
  };

  const handleScreenChange = (screen: Screen) => {
    setState(prev => ({ ...prev, currentScreen: screen }));
  };

  const handleNumberClick = (num: number) => {
    if (state.countingMode === 'order') {
      if (num === state.currentNumber) {
        // Correct number
        if (state.soundEnabled) playSound('correct');
        if (state.voiceEnabled) speak(num.toString());
        
        createSticker(num);
        
        const newNumber = state.currentNumber + 1;
        const newHighest = newNumber > state.highestCount ? newNumber : state.highestCount;
        
        if (newNumber > 100) {
          setState(prev => ({ 
            ...prev, 
            currentNumber: 100,
            highestCount: 100,
            stars: prev.stars + 1
          }));
          setCelebrationOpen(true);
          if (state.soundEnabled) playSound('celebrate');
          if (state.voiceEnabled) speak('Congratulations! You counted to 100! Amazing job!');
          createConfetti();
        } else {
          setState(prev => ({ 
            ...prev, 
            currentNumber: newNumber,
            highestCount: newHighest
          }));
        }
      } else {
        // Wrong number
        if (state.soundEnabled) playSound('wrong');
        if (state.voiceEnabled) speak('Oops! Try the green number.');
        
        const numberEl = document.querySelectorAll('.number-bubble')[num - 1];
        if (numberEl) {
          numberEl.classList.add('wrong-flash');
          setTimeout(() => {
            numberEl.classList.remove('wrong-flash');
          }, 1000);
        }
      }
    } else if (state.countingMode === 'challenge') {
      if (num === state.challengeNumber) {
        // Correct
        if (state.soundEnabled) playSound('correct');
        if (state.voiceEnabled) speak(`Yes! That's ${num}! Great job!`);
        
        createSticker(num);
        
        setState(prev => ({ ...prev, stars: prev.stars + 1 }));
        
        setTimeout(() => {
          generateChallenge();
        }, 1500);
      } else {
        // Wrong
        if (state.soundEnabled) playSound('wrong');
        if (state.voiceEnabled) speak('Oops! Try again!');
        
        const numberEl = document.querySelectorAll('.number-bubble')[num - 1];
        if (numberEl) {
          numberEl.classList.add('wrong-flash');
          setTimeout(() => {
            numberEl.classList.remove('wrong-flash');
          }, 1000);
        }
      }
    } else {
      // Free play
      if (state.soundEnabled) playSound('correct');
      if (state.voiceEnabled) speak(num.toString());
      
      const numberEl = document.querySelectorAll('.number-bubble')[num - 1];
      if (numberEl) {
        numberEl.classList.add('correct-pulse');
        setTimeout(() => {
          numberEl.classList.remove('correct-pulse');
        }, 500);
      }
    }
  };

  const handleRestartCounting = () => {
    setState(prev => ({ ...prev, currentNumber: 1 }));
  };

  const handleParentSuccess = () => {
    setParentGateOpen(false);
    setState(prev => ({ ...prev, currentScreen: 'parent' }));
  };

  const handleResetProgress = () => {
    setState({
      ...initialState,
      soundEnabled: state.soundEnabled,
      voiceEnabled: state.voiceEnabled,
    });
  };

  const handleChallengeLevelChange = (delta: number) => {
    const newLevel = Math.max(1, Math.min(10, state.challengeLevel + delta));
    setState(prev => ({ ...prev, challengeLevel: newLevel }));
    generateChallenge();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
      <ParentGate
        isOpen={parentGateOpen}
        onClose={() => setParentGateOpen(false)}
        onSuccess={handleParentSuccess}
      />

      <CelebrationModal
        isOpen={celebrationOpen}
        onClose={() => setCelebrationOpen(false)}
      />

      {state.currentScreen !== 'parent' && (
        <>
          <Header stars={state.stars} onMenuClick={() => setParentGateOpen(true)} />
          {state.currentScreen === 'counting' && (
            <ModeSelector
              currentMode={state.countingMode}
              onModeChange={handleModeChange}
            />
          )}
          <Navigation
            currentScreen={state.currentScreen}
            onScreenChange={handleScreenChange}
          />
        </>
      )}

      {state.currentScreen === 'counting' && (
        <section className="p-4">
          {state.countingMode === 'challenge' && state.challengeNumber && (
            <ChallengeDisplay
              challengeNumber={state.challengeNumber}
              challengeLevel={state.challengeLevel}
              onLevelChange={handleChallengeLevelChange}
            />
          )}

          <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-600">
                {state.countingMode === 'order' && 'Count to 100!'}
                {state.countingMode === 'challenge' && 'Number Challenge!'}
                {state.countingMode === 'free' && 'Free Play!'}
              </h2>
              {state.countingMode === 'order' && (
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  <span className="text-2xl font-bold">{state.currentNumber}</span>
                </div>
              )}
            </div>
            
            {state.countingMode === 'order' && (
              <ProgressBar currentNumber={state.currentNumber} />
            )}
            
            <p className="text-lg text-center text-gray-600 mb-4">
              {state.countingMode === 'order' && 'Click the numbers in order from 1 to 100!'}
              {state.countingMode === 'challenge' && 'Find the number shown above!'}
              {state.countingMode === 'free' && 'Tap any number to hear it!'}
            </p>
            
            {state.currentNumber > 100 && state.countingMode === 'order' && (
              <button
                onClick={handleRestartCounting}
                className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors"
              >
                Start Again! 🔄
              </button>
            )}
          </div>

          <CountingGrid
            currentNumber={state.currentNumber}
            countingMode={state.countingMode}
            challengeNumber={state.challengeNumber}
            onNumberClick={handleNumberClick}
          />
        </section>
      )}

      {state.currentScreen === 'puzzle' && (
        <PuzzleScreen
          level={state.puzzleLevel}
          soundEnabled={state.soundEnabled}
          voiceEnabled={state.voiceEnabled}
          onLevelChange={(delta) => {
            const newLevel = Math.max(1, Math.min(10, state.puzzleLevel + delta));
            setState(prev => ({ ...prev, puzzleLevel: newLevel }));
          }}
          onPuzzleSolved={() => {
            setState(prev => ({ 
              ...prev, 
              puzzlesSolved: prev.puzzlesSolved + 1,
              stars: prev.stars + 1
            }));
          }}
        />
      )}

      {state.currentScreen === 'math' && (
        <MathScreen
          level={state.mathLevel}
          soundEnabled={state.soundEnabled}
          voiceEnabled={state.voiceEnabled}
          onLevelChange={(delta) => {
            const newLevel = Math.max(1, Math.min(10, state.mathLevel + delta));
            setState(prev => ({ ...prev, mathLevel: newLevel }));
          }}
          onMathSolved={() => {
            setState(prev => ({ 
              ...prev, 
              mathSolved: prev.mathSolved + 1,
              stars: prev.stars + 1
            }));
          }}
        />
      )}

      {state.currentScreen === 'parent' && (
        <ParentDashboard
          state={state}
          onSoundToggle={(enabled) => setState(prev => ({ ...prev, soundEnabled: enabled }))}
          onVoiceToggle={(enabled) => setState(prev => ({ ...prev, voiceEnabled: enabled }))}
          onResetProgress={handleResetProgress}
          onClose={() => setState(prev => ({ ...prev, currentScreen: 'counting' }))}
        />
      )}
    </div>
  );
};

export default Index;
