import { useState, useEffect } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { AppState } from '@/types';

interface EnhancedAnalyticsTabProps {
  userId: string;
  childName: string;
  childAge: number;
}

export function EnhancedAnalyticsTab({ userId, childName, childAge }: EnhancedAnalyticsTabProps) {
  const { loadProgress, loadSessionHistory } = useSupabaseData(userId);
  const [progress, setProgress] = useState<AppState | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data: progressData } = await loadProgress();
      const { data: sessionData } = await loadSessionHistory();

      if (progressData) {
        setProgress(progressData);
      }
      if (sessionData) {
        setSessions(sessionData);
      }
      setLoading(false);
    }

    loadData();
  }, [userId]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="text-2xl text-gray-500">Loading enhanced analytics...</div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="p-6 text-center">
        <div className="text-xl text-gray-600">No data available yet</div>
      </div>
    );
  }

  // Calculate statistics
  const totalMathSolved = progress.mathSolved || 0;
  const mathLevel = progress.mathLevel || 1;
  const totalStars = progress.stars || 0;

  // Calculate recent activity (last 7 days)
  const recentSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });

  const mathSessions = recentSessions.filter(s => s.screen === 'math');
  const mathTimeSpent = mathSessions.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="enhanced-analytics-tab p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        {childName}'s Math Progress (Age {childAge})
      </h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Math Level"
          value={mathLevel}
          icon="📊"
          color="blue"
        />
        <StatCard
          title="Problems Solved"
          value={totalMathSolved}
          icon="✅"
          color="green"
        />
        <StatCard
          title="Total Stars"
          value={totalStars}
          icon="⭐"
          color="yellow"
        />
        <StatCard
          title="Time Spent (7 days)"
          value={`${Math.floor(mathTimeSpent / 60)} min`}
          icon="⏱️"
          color="purple"
        />
      </div>

      {/* Progress Overview */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold mb-4">Math Progress Overview</h3>
        <div className="space-y-4">
          <ProgressBar
            label="Addition Mastery"
            value={Math.min(100, (mathLevel / 10) * 100)}
            color="bg-blue-500"
          />
          <ProgressBar
            label="Problem Solving"
            value={Math.min(100, (totalMathSolved / 100) * 100)}
            color="bg-green-500"
          />
          <ProgressBar
            label="Star Collection"
            value={Math.min(100, (totalStars / 50) * 100)}
            color="bg-yellow-500"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold mb-4">Recent Math Activity</h3>
        {mathSessions.length > 0 ? (
          <div className="space-y-3">
            {mathSessions.slice(0, 5).map((session, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <div className="font-semibold">Math Session</div>
                    <div className="text-sm text-gray-600">
                      {new Date(session.date).toLocaleDateString()} • {session.duration} seconds
                    </div>
                  </div>
                </div>
                <div className="font-bold text-green-600">
                  +{session.score} points
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 italic">
            No recent math activity. Encourage {childName} to try some math challenges!
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-4 text-purple-800">Recommendations for {childName}</h3>
        <div className="space-y-3">
          {mathLevel < 5 ? (
            <>
              <RecommendationItem
                title="Start with Addition Basics"
                description="Perfect for building foundational math skills with visual aids"
                action="Try Addition Mode"
              />
              <RecommendationItem
                title="Daily Math Practice"
                description="Just 5-10 minutes daily can build confidence and skills"
                action="Set Daily Goal"
              />
            </>
          ) : (
            <>
              <RecommendationItem
                title="Try New Math Modes"
                description="Explore subtraction, shapes, and patterns for comprehensive learning"
                action="Browse Modes"
              />
              <RecommendationItem
                title="Challenge Mode"
                description="Test skills with timed challenges and earn extra stars"
                action="Start Challenge"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className={`${colorClasses[color]} p-6 rounded-2xl shadow-lg`}>
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-75">{title}</div>
    </div>
  );
}

function ProgressBar({ label, value, color }: any) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-semibold">{label}</span>
        <span className="text-gray-600">{Math.round(value)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`${color} h-full transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function RecommendationItem({ title, description, action }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-100">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="font-semibold text-purple-700 mb-1">{title}</div>
          <div className="text-sm text-gray-600">{description}</div>
        </div>
        <button className="ml-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors">
          {action}
        </button>
      </div>
    </div>
  );
}
