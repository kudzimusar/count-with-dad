import { AppState } from '@/types';
import { Download, Clock, Settings, CreditCard } from 'lucide-react';
import { useMemo, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AgeAdvancementApproval } from './AgeAdvancementApproval';
import { PreviousAgeMastery, GraduationRecord } from '@/components/progress/PreviousAgeMastery';
import { GraduationStatus } from '@/hooks/useGraduationRequests';
import { AnimatedMascot } from '@/components/mascots/AnimatedMascot';
import { AVATAR_MASCOT_TYPES, MascotType } from '@/config/mascotCharacters';
import { 
  BentoCard, 
  StatWidget, 
  WeeklyTracker, 
  SkillMasteryBar, 
  JourneyProgress,
  QuickActionPill 
} from './widgets';

interface ProgressTabProps {
  state: AppState;
  userId?: string;
  onExportProgress: () => void;
  graduationStatus?: GraduationStatus | null;
  graduationLoading?: boolean;
  onApproveGraduation?: () => Promise<void>;
  onDeferGraduation?: () => Promise<void>;
  onNavigateToTab?: (tab: string) => void;
}

export function ProgressTab({ 
  state, 
  userId,
  onExportProgress,
  graduationStatus,
  graduationLoading,
  onApproveGraduation,
  onDeferGraduation,
  onNavigateToTab
}: ProgressTabProps) {
  const [graduationHistory, setGraduationHistory] = useState<GraduationRecord[]>([]);

  // Fetch graduation history from database
  useEffect(() => {
    async function fetchGraduationHistory() {
      if (!userId) return;
      
      const { data, error } = await supabase
        .from('graduation_history')
        .select('*')
        .eq('user_id', userId)
        .order('graduated_at', { ascending: false });
      
      if (!error && data) {
        setGraduationHistory(data.map(record => ({
          fromAge: record.from_age,
          toAge: record.to_age,
          graduatedAt: record.graduated_at,
          summaryData: record.summary_data as GraduationRecord['summaryData']
        })));
      }
    }
    
    fetchGraduationHistory();
  }, [userId]);

  const getWeeklyStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklySessions = state.sessionHistory.filter(s => new Date(s.date) >= weekAgo);
    const totalTime = weeklySessions.reduce((sum, s) => sum + s.duration, 0);
    return {
      sessions: weeklySessions.length,
      totalTime: Math.round(totalTime / 60),
    };
  };

  const getLearningInsights = () => {
    const countingProgress = Math.min(100, Math.round((state.highestCount / 100) * 100));
    const puzzleProgress = Math.min(100, Math.round((state.puzzlesSolved / 50) * 100));
    const mathProgress = Math.min(100, Math.round((state.mathSolved / 50) * 100));
    const overallProgress = Math.round((countingProgress + puzzleProgress + mathProgress) / 3);
    
    return {
      countingProgress,
      puzzleProgress,
      mathProgress,
      overallProgress,
    };
  };

  // Calculate weekly activity (last 7 days)
  const weeklyActivity = useMemo(() => {
    const today = new Date();
    const activeDays: boolean[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const hasSession = state.sessionHistory.some(s => s.date.startsWith(dateStr));
      activeDays.push(hasSession);
    }
    
    return activeDays;
  }, [state.sessionHistory]);

  const weeklyStats = getWeeklyStats();
  const insights = getLearningInsights();

  // Get child avatar mascot type
  const avatarMascotType: MascotType = AVATAR_MASCOT_TYPES.includes(state.childAvatar as MascotType) 
    ? (state.childAvatar as MascotType) 
    : 'panda';

  // Calculate problems solved total
  const totalProblems = state.puzzlesSolved + state.mathSolved + state.correctAnswersCount;

  return (
    <div className="space-y-6">
      {/* Graduation Request Approval */}
      {graduationStatus?.isRequested && graduationStatus.request && onApproveGraduation && onDeferGraduation && (
        <AgeAdvancementApproval
          childName={state.childName}
          request={graduationStatus.request}
          onApprove={onApproveGraduation}
          onDefer={onDeferGraduation}
          loading={graduationLoading}
        />
      )}

      {/* Previous Age Achievements */}
      {graduationHistory.length > 0 && (
        <PreviousAgeMastery
          currentAge={state.childAge}
          graduationHistory={graduationHistory}
          compact={false}
        />
      )}

      {/* Hero Profile Block - Full Width */}
      <BentoCard variant="hero" fullWidth className="overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Left: Large Avatar */}
          <div className="w-28 h-28 flex-shrink-0">
            <AnimatedMascot type={avatarMascotType} animated />
          </div>
          
          {/* Right: Journey Progress & Quick Actions */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-foreground">
                {state.childName || 'Little Learner'}
              </h2>
              <span className="px-2 py-0.5 bg-primary/20 text-primary text-sm font-medium rounded-full">
                Age {state.childAge}
              </span>
            </div>
            
            <JourneyProgress 
              currentLevel={state.mathLevel}
              progressToNext={insights.overallProgress}
              totalStars={state.stars}
            />
            
            {/* Quick Action Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              <QuickActionPill 
                label="Edit Profile" 
                icon={Settings}
                onClick={() => onNavigateToTab?.('profile')}
              />
              <QuickActionPill 
                label="Subscription" 
                icon={CreditCard}
                variant="outline"
                onClick={() => onNavigateToTab?.('subscription')}
              />
            </div>
          </div>
        </div>
      </BentoCard>

      {/* Stats Grid - 2x2 on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget
          value={totalProblems}
          label="Problems Solved"
          mascotType="apple"
        />
        <StatWidget
          value={state.stars}
          label="Total Stars"
          mascotType="star"
        />
        <StatWidget
          value={`Level ${state.mathLevel}`}
          label="Current Level"
          mascotType="blueberry"
        />
        <StatWidget
          value={`${weeklyStats.totalTime}m`}
          label="This Week"
          icon={Clock}
          iconColor="text-purple-600"
        />
      </div>

      {/* Weekly Consistency Block */}
      <WeeklyTracker activeDays={weeklyActivity} />

      {/* Skill Mastery Block */}
      <BentoCard>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          Skill Breakdown
        </h3>
        
        <div className="space-y-6">
          <SkillMasteryBar
            name="Number Sense"
            percentage={insights.countingProgress}
            mascotType="orange"
          />
          <SkillMasteryBar
            name="Addition & Math"
            percentage={insights.mathProgress}
            mascotType="banana"
          />
          <SkillMasteryBar
            name="Puzzles & Patterns"
            percentage={insights.puzzleProgress}
            mascotType="blueberry"
          />
        </div>
      </BentoCard>

      {/* Recent Sessions */}
      <BentoCard>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Sessions
        </h3>
        {state.sessionHistory.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 opacity-50">
              <AnimatedMascot type="star" />
            </div>
            <p className="text-muted-foreground text-lg">No sessions yet</p>
            <p className="text-sm text-muted-foreground mt-2">Activity will appear here</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {state.sessionHistory.slice(-10).reverse().map((session, idx) => (
              <div 
                key={idx} 
                className="bg-muted/50 p-4 rounded-2xl flex justify-between items-center hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10">
                    <AnimatedMascot 
                      type={session.screen === 'counting' ? 'orange' : session.screen === 'puzzle' ? 'blueberry' : 'apple'} 
                    />
                  </div>
                  <div>
                    <div className="font-bold capitalize">
                      {session.screen} {session.mode && `- ${session.mode}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{session.score} pts</div>
                  <div className="text-sm text-muted-foreground">{Math.round(session.duration / 60)}m</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </BentoCard>

      {/* Export Button */}
      <button
        onClick={onExportProgress}
        className="w-full bg-primary text-primary-foreground py-4 rounded-3xl font-bold hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      >
        <Download className="h-5 w-5" />
        Export Detailed Progress Report
      </button>
    </div>
  );
}
