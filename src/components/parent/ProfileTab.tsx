import { useState, useEffect } from 'react';
import { AppState } from '@/types';
import { Calendar, Mail, Users } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { AnimatedMascot } from '@/components/mascots/AnimatedMascot';
import { AVATAR_MASCOT_TYPES, MascotType } from '@/config/mascotCharacters';
import { BentoCard, StatWidget } from './widgets';

interface ProfileTabProps {
  state: AppState;
  onUpdateChildProfile: (name: string, age: number, avatar: string, gender?: string) => void;
  onUpdateDailyGoal: (goal: number) => void;
}

export function ProfileTab({ state, onUpdateChildProfile, onUpdateDailyGoal }: ProfileTabProps) {
  const [editName, setEditName] = useState(state.childName);
  const [editAge, setEditAge] = useState(state.childAge);
  const [editAvatar, setEditAvatar] = useState(state.childAvatar);
  const { user } = useSupabaseAuth();
  const { getUserStats } = useSupabaseData(user?.id);
  const [accountStats, setAccountStats] = useState<{
    daysActive: number;
    totalSessions: number;
    memberSince: string | null;
  } | null>(null);

  // Load account stats from database
  useEffect(() => {
    if (user) {
      getUserStats().then(result => {
        if (result.data) {
          setAccountStats({
            daysActive: result.data.days_active || 0,
            totalSessions: Number(result.data.total_sessions) || 0,
            memberSince: result.data.member_since || null,
          });
        }
      }).catch(error => {
        console.error('Failed to load account stats:', error);
      });
    }
  }, [user, getUserStats]);

  const handleSaveProfile = () => {
    onUpdateChildProfile(editName, editAge, editAvatar, state.childGender);
  };

  const accountAge = state.registeredAt 
    ? Math.floor((Date.now() - new Date(state.registeredAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Check if current avatar is a valid mascot type
  const isValidMascotAvatar = AVATAR_MASCOT_TYPES.includes(editAvatar as MascotType);
  const selectedAvatarType = isValidMascotAvatar ? (editAvatar as MascotType) : 'panda';

  return (
    <div className="space-y-6">
      {/* Hero Profile Block */}
      <BentoCard variant="hero" className="overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Large Avatar */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
            <AnimatedMascot
              type={selectedAvatarType}
              animated
              wiggle
            />
          </div>
          
          {/* Profile Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
              {state.childName || 'Little Learner'}
            </h2>
            <p className="text-muted-foreground mb-4">
              Age {state.childAge} • Playing for {accountStats?.daysActive ?? accountAge} days
            </p>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <button 
                onClick={() => document.getElementById('edit-name-input')?.focus()}
                className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => document.getElementById('avatar-selection')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-full text-sm font-medium hover:bg-muted/70 transition-colors"
              >
                Change Avatar
              </button>
            </div>
          </div>
        </div>
      </BentoCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatWidget
          icon={Calendar}
          label="Member Since"
          value={accountStats?.memberSince
            ? new Date(accountStats.memberSince).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : state.registeredAt
            ? new Date(state.registeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Today'}
        />
        <StatWidget
          mascotType="star"
          label="Days Active"
          value={accountStats?.daysActive ?? accountAge}
        />
        <StatWidget
          mascotType="apple"
          label="Total Sessions"
          value={accountStats?.totalSessions ?? state.sessionHistory.length}
        />
      </div>

      {/* Child Profile Edit */}
      <BentoCard>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <div className="w-8 h-8">
            <AnimatedMascot type="panda" animated />
          </div>
          <span>Edit Profile</span>
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Name</label>
            <input
              id="edit-name-input"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-input rounded-xl focus:border-primary outline-none bg-background transition-colors"
              maxLength={20}
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
              className="w-full px-4 py-3 border-2 border-input rounded-xl focus:border-primary outline-none bg-background transition-colors"
            />
          </div>

          {state.childGender && (
            <div>
              <label className="block text-sm font-bold mb-2">Gender</label>
              <div className="px-4 py-3 border-2 border-input rounded-xl bg-muted/50 text-muted-foreground capitalize">
                {state.childGender.replace('-', ' ')}
              </div>
            </div>
          )}

          <div id="avatar-selection">
            <label className="block text-sm font-bold mb-3">Choose Avatar</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {AVATAR_MASCOT_TYPES.map((avatarType) => (
                <button
                  key={avatarType}
                  onClick={() => setEditAvatar(avatarType)}
                  className={`p-3 rounded-2xl transition-all ${
                    selectedAvatarType === avatarType
                      ? 'bg-primary/20 ring-2 ring-primary ring-offset-2 scale-110'
                      : 'bg-muted hover:bg-muted/70 hover:scale-105'
                  }`}
                >
                  <div className="w-12 h-12 mx-auto">
                    <AnimatedMascot
                      type={avatarType}
                      animated={selectedAvatarType === avatarType}
                      wiggle={selectedAvatarType === avatarType}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
          >
            Save Profile
          </button>
        </div>
      </BentoCard>

      {/* Parent/Guardian Info */}
      {(state.parentEmail || state.parentRelationship) && (
        <BentoCard>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
            <div className="w-8 h-8">
              <AnimatedMascot type="bear" animated />
            </div>
            <span>Parent/Guardian</span>
          </h3>
          <div className="space-y-3">
            {state.parentEmail && (
              <div className="flex items-center gap-3 p-4 bg-background rounded-2xl border border-border/40">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{state.parentEmail}</div>
                </div>
              </div>
            )}
            {state.parentRelationship && (
              <div className="flex items-center gap-3 p-4 bg-background rounded-2xl border border-border/40">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Relationship</div>
                  <div className="font-medium capitalize">{state.parentRelationship}</div>
                </div>
              </div>
            )}
          </div>
        </BentoCard>
      )}

      {/* Daily Goal Settings */}
      <BentoCard variant="gradient" gradientFrom="from-amber-500/10" gradientTo="to-orange-500/5">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <div className="w-8 h-8">
            <AnimatedMascot type="apple" animated />
          </div>
          <span>Daily Goal</span>
        </h3>
        
        {/* Progress Indicator */}
        <div className="mb-4 p-4 bg-background rounded-2xl border border-border/40">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Today's Progress</span>
            <span className="text-sm font-bold text-primary">
              {Math.min(state.correctAnswersCount, state.dailyGoal)} / {state.dailyGoal}
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((state.correctAnswersCount / state.dailyGoal) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold">Set Daily Target</label>
          <input
            type="number"
            value={state.dailyGoal}
            onChange={(e) => onUpdateDailyGoal(parseInt(e.target.value))}
            min="1"
            max="100"
            className="w-full px-4 py-3 border-2 border-input rounded-xl focus:border-primary outline-none bg-background transition-colors text-lg font-bold"
          />
          <p className="text-sm text-muted-foreground">
            Set how many numbers {state.childName || 'your child'} should count per day
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 20, 50].map((goal) => (
              <button
                key={goal}
                onClick={() => onUpdateDailyGoal(goal)}
                className={`py-2 rounded-xl font-bold transition-all ${
                  state.dailyGoal === goal
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-background hover:bg-muted border border-border/40'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      </BentoCard>
    </div>
  );
}
