import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState, CountingMode, Screen, VoiceSettings, FeedbackData } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSound } from '@/hooks/useSound';
import { useSpeech } from '@/hooks/useSpeech';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { createSticker, createConfetti } from '@/utils/animations';
import { Header } from '@/components/layout/Header';
import { MenuPanel } from '@/components/layout/MenuPanel';
import { ParentGate } from '@/components/modals/ParentGate';
import { CelebrationModal } from '@/components/modals/CelebrationModal';
import { LevelUnlockModal } from '@/components/modals/LevelUnlockModal';
import { CountingGrid } from '@/components/counting/CountingGrid';
import { ProgressBar } from '@/components/counting/ProgressBar';
import { ChallengeDisplay } from '@/components/counting/ChallengeDisplay';
import { ScrollIndicator } from '@/components/counting/ScrollIndicator';
import { ParentDashboard } from '@/components/parent/ParentDashboard';
import { PuzzleScreen } from '@/components/puzzle/PuzzleScreen';
import { MathScreen } from '@/components/math/MathScreen';
import { RegistrationModal } from '@/components/onboarding/RegistrationModal';
import { FeedbackModal } from '@/components/feedback/FeedbackModal';
import { PremiumGate } from '@/components/modals/PremiumGate';
import { MockPaymentModal } from '@/components/modals/MockPaymentModal';
import { toast } from 'sonner';

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
  correctAnswersCount: 0,
  feedbackHistory: [],
  hasCompletedOnboarding: false,
  subscriptionStatus: 'free',
};

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useSupabaseAuth();
  const [rawState, setRawState] = useLocalStorage<AppState>('countingAppState', initialState);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Merge saved state with initial state to handle missing properties from updates
  const state: AppState = {
    ...initialState,
    ...rawState,
    voiceSettings: {
      ...initialState.voiceSettings,
      ...(rawState.voiceSettings || {}),
    },
    sessionHistory: rawState.sessionHistory || [],
    completedNumbers: rawState.completedNumbers || [],
    correctAnswersCount: Number(rawState.correctAnswersCount) || 0,
    // Ensure numeric values are valid
    puzzleLevel: Number(rawState.puzzleLevel) || 1,
    mathLevel: Number(rawState.mathLevel) || 1,
    challengeLevel: Number(rawState.challengeLevel) || 1,
    unlockedPuzzleLevels: Number(rawState.unlockedPuzzleLevels) || 1,
    unlockedMathLevels: Number(rawState.unlockedMathLevels) || 1,
    currentNumber: Number(rawState.currentNumber) || 1,
    childAge: Number(rawState.childAge) || 3,
    dailyGoal: Number(rawState.dailyGoal) || 20,
    timeLimit: Number(rawState.timeLimit) || 0,
  };
  
  const setState = (value: AppState | ((prev: AppState) => AppState)) => {
    const newState = typeof value === 'function' ? value(state) : value;
    setRawState(newState);
  };

  // Supabase data hooks
  const {
    saveProfile,
    saveProgress,
    saveFeedback,
    trackEvent: trackSupabaseEvent,
    loadProfile,
    loadProgress,
    updateSubscription,
    loadSubscription,
  } = useSupabaseData(user?.id);

  // Load data from Supabase when user logs in (optional, only if logged in)
  useEffect(() => {
    if (user && !dataLoaded) {
      const loadData = async () => {
        const [profileResult, progressResult] = await Promise.all([
          loadProfile(),
          loadProgress(),
        ]);

        if (profileResult.data) {
          setState(prev => ({
            ...prev,
            childName: profileResult.data.child_name,
            childAge: profileResult.data.child_age,
            childAvatar: profileResult.data.child_avatar,
            childGender: profileResult.data.child_gender as any,
            parentEmail: profileResult.data.parent_email || undefined,
            parentRelationship: profileResult.data.parent_relationship || undefined,
            registeredAt: profileResult.data.registered_at || undefined,
            hasCompletedOnboarding: true,
          }));
        }

        if (progressResult.data) {
          setState(prev => ({
            ...prev,
            highestCount: progressResult.data.highest_count,
            stars: progressResult.data.stars,
            puzzleLevel: progressResult.data.puzzle_level,
            mathLevel: progressResult.data.math_level,
            challengeLevel: progressResult.data.challenge_level,
            puzzlesSolved: progressResult.data.puzzles_solved,
            mathSolved: progressResult.data.math_solved,
            unlockedPuzzleLevels: progressResult.data.unlocked_puzzle_levels,
            unlockedMathLevels: progressResult.data.unlocked_math_levels,
            completedNumbers: progressResult.data.completed_numbers,
            correctAnswersCount: progressResult.data.correct_answers_count,
            subscriptionStatus: progressResult.data.subscription_status || 'free',
            trialStartedAt: progressResult.data.subscription_started_at || undefined,
          }));
        }

        // Load subscription data separately
        const subscriptionResult = await loadSubscription();
        if (subscriptionResult.data) {
          // Check if subscription expired
          const now = new Date();
          const expiresAt = subscriptionResult.data.subscription_expires_at 
            ? new Date(subscriptionResult.data.subscription_expires_at) 
            : null;
          
          if (expiresAt && expiresAt < now && subscriptionResult.data.subscription_status !== 'free') {
            // Subscription expired, downgrade to free
            await updateSubscription('free');
            setState(prev => ({
              ...prev,
              subscriptionStatus: 'free',
              trialStartedAt: undefined,
            }));
          }
        }

        setDataLoaded(true);
      };

      loadData();
    }
  }, [user, dataLoaded]);

  // Auto-save progress to Supabase
  useEffect(() => {
    if (user && dataLoaded) {
      const saveTimer = setTimeout(() => {
        saveProgress(state);
      }, 2000); // Debounce saves

      return () => clearTimeout(saveTimer);
    }
  }, [user, dataLoaded, state.highestCount, state.stars, state.puzzleLevel, state.mathLevel, state.challengeLevel, state.puzzlesSolved, state.mathSolved, state.completedNumbers, state.correctAnswersCount]);
  
  const [parentGateOpen, setParentGateOpen] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [levelUnlockOpen, setLevelUnlockOpen] = useState(false);
  const [unlockedLevel, setUnlockedLevel] = useState({ level: 1, type: 'puzzle' as 'puzzle' | 'math' });
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [premiumGateOpen, setPremiumGateOpen] = useState(false);
  const [premiumFeature, setPremiumFeature] = useState('');
  const [mockPaymentModalOpen, setMockPaymentModalOpen] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [maxVisibleNumber, setMaxVisibleNumber] = useState(
    state.childAge <= 4 ? 20 : 100
  );
  
  const { playSound } = useSound();
  const { speak } = useSpeech(state.voiceSettings);
  const { trackEvent } = useAnalytics();

  // Track session start
  useEffect(() => {
    trackEvent('session_start', {
      screen: state.currentScreen,
      childAge: state.childAge,
    });
  }, []);

  // Scroll detection for indicator
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update max visible numbers based on child age
  useEffect(() => {
    setMaxVisibleNumber(state.childAge <= 4 ? 20 : 100);
  }, [state.childAge]);

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

  // Don't auto-generate challenge - let user start when ready

  const handleModeChange = (mode: CountingMode) => {
    setState(prev => ({ ...prev, countingMode: mode, challengeNumber: null }));
  };

  const handleScreenChange = (screen: Screen) => {
    setState(prev => ({ ...prev, currentScreen: screen }));
  };

  const handleNumberClick = (num: number) => {
    // Add haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    if (state.countingMode === 'order') {
      if (num === state.currentNumber) {
        // Correct number
        if (state.soundEnabled) playSound('correct');
        if (state.voiceEnabled) {
          // Every 10 numbers, give extra encouragement with name
          if (num % 10 === 0) {
            speak(`${num}! Great job ${state.childName}!`);
          } else {
            speak(num.toString());
          }
        }
        
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
          if (state.voiceEnabled) speak(`Congratulations ${state.childName}! You counted to 100! Amazing job!`);
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
        if (state.voiceEnabled) speak(`Yes! That's ${num}! Great job ${state.childName}!`);
        
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
    setState(prev => ({ 
      ...prev, 
      currentNumber: 1,
      completedNumbers: [] // Clear all checkmarks to start fresh
    }));
    if (state.voiceEnabled) speak(`Let's count again ${state.childName}! Starting from 1!`);
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
    const currentLevel = Number(state.challengeLevel) || 1;
    const newLevel = Math.max(1, Math.min(10, currentLevel + delta));
    setState(prev => ({ ...prev, challengeLevel: newLevel }));
    
    // Generate challenge with the new level
    const levelMap: Record<number, number> = {
      1: 20, 2: 30, 3: 40, 4: 50, 5: 60, 6: 70, 7: 80, 8: 90, 9: 100, 10: 100
    };
    const maxNumber = levelMap[newLevel] || 20;
    const newChallenge = Math.floor(Math.random() * maxNumber) + 1;
    
    setTimeout(() => {
      setState(prev => ({ ...prev, challengeNumber: newChallenge }));
      if (state.voiceEnabled) {
        speak(`Level ${newLevel}. Find the number ${newChallenge}`);
      }
    }, 0);
  };

  const handleRegistrationComplete = async (data: {
    childName: string;
    childAge: number;
    childAvatar: string;
    childGender?: string;
    parentEmail?: string;
    parentRelationship?: string;
  }) => {
    setState(prev => ({
      ...prev,
      childName: data.childName,
      childAge: data.childAge,
      childAvatar: data.childAvatar,
      childGender: data.childGender as any,
      parentEmail: data.parentEmail,
      parentRelationship: data.parentRelationship,
      hasCompletedOnboarding: true,
      registeredAt: new Date().toISOString(),
    }));

    // Optional: Save to cloud if authenticated
    if (user) {
      await saveProfile(data);
      await trackSupabaseEvent('registration_complete', {
        childAge: data.childAge,
        hasParentEmail: !!data.parentEmail,
      });
    }

    trackEvent('registration_complete', {
      childAge: data.childAge,
      hasParentEmail: !!data.parentEmail,
    });
  };

  const handleFeedbackSubmit = async (feedback: FeedbackData) => {
    setState(prev => ({
      ...prev,
      feedbackHistory: [...prev.feedbackHistory, feedback],
    }));

    // Optional: Save to cloud if authenticated
    if (user) {
      await saveFeedback(feedback);
      await trackSupabaseEvent('feedback_submitted', {
        type: feedback.type,
      });
    }

    trackEvent('feedback_submitted', {
      type: feedback.type,
    });
  };

  const handlePremiumFeatureClick = (feature: string) => {
    setPremiumFeature(feature);
    setPremiumGateOpen(true);
  };

  const handleUpgradeSubscription = () => {
    // Close premium gate if open
    setPremiumGateOpen(false);
    
    // Check if user is authenticated
    if (!user) {
      setState(prev => ({ ...prev, currentScreen: 'parent' }));
      return;
    }
    
    // Open mock payment modal
    setMockPaymentModalOpen(true);
  };

  const handleMockPaymentSuccess = async () => {
    setMockPaymentModalOpen(false);
    
    // Calculate expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    // Update local state
    setState(prev => ({
      ...prev,
      subscriptionStatus: 'premium',
      trialStartedAt: new Date().toISOString(),
    }));
    
    // Save to Supabase
    if (user) {
      await updateSubscription('premium', expiresAt.toISOString());
      await trackSupabaseEvent('subscription_upgraded', {
        type: 'mock',
        expiresAt: expiresAt.toISOString(),
      });
    }
    
    // Show success toast
    trackEvent('subscription_upgraded', { type: 'mock' });
    
    // Create confetti
    createConfetti();
  };

  const handleDowngradeSubscription = async () => {
    if (!user) return;
    
    // Update local state
    setState(prev => ({
      ...prev,
      subscriptionStatus: 'free',
      trialStartedAt: undefined,
    }));
    
    // Save to Supabase
    await updateSubscription('free');
    await trackSupabaseEvent('subscription_downgraded', { reason: 'testing' });
    
    trackEvent('subscription_downgraded', { reason: 'testing' });
  };


  // No longer block app while checking auth - let kids play immediately!
  // Auth is now optional for cloud sync only

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 overflow-y-auto pb-20">
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
            onParentZoneClick={() => setParentGateOpen(true)}
          />
          
          {state.menuOpen && (
            <MenuPanel
              currentScreen={state.currentScreen}
              currentMode={state.countingMode}
              unlockedPuzzleLevels={state.unlockedPuzzleLevels}
              unlockedMathLevels={state.unlockedMathLevels}
              correctAnswersCount={state.correctAnswersCount}
              subscriptionStatus={state.subscriptionStatus}
              onScreenChange={handleScreenChange}
              onModeChange={handleModeChange}
              onAskParent={() => setParentGateOpen(true)}
              onPremiumFeatureClick={handlePremiumFeatureClick}
            />
          )}
        </>
      )}

      {state.currentScreen === 'counting' && (
        <section className="p-4">
          {state.countingMode === 'challenge' && !state.challengeNumber && (
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-100 to-purple-100 p-8 rounded-2xl shadow-lg mb-6 text-center">
              <h2 className="text-3xl font-bold text-purple-600 mb-4">Number Challenge Mode!</h2>
              <p className="text-lg text-gray-700 mb-6">
                Click the button below to start. We'll show you a number and you find it on the grid!
              </p>
              <button
                onClick={generateChallenge}
                className="bg-purple-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-purple-700 transition-colors shadow-lg"
              >
                Start Challenge! 🎯
              </button>
              <div className="mt-4">
                <span className="text-lg">Challenge Level: </span>
                <div className="flex gap-1 justify-center items-center mt-2">
                  <button
                    onClick={() => handleChallengeLevelChange(-1)}
                    disabled={state.challengeLevel <= 1}
                    className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg font-bold hover:bg-blue-200 disabled:opacity-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-bold text-xl w-8 text-center">{state.challengeLevel}</span>
                  <button
                    onClick={() => handleChallengeLevelChange(1)}
                    disabled={state.challengeLevel >= 10}
                    className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg font-bold hover:bg-blue-200 disabled:opacity-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {state.countingMode === 'challenge' && state.challengeNumber && (
            <ChallengeDisplay
              challengeNumber={state.challengeNumber}
              challengeLevel={state.challengeLevel}
              onLevelChange={handleChallengeLevelChange}
            />
          )}

          <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm pb-2 mb-4">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
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
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg mb-6">
            
            <p className="text-lg text-center text-gray-600 mb-4">
              {state.countingMode === 'order' && 'Click the numbers in order from 1 to 100!'}
              {state.countingMode === 'challenge' && 'Find the number shown above!'}
              {state.countingMode === 'free' && 'Tap any number to hear it!'}
            </p>
            
            {state.currentNumber >= 100 && state.countingMode === 'order' && (
              <button
                onClick={handleRestartCounting}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-bold text-xl hover:from-green-600 hover:to-blue-600 transition-all shadow-lg transform hover:scale-105"
              >
                🎉 Start Again from 1! 🔄
              </button>
            )}
          </div>

          <CountingGrid
            currentNumber={state.currentNumber}
            countingMode={state.countingMode}
            challengeNumber={state.challengeNumber}
            completedNumbers={state.completedNumbers}
            onNumberClick={handleNumberClick}
            maxVisibleNumber={maxVisibleNumber}
          />

          {maxVisibleNumber < 100 && state.currentNumber >= maxVisibleNumber - 5 && (
            <div className="max-w-4xl mx-auto mt-6 text-center">
              <button
                onClick={() => setMaxVisibleNumber(100)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg animate-bounce"
              >
                🎉 Unlock All Numbers! 🎉
              </button>
            </div>
          )}

          <ScrollIndicator 
            visible={showScrollIndicator && state.currentNumber <= 20 && maxVisibleNumber > 10} 
          />
        </section>
      )}

      {state.currentScreen === 'puzzle' && (
        <PuzzleScreen
          level={state.puzzleLevel}
          soundEnabled={state.soundEnabled}
          voiceEnabled={state.voiceEnabled}
          childName={state.childName}
          maxLevel={state.unlockedPuzzleLevels}
          onLevelChange={(delta) => {
            const currentLevel = Number(state.puzzleLevel) || 1;
            const maxLevel = Number(state.unlockedPuzzleLevels) || 1;
            const newLevel = Math.max(1, Math.min(maxLevel, currentLevel + delta));
            setState(prev => ({ ...prev, puzzleLevel: newLevel }));
          }}
          onPuzzleSolved={() => {
            const newCount = (state.puzzlesSolved || 0) + 1;
            const correctCount = (state.correctAnswersCount || 0) + 1;
            setState(prev => ({ 
              ...prev, 
              puzzlesSolved: newCount,
              correctAnswersCount: correctCount,
            }));

            // Unlock next level every 10 correct answers
            if (correctCount % 10 === 0 && state.unlockedPuzzleLevels < 10) {
              const newMaxLevel = Math.min(10, state.unlockedPuzzleLevels + 1);
              setState(prev => ({ ...prev, unlockedPuzzleLevels: newMaxLevel }));
              setUnlockedLevel({ level: newMaxLevel, type: 'puzzle' });
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
            const currentLevel = Number(state.mathLevel) || 1;
            const maxLevel = Number(state.unlockedMathLevels) || 1;
            const newLevel = Math.max(1, Math.min(maxLevel, currentLevel + delta));
            setState(prev => ({ ...prev, mathLevel: newLevel }));
          }}
          onMathSolved={() => {
            const correctCount = (state.correctAnswersCount || 0) + 1;
            setState(prev => ({ 
              ...prev, 
              mathSolved: prev.mathSolved + 1,
              stars: prev.stars + 1,
              correctAnswersCount: correctCount,
            }));

            // Unlock next level every 10 correct answers
            if (correctCount % 10 === 0 && state.unlockedMathLevels < 10) {
              const newMaxLevel = Math.min(10, state.unlockedMathLevels + 1);
              setState(prev => ({ ...prev, unlockedMathLevels: newMaxLevel }));
              setUnlockedLevel({ level: newMaxLevel, type: 'math' });
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
          onOpenFeedback={() => setFeedbackModalOpen(true)}
          onUpgradeSubscription={handleUpgradeSubscription}
          onDowngradeSubscription={handleDowngradeSubscription}
        />
      )}

      {/* Optional: RegistrationModal can be triggered from Parent Dashboard */}
      {/* For now, profile editing is done directly in ProfileTab */}

      <PremiumGate
        isOpen={premiumGateOpen}
        onClose={() => setPremiumGateOpen(false)}
        onUpgrade={handleUpgradeSubscription}
        feature={premiumFeature}
      />

      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />

      <MockPaymentModal
        isOpen={mockPaymentModalOpen}
        onClose={() => setMockPaymentModalOpen(false)}
        onSuccess={handleMockPaymentSuccess}
      />
    </div>
  );
};

export default Index;
