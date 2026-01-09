import { useState, useEffect } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAgeAnalytics } from '@/hooks/useAgeAnalytics';
import { AppState } from '@/types';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

interface EnhancedAnalyticsTabProps {
  userId: string;
  childName: string;
  childAge: number;
}

interface WeeklySummary {
  ageYear: number;
  days: Array<{ date: string; sessions: number; timeMinutes: number; problemsSolved: number }>;
  totalSessions: number;
  totalTimeMinutes: number;
  totalProblemsSolved: number;
}

interface AgeEngagementStats {
  ageYear: number;
  totalSessions: number;
  totalTimeMinutes: number;
  avgSessionMinutes: number;
  modesUsed: string[];
  favoriteMode: string | null;
  successRate: number;
}

export function EnhancedAnalyticsTab({ userId, childName, childAge }: EnhancedAnalyticsTabProps) {
  const { loadProgress, loadSessionHistory } = useSupabaseData(userId);
  const { getAgeEngagementStats, getWeeklySummary } = useAgeAnalytics(userId);
  
  const [progress, setProgress] = useState<AppState | null>(null);
  const [sessions, setSessions] = useState<Array<{ date: string; duration: number; screen: string; score: number }>>([]);
  const [ageStats, setAgeStats] = useState<AgeEngagementStats | null>(null);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      
      // Load all data in parallel
      const [progressResult, sessionResult, ageStatsResult, weeklyResult] = await Promise.all([
        loadProgress(),
        loadSessionHistory(),
        getAgeEngagementStats(childAge),
        getWeeklySummary(childAge)
      ]);

      if (progressResult.data) {
        setProgress(progressResult.data);
      }
      if (sessionResult.data) {
        setSessions(sessionResult.data);
      }
      setAgeStats(ageStatsResult);
      setWeeklySummary(weeklyResult);
      
      setLoading(false);
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, childAge]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics - handle both camelCase (AppState) and snake_case (DB response)
  const progressData = progress as unknown as Record<string, unknown>;
  const totalMathSolved = Number(progressData?.mathSolved ?? progressData?.math_solved ?? 0);
  const mathLevel = Number(progressData?.mathLevel ?? progressData?.math_level ?? 1);
  const totalStars = Number(progressData?.stars ?? 0);

  // Calculate recent activity (last 7 days)
  const recentSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });

  const mathSessions = recentSessions.filter(s => s.screen === 'math');
  const mathTimeSpent = mathSessions.reduce((sum, s) => sum + s.duration, 0);

  // Difficulty analysis based on success rate
  const getDifficultyInsight = () => {
    const successRate = ageStats?.successRate || 0;
    if (successRate > 95) {
      return { type: 'easy', message: 'Content may be too easy. Consider advancing to harder levels.', icon: TrendingUp, color: 'text-blue-600' };
    } else if (successRate < 50) {
      return { type: 'hard', message: 'Content may be challenging. Extra support recommended.', icon: TrendingDown, color: 'text-orange-600' };
    }
    return { type: 'appropriate', message: 'Difficulty level is appropriate for the child.', icon: CheckCircle, color: 'text-green-600' };
  };

  const difficultyInsight = getDifficultyInsight();

  return (
    <div className="enhanced-analytics-tab p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        {childName}'s Learning Progress (Age {childAge})
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
          value={weeklySummary?.totalProblemsSolved || totalMathSolved}
          icon="✅"
          color="green"
          subtitle="This week"
        />
        <StatCard
          title="Total Stars"
          value={totalStars}
          icon="⭐"
          color="yellow"
        />
        <StatCard
          title="Learning Time"
          value={`${weeklySummary?.totalTimeMinutes || Math.floor(mathTimeSpent / 60)} min`}
          icon="⏱️"
          color="purple"
          subtitle="This week"
        />
      </div>

      {/* Age-Based Engagement Stats */}
      {ageStats && (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>📈</span> Age {childAge} Engagement Insights
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InsightCard
              label="Sessions"
              value={ageStats.totalSessions}
              subtitle="Last 30 days"
            />
            <InsightCard
              label="Avg Session"
              value={`${ageStats.avgSessionMinutes} min`}
              subtitle="Duration"
            />
            <InsightCard
              label="Success Rate"
              value={`${ageStats.successRate}%`}
              subtitle="Accuracy"
              highlight={ageStats.successRate >= 70}
            />
            <InsightCard
              label="Favorite Mode"
              value={formatModeName(ageStats.favoriteMode) || 'N/A'}
              subtitle="Most played"
            />
          </div>
          
          {/* Modes explored */}
          {ageStats.modesUsed.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm font-semibold text-gray-600 mb-2">Modes Explored:</div>
              <div className="flex flex-wrap gap-2">
                {ageStats.modesUsed.map(mode => (
                  <span key={mode} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {formatModeName(mode)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Weekly Activity Chart */}
      {weeklySummary && weeklySummary.days.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">📅 Weekly Activity</h3>
          <div className="flex items-end gap-2 h-32">
            {weeklySummary.days.map((day, index) => {
              const maxProblems = Math.max(...weeklySummary.days.map(d => d.problemsSolved), 1);
              const height = (day.problemsSolved / maxProblems) * 100;
              const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">{day.problemsSolved}</span>
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300"
                      style={{ height: `${Math.max(height, 4)}%`, minHeight: '4px' }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 mt-1">{dayName}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between text-sm text-gray-600">
            <span>Total Sessions: {weeklySummary.totalSessions}</span>
            <span>Total Problems: {weeklySummary.totalProblemsSolved}</span>
          </div>
        </div>
      )}

      {/* Difficulty Analysis */}
      <div className={`p-6 rounded-2xl shadow-lg ${
        difficultyInsight.type === 'easy' ? 'bg-blue-50' :
        difficultyInsight.type === 'hard' ? 'bg-orange-50' :
        'bg-green-50'
      }`}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5" /> Difficulty Analysis
        </h3>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${
            difficultyInsight.type === 'easy' ? 'bg-blue-100' :
            difficultyInsight.type === 'hard' ? 'bg-orange-100' :
            'bg-green-100'
          }`}>
            <difficultyInsight.icon className={`h-6 w-6 ${difficultyInsight.color}`} />
          </div>
          <div>
            <div className={`font-semibold ${difficultyInsight.color}`}>
              {difficultyInsight.type === 'easy' ? 'May Be Too Easy' :
               difficultyInsight.type === 'hard' ? 'May Be Challenging' :
               'Just Right'}
            </div>
            <div className="text-gray-600 mt-1">{difficultyInsight.message}</div>
          </div>
        </div>
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
                      {new Date(session.date).toLocaleDateString()} • {Math.round(session.duration / 60)} min
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
          {difficultyInsight.type === 'easy' ? (
            <>
              <RecommendationItem
                title="Try Higher Difficulty"
                description="Consider moving to the next level or trying more challenging modes"
                action="Advance Level"
              />
              <RecommendationItem
                title="Explore New Modes"
                description="Subtraction, multiplication, or pattern recognition could provide fresh challenges"
                action="Browse Modes"
              />
            </>
          ) : difficultyInsight.type === 'hard' ? (
            <>
              <RecommendationItem
                title="Practice Current Level"
                description="More practice at the current level will build confidence"
                action="Review Basics"
              />
              <RecommendationItem
                title="Use Visual Aids"
                description="Enable hints and visual objects to support learning"
                action="Settings"
              />
            </>
          ) : (
            <>
              <RecommendationItem
                title="Continue Current Path"
                description="The current difficulty is working well - keep up the great work!"
                action="Keep Going"
              />
              <RecommendationItem
                title="Daily Practice"
                description="Consistent 5-10 minute sessions maximize learning retention"
                action="Set Goal"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper to format mode IDs to readable names
function formatModeName(modeId: string | null): string {
  if (!modeId) return '';
  return modeId
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'yellow' | 'purple';
  subtitle?: string;
}

function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
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
      {subtitle && <div className="text-xs opacity-50 mt-1">{subtitle}</div>}
    </div>
  );
}

interface InsightCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  highlight?: boolean;
}

function InsightCard({ label, value, subtitle, highlight }: InsightCardProps) {
  return (
    <div className={`p-4 rounded-xl ${highlight ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
      <div className={`text-2xl font-bold ${highlight ? 'text-green-600' : 'text-gray-800'}`}>{value}</div>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  );
}

interface ProgressBarProps {
  label: string;
  value: number;
  color: string;
}

function ProgressBar({ label, value, color }: ProgressBarProps) {
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

interface RecommendationItemProps {
  title: string;
  description: string;
  action?: string;
}

function RecommendationItem({ title, description, action }: RecommendationItemProps) {
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
