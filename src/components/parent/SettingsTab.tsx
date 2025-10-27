import { AppState, VoiceSettings } from '@/types';
import { Volume2, Clock, Shield, Palette } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface SettingsTabProps {
  state: AppState;
  onSoundToggle: (enabled: boolean) => void;
  onVoiceToggle: (enabled: boolean) => void;
  onUpdateVoiceSettings: (settings: VoiceSettings) => void;
  onUpdateTimeLimit: (limit: number) => void;
}

export function SettingsTab({
  state,
  onSoundToggle,
  onVoiceToggle,
  onUpdateVoiceSettings,
  onUpdateTimeLimit,
}: SettingsTabProps) {
  return (
    <div className="space-y-6">
      {/* Audio & Voice Section */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-xl border-2 border-primary/20">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-primary" />
          Audio & Voice
        </h3>
        
        <div className="space-y-6">
          {/* Sound & Voice Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-background p-4 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="sound-effects" className="text-base font-medium">
                  Sound Effects
                </Label>
                <p className="text-sm text-muted-foreground">
                  Play sounds for correct/incorrect answers
                </p>
              </div>
              <Switch
                id="sound-effects"
                checked={state.soundEnabled}
                onCheckedChange={onSoundToggle}
              />
            </div>

            <div className="flex items-center justify-between bg-background p-4 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="voice-guidance" className="text-base font-medium">
                  Voice Guidance
                </Label>
                <p className="text-sm text-muted-foreground">
                  Spoken instructions and feedback
                </p>
              </div>
              <Switch
                id="voice-guidance"
                checked={state.voiceEnabled}
                onCheckedChange={onVoiceToggle}
              />
            </div>
          </div>

          {/* Voice Speed */}
          <div className="bg-background p-4 rounded-lg space-y-3">
            <Label htmlFor="voice-speed" className="text-base font-medium">
              Voice Speed
            </Label>
            <Slider
              id="voice-speed"
              min={0.5}
              max={1.5}
              step={0.1}
              value={[state.voiceSettings.rate]}
              onValueChange={(values) => 
                onUpdateVoiceSettings({ ...state.voiceSettings, rate: values[0] })
              }
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Slower</span>
              <span className="font-bold">{state.voiceSettings.rate.toFixed(1)}x</span>
              <span>Faster</span>
            </div>
          </div>

          {/* Voice Pitch */}
          <div className="bg-background p-4 rounded-lg space-y-3">
            <Label htmlFor="voice-pitch" className="text-base font-medium">
              Voice Pitch
            </Label>
            <Slider
              id="voice-pitch"
              min={0.5}
              max={2}
              step={0.1}
              value={[state.voiceSettings.pitch]}
              onValueChange={(values) => 
                onUpdateVoiceSettings({ ...state.voiceSettings, pitch: values[0] })
              }
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Lower</span>
              <span className="font-bold">{state.voiceSettings.pitch.toFixed(1)}</span>
              <span>Higher</span>
            </div>
          </div>
        </div>
      </div>

      {/* Time & Goals Section */}
      <div className="bg-muted/50 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Time Limits
        </h3>
        
        <div className="bg-background p-4 rounded-lg space-y-3">
          <Label htmlFor="time-limit" className="text-base font-medium">
            Session Time Limit (minutes)
          </Label>
          <input
            id="time-limit"
            type="number"
            value={state.timeLimit}
            onChange={(e) => onUpdateTimeLimit(parseInt(e.target.value) || 0)}
            min="0"
            max="120"
            className="w-full px-4 py-3 border-2 border-input rounded-lg focus:border-primary outline-none bg-background transition-colors text-lg font-bold"
          />
          <p className="text-sm text-muted-foreground">
            Set to 0 for unlimited play time. Recommended: 15-30 minutes.
          </p>
          
          {/* Quick Select Buttons */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[0, 15, 30, 60].map((minutes) => (
              <button
                key={minutes}
                onClick={() => onUpdateTimeLimit(minutes)}
                className={`py-2 rounded-lg font-bold transition-colors ${
                  state.timeLimit === minutes
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/70'
                }`}
              >
                {minutes === 0 ? '∞' : `${minutes}m`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy & Safety Section */}
      <div className="bg-muted/50 p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Privacy & Data
        </h3>
        
        <div className="space-y-3">
          <div className="bg-background p-4 rounded-lg">
            <div className="font-medium mb-1">Parent Access Code</div>
            <p className="text-sm text-muted-foreground mb-2">
              Current code: 1234 (default)
            </p>
            <button className="text-primary hover:underline text-sm font-medium">
              Change Code →
            </button>
          </div>

          <div className="bg-background p-4 rounded-lg">
            <div className="font-medium mb-1">Data Privacy</div>
            <p className="text-sm text-muted-foreground">
              All data is stored securely and never shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
