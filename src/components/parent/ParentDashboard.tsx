import { AppState } from '@/types';

interface ParentDashboardProps {
  state: AppState;
  onSoundToggle: (enabled: boolean) => void;
  onVoiceToggle: (enabled: boolean) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export function ParentDashboard({
  state,
  onSoundToggle,
  onVoiceToggle,
  onResetProgress,
  onClose,
}: ParentDashboardProps) {
  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      onResetProgress();
    }
  };

  return (
    <section className="p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Parent Dashboard</h2>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-xl font-bold mb-3">Progress Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg shadow">
                <div className="text-sm text-gray-500">Highest Count</div>
                <div className="text-2xl font-bold">{state.highestCount}</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow">
                <div className="text-sm text-gray-500">Stars Earned</div>
                <div className="text-2xl font-bold">{state.stars}</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow">
                <div className="text-sm text-gray-500">Puzzles Solved</div>
                <div className="text-2xl font-bold">{state.puzzlesSolved}</div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow">
                <div className="text-sm text-gray-500">Math Problems</div>
                <div className="text-2xl font-bold">{state.mathSolved}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-xl font-bold mb-3">Settings</h3>
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

          <div className="flex gap-4">
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
      </div>
    </section>
  );
}
