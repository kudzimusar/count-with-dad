import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState, CountingMode, Screen, VoiceSettings, FeedbackData, SessionRecord } from '@/types';
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
import { VerificationErrorModal } from '@/components/auth/VerificationErrorModal';
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
  childName: '',
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
  const { user, loading: authLoading, authEvent } = useSupabaseAuth();
  const [rawState, setRawState] = useLocalStorage<AppState>('countingAppState', initialState);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false); // Track if profile check is complete
  
  // Track the last user ID to detect user changes
  const [lastUserId, setLastUserId] = useLocalStorage<string | null>('lastUserId', null);

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
    loadSessionHistory,
    saveSession,
    updateSubscription,
    loadSubscription,
  } = useSupabaseData(user?.id);

  // Clear data on sign-out or user change
  useEffect(() => {
    // Skip if auth is still loading
    if (authLoading) return;

    const currentUserId = user?.id || null;
    
    // Scenario 1: User explicitly signed out (SIGNED_OUT event takes priority)
    if (authEvent === 'SIGNED_OUT') {
      console.log('Clearing data: User signed out');
      localStorage.removeItem('countingAppState');
      localStorage.removeItem('lastUserId');
      setRawState(initialState);
      setDataLoaded(false);
      setProfileLoaded(false); // Reset profile check
      setLastUserId(null);
      toast.info('Signed out. All data cleared.');
      return;
    }
    
    // Scenario 2: Different authenticated user signed in
    if (user && lastUserId !== null && lastUserId !== user.id && lastUserId !== 'guest') {
      console.log('Clearing data: Different user signed in');
      localStorage.removeItem('countingAppState');
      setRawState(initialState);
      setDataLoaded(false);
      setProfileLoaded(false); // Reset profile check
      setLastUserId(user.id);
      toast.info('Switched accounts. Loading your data...');
      return;
    }
    
    // Scenario 3: User signed in (first time or returning same user)
    if (user && lastUserId !== user.id) {
      // If switching from guest to user, clear guest data
      if (lastUserId === 'guest') {
        console.log('Clearing data: Switching from guest to user');
        localStorage.removeItem('countingAppState');
        setRawState(initialState);
        setDataLoaded(false);
        setProfileLoaded(false); // Reset profile check
        toast.info('Account connected. Starting fresh with cloud sync.');
      }
      setLastUserId(user.id);
      return;
    }
    
    // Scenario 4: User became null (signed out but no SIGNED_OUT event caught)
    if (!user && lastUserId !== null && lastUserId !== 'guest') {
      console.log('Clearing data: User became null');
      localStorage.removeItem('countingAppState');
      localStorage.removeItem('lastUserId');
      setRawState(initialState);
      setDataLoaded(false);
      setProfileLoaded(false); // Reset profile check
      setLastUserId(null);
      return;
    }
    
    // Scenario 5: Guest mode - switching from user to guest
    if (!user && lastUserId !== 'guest' && lastUserId !== null) {
      console.log('Clearing data: Switching from user to guest');
      localStorage.removeItem('countingAppState');
      setRawState(initialState);
      setDataLoaded(false);
      setProfileLoaded(false); // Reset profile check
      setLastUserId('guest');
      return;
    }
    
    // Scenario 6: First time guest (initialize guest mode)
    if (!user && lastUserId === null) {
      setLastUserId('guest');
    }
  }, [user, authEvent, lastUserId, setRawState, authLoading, setLastUserId]);

  // Load data from Supabase when user logs in (optional, only if logged in)
  useEffect(() => {
    if (user && !dataLoaded) {
      const loadData = async () => {
        try {
          const [profileResult, progressResult, sessionResult] = await Promise.all([
            loadProfile(),
            loadProgress(),
            loadSessionHistory(),
          ]);

          // Log errors for debugging
          if (profileResult.error) {
            console.error('Profile load error:', profileResult.error);
          } else if (!profileResult.data) {
            console.log('No profile found for user');
          }
          
          if (progressResult.error) {
            console.error('Progress load error:', progressResult.error);
          }

          if (profileResult.data) {
            setState(prev => ({
              ...prev,
              childName: profileResult.data.child_name,
              childAge: profileResult.data.child_age,
              childAvatar: profileResult.data.child_avatar,
              childGender: profileResult.data.child_gender as 'boy' | 'girl' | 'other' | 'prefer-not-to-say' | undefined,
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
              dailyGoal: progressResult.data.daily_goal ?? prev.dailyGoal,
              subscriptionStatus: progressResult.data.subscription_status || 'free',
              trialStartedAt: progressResult.data.subscription_started_at || undefined,
            }));
          }

          if (sessionResult.data) {
            const sessions = sessionResult.data.map(s => ({
              date: s.date,
              duration: s.duration,
              screen: s.screen as Screen,
              mode: s.mode as CountingMode | undefined,
              score: s.score,
            }));
            setState(prev => ({
              ...prev,
              sessionHistory: sessions,
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

          // Mark profile as checked (whether it exists or not)
          setProfileLoaded(true);
          setDataLoaded(true);
        } catch (error) {
          console.error('Data loading error:', error);
          // Even on error, mark as loaded to prevent infinite waiting
          setProfileLoaded(true);
          setDataLoaded(true);
        }
      };

      loadData();
    }
    // For guests (no user), mark as loaded so app doesn't wait
    else if (!user && !dataLoaded) {
      setProfileLoaded(true);
      setDataLoaded(true);
    }
    
    // Reset profileLoaded when user changes
    if (!user) {
      setProfileLoaded(false);
    }
  }, [user, dataLoaded, loadProfile, loadProgress, loadSessionHistory, loadSubscription, updateSubscription]);

  // Auto-save progress to Supabase
  useEffect(() => {
    if (user && dataLoaded) {
      const saveTimer = setTimeout(() => {
        saveProgress(state);
      }, 2000); // Debounce saves

      return () => clearTimeout(saveTimer);
    }
  }, [user, dataLoaded, state.highestCount, state.stars, state.puzzleLevel, state.mathLevel, state.challengeLevel, state.puzzlesSolved, state.mathSolved, state.completedNumbers, state.correctAnswersCount, state.dailyGoal]);
  
  const [parentGateOpen, setParentGateOpen] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [levelUnlockOpen, setLevelUnlockOpen] = useState(false);
  const [unlockedLevel, setUnlockedLevel] = useState({ level: 1, type: 'puzzle' as 'puzzle' | 'math' });
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [premiumGateOpen, setPremiumGateOpen] = useState(false);
  const [premiumFeature, setPremiumFeature] = useState('');
  const [mockPaymentModalOpen, setMockPaymentModalOpen] = useState(false);
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [verificationErrorModalOpen, setVerificationErrorModalOpen] = useState(false);
  const [verificationError, setVerificationError] = useState<{ code?: string; email?: string } | null>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  
  // Use age-based config for counting modes
  const getMaxVisibleNumber = (age: number, mode: string) => {
    // Import dynamically to avoid circular dependencies
    const countingConfigs: Record<string, Record<number, number>> = {
      'order': { 3: 20, 4: 30, 5: 50, 6: 70, 7: 100, 8: 100 },
      'challenge': { 3: 10, 4: 20, 5: 30, 6: 50, 7: 70, 8: 100 },
      'free': { 3: 20, 4: 30, 5: 50, 6: 70, 7: 100, 8: 100 }
    };
    const modeConfig = countingConfigs[mode] || countingConfigs['order'];
    const clampedAge = Math.max(3, Math.min(8, age));
    return modeConfig[clampedAge] || 20;
  };
  
  const [maxVisibleNumber, setMaxVisibleNumber] = useState(
    getMaxVisibleNumber(state.childAge, state.countingMode)
  );
  
  const { playSound } = useSound();
  const { speak } = useSpeech(state.voiceSettings);
  const { trackEvent } = useAnalytics();

  // Session tracking state
  const [sessionStartTime] = useState<number>(Date.now());
  const [currentSessionScreen, setCurrentSessionScreen] = useState<Screen>(state.currentScreen);

  // Show registration modal only if:
  // 1. Profile check is complete (to avoid race condition)
  // 2. Data is loaded
  // 3. User hasn't completed onboarding (no profile exists)
  // 4. For signed-in users: only show if profile doesn't exist in database
  // 5. For guest users: show if no local profile exists
  useEffect(() => {
    // Wait for profile to be checked (prevents race condition)
    if (!profileLoaded || !dataLoaded || authLoading) {
      return;
    }

    // If user is signed in and has a profile (childName exists), don't show modal
    if (user && state.childName && state.hasCompletedOnboarding) {
      setRegistrationModalOpen(false);
      return;
    }

    // If user is signed in but no profile exists yet, show modal (don't allow close)
    if (user && !state.childName) {
      setRegistrationModalOpen(true);
      return;
    }

    // For guest users (not signed in), show modal if no profile exists (allow close)
    if (!user && !state.hasCompletedOnboarding) {
      setRegistrationModalOpen(true);
      return;
    }

    // If profile exists, ensure modal is closed
    if (state.hasCompletedOnboarding) {
      setRegistrationModalOpen(false);
    }
  }, [user, state.hasCompletedOnboarding, state.childName, profileLoaded, dataLoaded, authLoading]);

  // Check for OTP expiration errors in URL hash/query params
  useEffect(() => {
    // Check URL hash for error codes (Supabase redirects with hash fragments)
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);
    
    // Check for error in hash (format: #error=description&error_code=otp_expired)
    if (hash.includes('error') || searchParams.has('error')) {
      const errorCode = hash.match(/error_code=([^&]+)/)?.[1] || 
                       searchParams.get('error_code') ||
                       hash.match(/error=([^&]+)/)?.[1] ||
                       searchParams.get('error');
      
      if (errorCode === 'otp_expired' || errorCode?.includes('expired') || errorCode?.includes('invalid')) {
        // Extract email if available from hash or try to get from localStorage
        const emailMatch = hash.match(/email=([^&]+)/)?.[1];
        const email = emailMatch ? decodeURIComponent(emailMatch) : undefined;
        
        setVerificationError({
          code: errorCode,
          email: email
        });
        setVerificationErrorModalOpen(true);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Track session start
  useEffect(() => {
    trackEvent('session_start', {
      screen: state.currentScreen,
      childAge: state.childAge,
    });
  }, []);

  // Save session when screen changes or app closes
  useEffect(() => {
    const saveCurrentSession = async () => {
      const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
      
      // Only save sessions longer than 30 seconds and if progress was made
      if (duration > 30) {
        const sessionRecord: SessionRecord = {
          date: new Date().toISOString(),
          duration,
          screen: currentSessionScreen,
          mode: state.countingMode || undefined,
          score: state.correctAnswersCount || 0,
        };
        
        // Save to local state (localStorage)
        setState(prev => ({
          ...prev,
          sessionHistory: [...prev.sessionHistory, sessionRecord]
        }));
        
        // Save to database if logged in
        if (user) {
          const result = await saveSession(sessionRecord);
          if (result.error) {
            console.error('Failed to save session:', result.error);
          }
        }
      }
    };

    // Save on screen change
    if (currentSessionScreen !== state.currentScreen) {
      saveCurrentSession();
      setCurrentSessionScreen(state.currentScreen);
    }

    // Save on page unload
    const handleBeforeUnload = () => {
      saveCurrentSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Final save on cleanup
      saveCurrentSession();
    };
  }, [state.currentScreen, state.countingMode, state.correctAnswersCount, user, currentSessionScreen, sessionStartTime, saveSession]);

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
            if (state.childName) {
              speak(`${num}! Great job ${state.childName}!`);
            } else {
              speak(`${num}! Great job!`);
            }
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
          if (state.voiceEnabled) {
            if (state.childName) {
              speak(`Congratulations ${state.childName}! You counted to 100! Amazing job!`);
            } else {
              speak(`Congratulations! You counted to 100! Amazing job!`);
            }
          }
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
        if (state.voiceEnabled) {
          if (state.childName) {
            speak(`Yes! That's ${num}! Great job ${state.childName}!`);
          } else {
            speak(`Yes! That's ${num}! Great job!`);
          }
        }
        
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
    if (state.voiceEnabled) {
      if (state.childName) {
        speak(`Let's count again ${state.childName}! Starting from 1!`);
      } else {
        speak(`Let's count again! Starting from 1!`);
      }
    }
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
      childGender: data.childGender as 'boy' | 'girl' | 'other' | 'prefer-not-to-say' | undefined,
      parentEmail: data.parentEmail,
      parentRelationship: data.parentRelationship,
      hasCompletedOnboarding: true,
      registeredAt: new Date().toISOString(),
    }));

    // Close registration modal
    setRegistrationModalOpen(false);

    // Optional: Save to cloud if authenticated
    if (user) {
      const result = await saveProfile(data);
      if (result.error) {
        toast.error('Profile saved locally. Sign in to sync across devices.');
      } else {
        toast.success('Profile saved successfully!');
      }
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
            setState(prev => {
              const newPuzzlesSolved = (prev.puzzlesSolved || 0) + 1;
              const newCorrectCount = (prev.correctAnswersCount || 0) + 1;
              
              // Unlock next level every 10 correct answers
              if (newCorrectCount % 10 === 0 && prev.unlockedPuzzleLevels < 10) {
                const newMaxLevel = Math.min(10, prev.unlockedPuzzleLevels + 1);
                // Use setTimeout to avoid setState during render
                setTimeout(() => {
                  setState(p => ({ ...p, unlockedPuzzleLevels: newMaxLevel }));
                  setUnlockedLevel({ level: newMaxLevel, type: 'puzzle' });
                  setLevelUnlockOpen(true);
                }, 0);
              }
              
              return {
                ...prev,
                puzzlesSolved: newPuzzlesSolved,
                correctAnswersCount: newCorrectCount,
              };
            });
          }}
        />
      )}

      {state.currentScreen === 'math' && (
        <MathScreen
          level={state.mathLevel}
          soundEnabled={state.soundEnabled}
          voiceEnabled={state.voiceEnabled}
          childName={state.childName}
          childAge={state.childAge}
          voiceSettings={state.voiceSettings}
          maxLevel={state.unlockedMathLevels}
          userId={user?.id}
          onLevelChange={(delta) => {
            const currentLevel = Number(state.mathLevel) || 1;
            const maxLevel = Number(state.unlockedMathLevels) || 1;
            const newLevel = Math.max(1, Math.min(maxLevel, currentLevel + delta));
            setState(prev => ({ ...prev, mathLevel: newLevel }));
          }}
          onMathSolved={() => {
            setState(prev => {
              const newMathSolved = prev.mathSolved + 1;
              const newCorrectCount = (prev.correctAnswersCount || 0) + 1;
              
              // Unlock next level every 10 correct answers
              if (newCorrectCount % 10 === 0 && prev.unlockedMathLevels < 10) {
                const newMaxLevel = Math.min(10, prev.unlockedMathLevels + 1);
                // Use setTimeout to avoid setState during render
                setTimeout(() => {
                  setState(p => ({ ...p, unlockedMathLevels: newMaxLevel }));
                  setUnlockedLevel({ level: newMaxLevel, type: 'math' });
                  setLevelUnlockOpen(true);
                }, 0);
              }
              
              return {
                ...prev,
                mathSolved: newMathSolved,
                stars: prev.stars + 1,
                correctAnswersCount: newCorrectCount,
              };
            });
          }}
        />
      )}

      {state.currentScreen === 'parent' && (
        <ParentDashboard
          state={state}
          userId={user?.id}
          onSoundToggle={(enabled) => setState(prev => ({ ...prev, soundEnabled: enabled }))}
          onVoiceToggle={(enabled) => setState(prev => ({ ...prev, voiceEnabled: enabled }))}
          onResetProgress={handleResetProgress}
          onClose={() => setState(prev => ({ ...prev, currentScreen: 'counting' }))}
          onUpdateChildProfile={async (name, age, avatar, gender) => {
            // Update local state immediately
            setState(prev => ({ 
              ...prev, 
              childName: name || prev.childName, 
              childAge: age || prev.childAge, 
              childAvatar: avatar || prev.childAvatar,
              childGender: (gender || prev.childGender) as 'boy' | 'girl' | 'other' | 'prefer-not-to-say' | undefined,
            }));
            
            // Save to Supabase if user is logged in
            if (user) {
              const result = await saveProfile({
                childName: name || state.childName,
                childAge: age || state.childAge,
                childAvatar: avatar || state.childAvatar,
                childGender: gender || state.childGender,
                parentEmail: state.parentEmail,
                parentRelationship: state.parentRelationship,
              });
              
              if (result.error) {
                toast.error('Failed to save profile. Please try again.');
                console.error('Profile save error:', result.error);
              } else {
                toast.success('Profile saved successfully!');
              }
            }
          }}
          onUpdateDailyGoal={(goal) => setState(prev => ({ ...prev, dailyGoal: goal }))}
          onUpdateVoiceSettings={(settings) => setState(prev => ({ ...prev, voiceSettings: settings }))}
          onUpdateTimeLimit={(limit) => setState(prev => ({ ...prev, timeLimit: limit }))}
          onOpenFeedback={() => setFeedbackModalOpen(true)}
          onUpgradeSubscription={handleUpgradeSubscription}
          onDowngradeSubscription={handleDowngradeSubscription}
        />
      )}

      <RegistrationModal
        isOpen={registrationModalOpen}
        onComplete={handleRegistrationComplete}
        onClose={() => {
          // For guest users, allow closing modal but mark as temporarily dismissed
          // They can complete registration later via profile settings
          if (!user) {
            setRegistrationModalOpen(false);
            toast.info('You can complete your profile anytime from the Parent Dashboard');
          }
        }}
        allowClose={!user} // Only allow closing for guest users (not signed in)
      />

      <VerificationErrorModal
        isOpen={verificationErrorModalOpen}
        onClose={() => {
          setVerificationErrorModalOpen(false);
          setVerificationError(null);
        }}
        email={verificationError?.email}
        errorCode={verificationError?.code}
      />

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
