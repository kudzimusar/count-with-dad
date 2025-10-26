import { AppState, VoiceSettings } from '@/types';
import { useState } from 'react';
import { Download, User, Target, Clock, Settings, BarChart3, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
}: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'settings' | 'history' | 'resources'>('profile');
  const navigate = useNavigate();
  const [editName, setEditName] = useState(state.childName);
  const [editAge, setEditAge] = useState(state.childAge);
  const [editAvatar, setEditAvatar] = useState(state.childAvatar);

  const avatars = ['👦', '👧', '🧒', '👶', '🐻', '🐶', '🐱', '🦁', '🐼', '🐨'];

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      onResetProgress();
    }
  };

  const handleSaveProfile = () => {
    onUpdateChildProfile(editName, editAge, editAvatar);
  };

  const exportProgress = () => {
    const data = {
      childName: state.childName,
      highestCount: state.highestCount,
      stars: state.stars,
      puzzlesSolved: state.puzzlesSolved,
      mathSolved: state.mathSolved,
      sessionHistory: state.sessionHistory,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.childName}-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = state.sessionHistory.filter(s => s.date.startsWith(today));
    const totalTime = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    const totalScore = todaySessions.reduce((sum, s) => sum + s.score, 0);
    return { sessions: todaySessions.length, time: Math.round(totalTime / 60), score: totalScore };
  };

  const todayStats = getTodayStats();

  return (
    <section className="p-4 max-h-screen overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Settings className="h-6 w-6 text-purple-600" />
          Parent Dashboard
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b overflow-x-auto">
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
              className={`px-4 py-2 font-bold transition-colors flex items-center gap-2 ${
                activeTab === id
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-purple-400'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Child Profile
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Age</label>
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(parseInt(e.target.value))}
                    min="2"
                    max="12"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Avatar</label>
                  <div className="grid grid-cols-5 gap-2">
                    {avatars.map((avatar) => (
                      <button
                        key={avatar}
                        onClick={() => setEditAvatar(avatar)}
                        className={`text-4xl p-3 rounded-lg transition-all ${
                          editAvatar === avatar
                            ? 'bg-purple-200 ring-4 ring-purple-400'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors"
                >
                  Save Profile
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Daily Goal
              </h3>
              <input
                type="number"
                value={state.dailyGoal}
                onChange={(e) => onUpdateDailyGoal(parseInt(e.target.value))}
                min="1"
                max="100"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
              />
              <p className="text-sm text-gray-500 mt-2">Numbers to count per day</p>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Today's Progress</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500">Sessions</div>
                  <div className="text-3xl font-bold text-purple-600">{todayStats.sessions}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500">Minutes</div>
                  <div className="text-3xl font-bold text-blue-600">{todayStats.time}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500">Score</div>
                  <div className="text-3xl font-bold text-green-600">{todayStats.score}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Overall Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500">Highest Count</div>
                  <div className="text-2xl font-bold">{state.highestCount}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500">Stars Earned</div>
                  <div className="text-2xl font-bold">{state.stars}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500">Puzzles Solved</div>
                  <div className="text-2xl font-bold">{state.puzzlesSolved}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-sm text-gray-500">Math Problems</div>
                  <div className="text-2xl font-bold">{state.mathSolved}</div>
                </div>
              </div>
            </div>

            <button
              onClick={exportProgress}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="h-5 w-5" />
              Export Progress Report
            </button>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
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
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
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
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
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
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500">{state.voiceSettings.rate.toFixed(1)}x</div>
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
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500">{state.voiceSettings.pitch.toFixed(1)}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
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
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
              />
              <p className="text-sm text-gray-500 mt-2">Set to 0 for unlimited play time</p>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Recent Sessions</h3>
              {state.sessionHistory.length === 0 ? (
                <p className="text-gray-500">No sessions recorded yet</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {state.sessionHistory.slice(-20).reverse().map((session, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg shadow flex justify-between items-center">
                      <div>
                        <div className="font-bold">{session.screen} {session.mode && `- ${session.mode}`}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(session.date).toLocaleDateString()} {new Date(session.date).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600">{session.score} pts</div>
                        <div className="text-sm text-gray-500">{Math.round(session.duration / 60)}m</div>
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
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                App Information & Policies
              </h3>
              <p className="text-gray-600 mb-4">
                Access important information about the app, privacy policies, and support.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/about')}
                  className="w-full bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center justify-between group"
                >
                  <div className="text-left">
                    <div className="font-bold text-lg">About</div>
                    <div className="text-sm text-gray-500">Learn about Count to 100</div>
                  </div>
                  <div className="text-purple-600 group-hover:translate-x-1 transition-transform">→</div>
                </button>

                <button
                  onClick={() => navigate('/privacy-policy')}
                  className="w-full bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center justify-between group"
                >
                  <div className="text-left">
                    <div className="font-bold text-lg">Privacy Policy</div>
                    <div className="text-sm text-gray-500">How we protect your privacy</div>
                  </div>
                  <div className="text-purple-600 group-hover:translate-x-1 transition-transform">→</div>
                </button>

                <button
                  onClick={() => navigate('/terms-of-service')}
                  className="w-full bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center justify-between group"
                >
                  <div className="text-left">
                    <div className="font-bold text-lg">Terms of Service</div>
                    <div className="text-sm text-gray-500">Terms and conditions of use</div>
                  </div>
                  <div className="text-purple-600 group-hover:translate-x-1 transition-transform">→</div>
                </button>

                <button
                  onClick={() => navigate('/support')}
                  className="w-full bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center justify-between group"
                >
                  <div className="text-left">
                    <div className="font-bold text-lg">Support & Help</div>
                    <div className="text-sm text-gray-500">Get help and contact us</div>
                  </div>
                  <div className="text-purple-600 group-hover:translate-x-1 transition-transform">→</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleReset}
            className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors"
          >
            Reset Progress
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors"
          >
            Back to App
          </button>
        </div>
      </div>
    </section>
  );
}
