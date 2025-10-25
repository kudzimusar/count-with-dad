import { useState, useEffect } from 'react';
import { AppState, CountingMode, Screen, VoiceSettings } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSound } from '@/hooks/useSound';
import { useSpeech } from '@/hooks/useSpeech';
import { createSticker, createConfetti } from '@/utils/animations';
import { Header } from '@/components/layout/Header';
import { MenuPanel } from '@/components/layout/MenuPanel';
import { ParentGate } from '@/components/modals/ParentGate';
import { CelebrationModal } from '@/components/modals/CelebrationModal';
import { LevelUnlockModal } from '@/components/modals/LevelUnlockModal';
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
  menuOpen: false,
  childName: 'NONO',
  childAge: 3,
  childAvatar: '👦',
  dailyGoal: 20,
  sessionHistory: [],
  voiceSettings: {
    rate: 0.9,
    pitch: 1.2,
    voiceType: 'default',
  },
  timeLimit: 0,
  unlockedPuzzleLevels: 1,
  unlockedMathLevels: 1,
  completedNumbers: [],
};

const Index = () => {
  const [state, setState] = useLocalStorage<AppState>('countingAppState', initialState);
  const [parentGateOpen, setParentGateOpen] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [levelUnlockOpen, setLevelUnlockOpen] = useState(false);
  const [unlockedLevel, setUnlockedLevel] = useState({ level: 1, type: 'puzzle' as 'puzzle' | 'math' });
  
  const { playSound } = useSound();
  const { speak } = useSpeech(state.voiceSettings);

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
        
        // Add to completed numbers
        setState(prev => ({ 
          ...prev, 
          completedNumbers: [...prev.completedNumbers, num]
        }));
        
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
        
        setState(prev => ({ 
          ...prev, 
          stars: prev.stars + 1,
          completedNumbers: [...prev.completedNumbers, num]
        }));
        
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

      <LevelUnlockModal
        isOpen={levelUnlockOpen}
        level={unlockedLevel.level}
        gameType={unlockedLevel.type}
        onClose={() => setLevelUnlockOpen(false)}
      />

      {state.currentScreen !== 'parent' && (
        <>
          <Header 
            stars={state.stars} 
            menuOpen={state.menuOpen}
            onMenuToggle={() => setState(prev => ({ ...prev, menuOpen: !prev.menuOpen }))}
          />
          
          {state.menuOpen && (
            <MenuPanel
              currentScreen={state.currentScreen}
              currentMode={state.countingMode}
              unlockedPuzzleLevels={state.unlockedPuzzleLevels}
              unlockedMathLevels={state.unlockedMathLevels}
              onScreenChange={handleScreenChange}
              onModeChange={handleModeChange}
            />
          )}
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
            completedNumbers={state.completedNumbers}
            onNumberClick={handleNumberClick}
          />
        </section>
      )}

      {state.currentScreen === 'puzzle' && (
        <PuzzleScreen
          level={state.puzzleLevel}
          soundEnabled={state.soundEnabled}
          voiceEnabled={state.voiceEnabled}
          maxLevel={state.unlockedPuzzleLevels}
          onLevelChange={(delta) => {
            const newLevel = Math.max(1, Math.min(state.unlockedPuzzleLevels, state.puzzleLevel + delta));
            setState(prev => ({ ...prev, puzzleLevel: newLevel }));
          }}
          onPuzzleSolved={() => {
            const newSolved = state.puzzlesSolved + 1;
            const shouldUnlock = newSolved % 3 === 0 && state.unlockedPuzzleLevels < 10;
            
            setState(prev => ({ 
              ...prev, 
              puzzlesSolved: newSolved,
              stars: prev.stars + 1,
              unlockedPuzzleLevels: shouldUnlock ? prev.unlockedPuzzleLevels + 1 : prev.unlockedPuzzleLevels
            }));

            if (shouldUnlock) {
              setUnlockedLevel({ level: state.unlockedPuzzleLevels + 1, type: 'puzzle' });
              setLevelUnlockOpen(true);
            }
          }}
        />
      )}

      {state.currentScreen === 'math' && (
        <MathScreen
          level={state.mathLevel}
          soundEnabled={state.soundEnabled}
          voiceEnabled={state.voiceEnabled}
          childName={state.childName}
          voiceSettings={state.voiceSettings}
          maxLevel={state.unlockedMathLevels}
          onLevelChange={(delta) => {
            const newLevel = Math.max(1, Math.min(state.unlockedMathLevels, state.mathLevel + delta));
            setState(prev => ({ ...prev, mathLevel: newLevel }));
          }}
          onMathSolved={() => {
            const newSolved = state.mathSolved + 1;
            const shouldUnlock = newSolved % 5 === 0 && state.unlockedMathLevels < 10;
            
            setState(prev => ({ 
              ...prev, 
              mathSolved: newSolved,
              stars: prev.stars + 1,
              unlockedMathLevels: shouldUnlock ? prev.unlockedMathLevels + 1 : prev.unlockedMathLevels
            }));

            if (shouldUnlock) {
              setUnlockedLevel({ level: state.unlockedMathLevels + 1, type: 'math' });
              setLevelUnlockOpen(true);
            }
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
          onUpdateChildProfile={(name, age, avatar) => 
            setState(prev => ({ ...prev, childName: name, childAge: age, childAvatar: avatar }))
          }
          onUpdateDailyGoal={(goal) => setState(prev => ({ ...prev, dailyGoal: goal }))}
          onUpdateVoiceSettings={(settings) => setState(prev => ({ ...prev, voiceSettings: settings }))}
          onUpdateTimeLimit={(limit) => setState(prev => ({ ...prev, timeLimit: limit }))}
        />
      )}
    </div>
  );
};

export default Index;
