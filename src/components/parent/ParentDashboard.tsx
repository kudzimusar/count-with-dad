import { AppState, VoiceSettings } from '@/types';
import { useState } from 'react';
import { User, Clock, Settings, BarChart3, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProfileTab } from './ProfileTab';
import { AnalyticsTab } from './AnalyticsTab';

interface ParentDashboardProps {
  state: AppState;
  onSoundToggle: (enabled: boolean) => void;
  onVoiceToggle: (enabled: boolean) => void;
  onResetProgress: () => void;
  onClose: () => void;
  onUpdateChildProfile: (name: string, age: number, avatar: string) => void;
  onUpdateDailyGoal: (goal: number) => void;
  onUpdateVoiceSettings: (settings: VoiceSettings) => void;
  onUpdateTimeLimit: (limit: number) => void;
  onOpenFeedback: () => void;
}

export function ParentDashboard({
  state,
  onSoundToggle,
  onVoiceToggle,
  onResetProgress,
  onClose,
  onUpdateChildProfile,
  onUpdateDailyGoal,
  onUpdateVoiceSettings,
  onUpdateTimeLimit,
  onOpenFeedback,
}: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'settings' | 'history' | 'resources'>('profile');
  const navigate = useNavigate();

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
    <section className="p-4 max-h-screen overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-5xl mx-auto bg-card p-6 rounded-2xl shadow-xl border border-border">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-foreground">
          <Settings className="h-7 w-7 text-primary" />
          Parent Dashboard
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'stats', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'history', label: 'History', icon: Clock },
            { id: 'resources', label: 'Resources', icon: FileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`px-4 py-2 font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <ProfileTab
            state={state}
            onUpdateChildProfile={onUpdateChildProfile}
            onUpdateDailyGoal={onUpdateDailyGoal}
          />
        )}

        {/* Analytics Tab */}
        {activeTab === 'stats' && (
          <AnalyticsTab 
            state={state} 
            onExportProgress={exportProgress}
          />
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Audio Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg">Sound Effects</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.soundEnabled}
                      onChange={(e) => onSoundToggle(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-input peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-input after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg">Voice Guidance</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.voiceEnabled}
                      onChange={(e) => onVoiceToggle(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-input peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-input after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Voice Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Speech Rate</label>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={state.voiceSettings.rate}
                    onChange={(e) => onUpdateVoiceSettings({ ...state.voiceSettings, rate: parseFloat(e.target.value) })}
                    className="w-full accent-primary"
                  />
                  <div className="text-sm text-muted-foreground">{state.voiceSettings.rate.toFixed(1)}x</div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Pitch</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={state.voiceSettings.pitch}
                    onChange={(e) => onUpdateVoiceSettings({ ...state.voiceSettings, pitch: parseFloat(e.target.value) })}
                    className="w-full accent-primary"
                  />
                  <div className="text-sm text-muted-foreground">{state.voiceSettings.pitch.toFixed(1)}</div>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time Limit (minutes)
              </h3>
              <input
                type="number"
                value={state.timeLimit}
                onChange={(e) => onUpdateTimeLimit(parseInt(e.target.value))}
                min="0"
                max="60"
                className="w-full px-4 py-3 border-2 border-input rounded-lg focus:border-primary outline-none bg-background transition-colors"
              />
              <p className="text-sm text-muted-foreground mt-2">Set to 0 for unlimited play time</p>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="bg-muted/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Recent Sessions</h3>
              {state.sessionHistory.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No sessions recorded yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Start learning to see your progress here!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {state.sessionHistory.slice(-20).reverse().map((session, idx) => (
                    <div key={idx} className="bg-background p-4 rounded-lg shadow border border-border flex justify-between items-center hover:shadow-md transition-shadow">
                      <div>
                        <div className="font-bold capitalize">{session.screen} {session.mode && `- ${session.mode}`}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(session.date).toLocaleDateString()} {new Date(session.date).toLocaleTimeString()}
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
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            <div className="bg-muted/50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                App Information & Policies
              </h3>
              <p className="text-muted-foreground mb-4">
                Access important information about the app, privacy policies, and support.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/about')}
                  className="w-full bg-background p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center justify-between group border border-border"
                >
                  <div className="text-left">
                    <div className="font-bold text-lg">About</div>
                    <div className="text-sm text-muted-foreground">Learn about Count to 100</div>
                  </div>
                  <div className="text-primary group-hover:translate-x-1 transition-transform">→</div>
                </button>

                <button
                  onClick={() => navigate('/privacy-policy')}
                  className="w-full bg-background p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center justify-between group border border-border"
                >
                  <div className="text-left">
                    <div className="font-bold text-lg">Privacy Policy</div>
                    <div className="text-sm text-muted-foreground">How we protect your privacy</div>
                  </div>
                  <div className="text-primary group-hover:translate-x-1 transition-transform">→</div>
                </button>

                <button
                  onClick={() => navigate('/terms-of-service')}
                  className="w-full bg-background p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center justify-between group border border-border"
                >
                  <div className="text-left">
                    <div className="font-bold text-lg">Terms of Service</div>
                    <div className="text-sm text-muted-foreground">Terms and conditions of use</div>
                  </div>
                  <div className="text-primary group-hover:translate-x-1 transition-transform">→</div>
                </button>

                <button
                  onClick={() => navigate('/support')}
                  className="w-full bg-background p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center justify-between group border border-border"
                >
                  <div className="text-left">
                    <div className="font-bold text-lg">Support & Help</div>
                    <div className="text-sm text-muted-foreground">Get help and contact us</div>
                  </div>
                  <div className="text-primary group-hover:translate-x-1 transition-transform">→</div>
                </button>

                <button
                  onClick={onOpenFeedback}
                  className="w-full bg-primary text-primary-foreground p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center justify-between group"
                >
                  <div className="text-left">
                    <div className="font-bold text-lg">💬 Share Feedback</div>
                    <div className="text-sm text-primary-foreground/80">Help us improve the app</div>
                  </div>
                  <div className="text-primary-foreground group-hover:translate-x-1 transition-transform">→</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleReset}
            className="flex-1 bg-destructive text-destructive-foreground py-3 rounded-xl font-bold hover:bg-destructive/90 transition-colors"
          >
            Reset Progress
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-xl font-bold hover:bg-secondary/80 transition-colors"
          >
            Back to App
          </button>
        </div>
      </div>
    </section>
  );
}
