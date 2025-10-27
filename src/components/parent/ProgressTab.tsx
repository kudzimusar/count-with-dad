import { AppState } from '@/types';
import { Download, TrendingUp, Calendar, Award, Target, Clock, Activity } from 'lucide-react';
import { useMemo } from 'react';

interface ProgressTabProps {
  state: AppState;
  onExportProgress: () => void;
}

export function ProgressTab({ state, onExportProgress }: ProgressTabProps) {
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
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-6 rounded-xl border border-purple-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <h4 className="font-bold text-muted-foreground">Overall</h4>
          </div>
          <div className="text-3xl font-bold text-purple-600">{insights.overallProgress}%</div>
          <p className="text-sm text-muted-foreground mt-1">Total Progress</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-6 rounded-xl border border-blue-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <h4 className="font-bold text-muted-foreground">This Week</h4>
          </div>
          <div className="text-3xl font-bold text-blue-600">{weeklyStats.sessions}</div>
          <p className="text-sm text-muted-foreground mt-1">Sessions Completed</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 p-6 rounded-xl border border-green-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <h4 className="font-bold text-muted-foreground">Stars</h4>
          </div>
          <div className="text-3xl font-bold text-green-600">{state.stars}</div>
          <p className="text-sm text-muted-foreground mt-1">Total Earned</p>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-xl border-2 border-primary/20">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Today's Activity
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-background p-4 rounded-lg shadow-sm">
            <div className="text-sm text-muted-foreground mb-1">Sessions</div>
            <div className="text-2xl font-bold text-primary">{todayStats.sessions}</div>
          </div>
          <div className="bg-background p-4 rounded-lg shadow-sm">
            <div className="text-sm text-muted-foreground mb-1">Minutes</div>
            <div className="text-2xl font-bold text-blue-600">{todayStats.time}</div>
          </div>
          <div className="bg-background p-4 rounded-lg shadow-sm">
            <div className="text-sm text-muted-foreground mb-1">Points</div>
            <div className="text-2xl font-bold text-green-600">{todayStats.score}</div>
          </div>
        </div>
      </div>

      {/* Learning Progress */}
      <div className="bg-muted/50 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Learning Areas
        </h3>
        
        <div className="space-y-4">
          {/* Counting */}
          <div className="bg-background p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔢</span>
                <span className="font-bold">Counting</span>
              </div>
              <span className="text-lg font-bold text-purple-600">{state.highestCount}/100</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div 
                className="bg-purple-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${insights.countingProgress}%` }}
              />
            </div>
          </div>

          {/* Puzzles */}
          <div className="bg-background p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧩</span>
                <span className="font-bold">Puzzles</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{state.puzzlesSolved} solved</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${insights.puzzleProgress}%` }}
              />
            </div>
          </div>

          {/* Math */}
          <div className="bg-background p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">➕</span>
                <span className="font-bold">Math</span>
              </div>
              <span className="text-lg font-bold text-green-600">{state.mathSolved} solved</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${insights.mathProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Goal */}
      <div className="bg-muted/50 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Daily Goal: {state.dailyGoal} Numbers
        </h3>
        <div className="bg-background p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-medium">Progress Today</span>
            <span className="text-2xl font-bold text-primary">{Math.round(dailyGoalProgress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${dailyGoalProgress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {state.highestCount >= state.dailyGoal 
              ? "🎉 Daily goal achieved! Fantastic work!" 
              : `${state.dailyGoal - state.highestCount} more numbers to reach today's goal`}
          </p>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-muted/50 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Sessions
        </h3>
        {state.sessionHistory.length === 0 ? (
          <div className="text-center py-12 bg-background rounded-lg">
            <p className="text-muted-foreground text-lg">No sessions yet</p>
            <p className="text-sm text-muted-foreground mt-2">Activity will appear here</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {state.sessionHistory.slice(-10).reverse().map((session, idx) => (
              <div key={idx} className="bg-background p-4 rounded-lg shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {session.screen === 'counting' ? '🔢' : session.screen === 'puzzle' ? '🧩' : '➕'}
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
      </div>

      {/* Export Button */}
      <button
        onClick={onExportProgress}
        className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
      >
        <Download className="h-5 w-5" />
        Export Detailed Progress Report
      </button>
    </div>
  );
}
