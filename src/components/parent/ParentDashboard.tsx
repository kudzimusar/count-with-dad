import { AppState, VoiceSettings } from '@/types';
import { useState } from 'react';
import { User, Settings, TrendingUp, BookOpen, ArrowLeft, Crown, BarChart3 } from 'lucide-react';
import { ProfileTab } from './ProfileTab';
import { ProgressTab } from './ProgressTab';
import { SettingsTab } from './SettingsTab';
import { ResourcesTab } from './ResourcesTab';
import { SubscriptionTab } from './SubscriptionTab';
import { AccountTab } from './AccountTab';
import { EnhancedAnalyticsTab } from './EnhancedAnalyticsTab';

interface ParentDashboardProps {
  state: AppState;
  userId?: string;
  onSoundToggle: (enabled: boolean) => void;
  onVoiceToggle: (enabled: boolean) => void;
  onResetProgress: () => void;
  onClose: () => void;
  onUpdateChildProfile: (name: string, age: number, avatar: string, gender?: string) => void;
  onUpdateDailyGoal: (goal: number) => void;
  onUpdateVoiceSettings: (settings: VoiceSettings) => void;
  onUpdateTimeLimit: (limit: number) => void;
  onOpenFeedback: () => void;
  onUpgradeSubscription: () => void;
  onDowngradeSubscription?: () => void;
}

export function ParentDashboard({
  state,
  userId,
  onSoundToggle,
  onVoiceToggle,
  onResetProgress,
  onClose,
  onUpdateChildProfile,
  onUpdateDailyGoal,
  onUpdateVoiceSettings,
  onUpdateTimeLimit,
  onOpenFeedback,
  onUpgradeSubscription,
  onDowngradeSubscription,
}: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'progress' | 'analytics' | 'settings' | 'subscription' | 'resources' | 'account'>('profile');

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      onResetProgress();
    }
  };

  const exportProgress = () => {
    const data = {
      childName: state.childName,
      childAge: state.childAge,
      childGender: state.childGender,
      parentEmail: state.parentEmail,
      parentRelationship: state.parentRelationship,
      registeredAt: state.registeredAt,
      highestCount: state.highestCount,
      stars: state.stars,
      puzzlesSolved: state.puzzlesSolved,
      mathSolved: state.mathSolved,
      sessionHistory: state.sessionHistory,
      totalSessions: state.sessionHistory.length,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.childName}-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <section className="fixed inset-0 bg-gradient-to-br from-background via-background to-muted/20 overflow-y-auto z-50">
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Parent Zone</h2>
                  <p className="text-sm text-primary-foreground/80">Manage {state.childName}'s learning</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
              {[
                { id: 'profile', label: 'My Child', icon: User },
                { id: 'progress', label: 'Progress', icon: TrendingUp },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'account', label: 'Account', icon: User },
                { id: 'subscription', label: 'Subscription', icon: Crown },
                { id: 'settings', label: 'Settings', icon: Settings },
                { id: 'resources', label: 'Resources', icon: BookOpen },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as 'profile' | 'progress' | 'analytics' | 'settings' | 'subscription' | 'resources' | 'account')}
                  className={`px-4 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === id
                      ? 'bg-white text-primary shadow-md'
                      : 'text-primary-foreground/80 hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <ProfileTab
                state={state}
                onUpdateChildProfile={onUpdateChildProfile}
                onUpdateDailyGoal={onUpdateDailyGoal}
              />
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <ProgressTab 
                state={state} 
                onExportProgress={exportProgress}
              />
            )}

            {/* Analytics Tab - Enhanced */}
            {activeTab === 'analytics' && (
              <EnhancedAnalyticsTab 
                userId={userId || 'guest'}
                childName={state.childName || 'Guest'}
                childAge={state.childAge}
              />
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <AccountTab />
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <SettingsTab
                state={state}
                onSoundToggle={onSoundToggle}
                onVoiceToggle={onVoiceToggle}
                onUpdateVoiceSettings={onUpdateVoiceSettings}
                onUpdateTimeLimit={onUpdateTimeLimit}
              />
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <SubscriptionTab
                state={state}
                onUpgrade={onUpgradeSubscription}
                onDowngrade={onDowngradeSubscription}
              />
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <ResourcesTab onOpenFeedback={onOpenFeedback} />
            )}

            {/* Reset Progress Button */}
            <div className="mt-8 pt-6 border-t border-border">
              <button
                onClick={handleReset}
                className="w-full bg-destructive text-destructive-foreground py-3 rounded-xl font-bold hover:bg-destructive/90 transition-colors shadow-md hover:shadow-lg"
              >
                ⚠️ Reset All Progress
              </button>
              <p className="text-sm text-muted-foreground text-center mt-2">
                This will permanently delete all learning data
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
