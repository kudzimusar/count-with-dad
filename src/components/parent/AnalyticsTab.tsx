import { AppState } from '@/types';
import { Download, TrendingUp, Calendar, Award, Clock, Target } from 'lucide-react';
import { useMemo } from 'react';

interface AnalyticsTabProps {
  state: AppState;
  onExportProgress: () => void;
}

export function AnalyticsTab({ state, onExportProgress }: AnalyticsTabProps) {
  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = state.sessionHistory.filter(s => s.date.startsWith(today));
    const totalTime = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    const totalScore = todaySessions.reduce((sum, s) => sum + s.score, 0);
    return { sessions: todaySessions.length, time: Math.round(totalTime / 60), score: totalScore };
  };

  const getWeeklyStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklySessions = state.sessionHistory.filter(s => new Date(s.date) >= weekAgo);
    const totalTime = weeklySessions.reduce((sum, s) => sum + s.duration, 0);
    const avgDuration = weeklySessions.length > 0 ? Math.round(totalTime / weeklySessions.length / 60) : 0;
    return {
      sessions: weeklySessions.length,
      totalTime: Math.round(totalTime / 60),
      avgDuration,
      daysActive: new Set(weeklySessions.map(s => s.date.split('T')[0])).size
    };
  };

  const getLearningInsights = () => {
    const total = state.puzzlesSolved + state.mathSolved + state.correctAnswersCount;
    const countingProgress = Math.min(100, (state.highestCount / 100) * 100);
    const puzzleProgress = Math.min(100, (state.puzzlesSolved / 50) * 100);
    const mathProgress = Math.min(100, (state.mathSolved / 50) * 100);
    
    return {
      totalActivities: total,
      countingProgress,
      puzzleProgress,
      mathProgress,
      overallProgress: Math.round((countingProgress + puzzleProgress + mathProgress) / 3)
    };
  };

  const todayStats = getTodayStats();
  const weeklyStats = getWeeklyStats();
  const insights = getLearningInsights();

  const dailyGoalProgress = useMemo(() => {
    return Math.min(100, (state.highestCount / state.dailyGoal) * 100);
  }, [state.highestCount, state.dailyGoal]);

  return (
    <div className="space-y-6">
      {/* Today's Progress */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-xl border-2 border-primary/20">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Today's Progress
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-background p-4 rounded-lg shadow">
            <div className="text-sm text-muted-foreground">Sessions</div>
            <div className="text-3xl font-bold text-primary">{todayStats.sessions}</div>
          </div>
          <div className="bg-background p-4 rounded-lg shadow">
            <div className="text-sm text-muted-foreground">Minutes</div>
            <div className="text-3xl font-bold text-blue-600">{todayStats.time}</div>
          </div>
          <div className="bg-background p-4 rounded-lg shadow">
            <div className="text-sm text-muted-foreground">Score</div>
            <div className="text-3xl font-bold text-green-600">{todayStats.score}</div>
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-muted/50 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          This Week
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-background p-4 rounded-lg shadow">
            <div className="text-sm text-muted-foreground">Sessions</div>
            <div className="text-2xl font-bold">{weeklyStats.sessions}</div>
          </div>
          <div className="bg-background p-4 rounded-lg shadow">
            <div className="text-sm text-muted-foreground">Total Minutes</div>
            <div className="text-2xl font-bold">{weeklyStats.totalTime}</div>
          </div>
          <div className="bg-background p-4 rounded-lg shadow">
            <div className="text-sm text-muted-foreground">Avg. Session</div>
            <div className="text-2xl font-bold">{weeklyStats.avgDuration}m</div>
          </div>
          <div className="bg-background p-4 rounded-lg shadow">
            <div className="text-sm text-muted-foreground">Days Active</div>
            <div className="text-2xl font-bold">{weeklyStats.daysActive}/7</div>
          </div>
        </div>
      </div>

      {/* Learning Insights */}
      <div className="bg-muted/50 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Learning Progress
        </h3>
        
        <div className="space-y-4">
          {/* Overall Progress */}
          <div className="bg-background p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg">Overall Progress</span>
              <span className="text-2xl font-bold text-primary">{insights.overallProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary to-primary/70 h-3 rounded-full transition-all duration-500"
                style={{ width: `${insights.overallProgress}%` }}
              />
            </div>
          </div>

          {/* Subject Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background p-4 rounded-lg shadow">
              <div className="text-sm text-muted-foreground mb-2">Counting</div>
              <div className="text-xl font-bold mb-1">{state.highestCount}/100</div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${insights.countingProgress}%` }}
                />
              </div>
            </div>
            <div className="bg-background p-4 rounded-lg shadow">
              <div className="text-sm text-muted-foreground mb-2">Puzzles</div>
              <div className="text-xl font-bold mb-1">{state.puzzlesSolved} solved</div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${insights.puzzleProgress}%` }}
                />
              </div>
            </div>
            <div className="bg-background p-4 rounded-lg shadow">
              <div className="text-sm text-muted-foreground mb-2">Math</div>
              <div className="text-xl font-bold mb-1">{state.mathSolved} solved</div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${insights.mathProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Goal Tracker */}
      <div className="bg-muted/50 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Daily Goal Progress
        </h3>
        <div className="bg-background p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-medium">Today's Goal: {state.dailyGoal} numbers</span>
            <span className="text-xl font-bold text-primary">{Math.round(dailyGoalProgress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-4 mb-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${dailyGoalProgress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {state.highestCount >= state.dailyGoal 
              ? "🎉 Goal achieved! Great work!" 
              : `${state.dailyGoal - state.highestCount} more to reach today's goal`}
          </p>
        </div>
      </div>

      {/* Achievements Summary */}
      <div className="bg-muted/50 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4">Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-background p-4 rounded-lg shadow text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold">{state.stars}</div>
            <div className="text-sm text-muted-foreground">Stars Earned</div>
          </div>
          <div className="bg-background p-4 rounded-lg shadow text-center">
            <div className="text-3xl mb-2">🔢</div>
            <div className="text-2xl font-bold">{state.highestCount}</div>
            <div className="text-sm text-muted-foreground">Highest Count</div>
          </div>
          <div className="bg-background p-4 rounded-lg shadow text-center">
            <div className="text-3xl mb-2">🧩</div>
            <div className="text-2xl font-bold">{state.puzzlesSolved}</div>
            <div className="text-sm text-muted-foreground">Puzzles</div>
          </div>
          <div className="bg-background p-4 rounded-lg shadow text-center">
            <div className="text-3xl mb-2">➕</div>
            <div className="text-2xl font-bold">{state.mathSolved}</div>
            <div className="text-sm text-muted-foreground">Math</div>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={onExportProgress}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
      >
        <Download className="h-5 w-5" />
        Export Progress Report
      </button>
    </div>
  );
}
