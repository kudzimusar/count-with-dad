import { useState } from 'react';
import { AppState } from '@/types';
import { User, Target, Calendar, Mail, Users } from 'lucide-react';

interface ProfileTabProps {
  state: AppState;
  onUpdateChildProfile: (name: string, age: number, avatar: string, gender?: string) => void;
  onUpdateDailyGoal: (goal: number) => void;
}

const avatars = ['👦', '👧', '🧒', '👶', '🐻', '🐶', '🐱', '🦁', '🐼', '🐨', '🦊', '🐯', '🐰', '🐸'];

export function ProfileTab({ state, onUpdateChildProfile, onUpdateDailyGoal }: ProfileTabProps) {
  const [editName, setEditName] = useState(state.childName);
  const [editAge, setEditAge] = useState(state.childAge);
  const [editAvatar, setEditAvatar] = useState(state.childAvatar);

  const handleSaveProfile = () => {
    onUpdateChildProfile(editName, editAge, editAvatar, state.childGender);
  };

  const accountAge = state.registeredAt 
    ? Math.floor((Date.now() - new Date(state.registeredAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-6">
      {/* Child Profile */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-xl border-2 border-primary/20">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Child Profile
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-input rounded-lg focus:border-primary outline-none bg-background transition-colors"
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
              className="w-full px-4 py-3 border-2 border-input rounded-lg focus:border-primary outline-none bg-background transition-colors"
            />
          </div>

          {state.childGender && (
            <div>
              <label className="block text-sm font-bold mb-2">Gender</label>
              <div className="px-4 py-3 border-2 border-input rounded-lg bg-muted/50 text-muted-foreground capitalize">
                {state.childGender.replace('-', ' ')}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-2">Avatar</label>
            <div className="grid grid-cols-7 gap-2">
              {avatars.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setEditAvatar(avatar)}
                  className={`text-3xl p-3 rounded-lg transition-all ${
                    editAvatar === avatar
                      ? 'bg-primary/20 ring-2 ring-primary scale-110'
                      : 'bg-muted hover:bg-muted/70'
                  }`}
                >
                  {avatar}
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
      </div>

      {/* Account Information */}
      <div className="bg-muted/50 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Account Information
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-background rounded-lg">
            <span className="text-muted-foreground">Member Since</span>
            <span className="font-bold">
              {state.registeredAt 
                ? new Date(state.registeredAt).toLocaleDateString()
                : 'Just now'}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-background rounded-lg">
            <span className="text-muted-foreground">Days Active</span>
            <span className="font-bold">{accountAge} days</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-background rounded-lg">
            <span className="text-muted-foreground">Total Sessions</span>
            <span className="font-bold">{state.sessionHistory.length}</span>
          </div>
        </div>
      </div>

      {/* Parent/Guardian Info */}
      {(state.parentEmail || state.parentRelationship) && (
        <div className="bg-muted/50 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Parent/Guardian Information
          </h3>
          <div className="space-y-3">
            {state.parentEmail && (
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{state.parentEmail}</div>
                </div>
              </div>
            )}
            {state.parentRelationship && (
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Relationship</div>
                  <div className="font-medium capitalize">{state.parentRelationship}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Daily Goal Settings */}
      <div className="bg-muted/50 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Daily Goal
        </h3>
        <div className="space-y-3">
          <input
            type="number"
            value={state.dailyGoal}
            onChange={(e) => onUpdateDailyGoal(parseInt(e.target.value))}
            min="1"
            max="100"
            className="w-full px-4 py-3 border-2 border-input rounded-lg focus:border-primary outline-none bg-background transition-colors text-lg font-bold"
          />
          <p className="text-sm text-muted-foreground">
            Set how many numbers {state.childName} should count per day
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 20, 50].map((goal) => (
              <button
                key={goal}
                onClick={() => onUpdateDailyGoal(goal)}
                className={`py-2 rounded-lg font-bold transition-colors ${
                  state.dailyGoal === goal
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
