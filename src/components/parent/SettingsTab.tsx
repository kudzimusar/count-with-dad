import { AppState, VoiceSettings, SafetySettings } from '@/types';
import { Volume2, Clock, Shield, Baby } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { BentoCard } from './widgets';
import { AnimatedMascot } from '@/components/mascots/AnimatedMascot';

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
      <BentoCard variant="hero">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <div className="w-8 h-8">
            <AnimatedMascot type="orange" animated />
          </div>
          <span>Audio & Voice</span>
        </h3>
        
        <div className="space-y-4">
          {/* Sound & Voice Toggles - Grid on larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between bg-background p-4 rounded-2xl border border-border/40">
              <div className="space-y-0.5">
                <Label htmlFor="sound-effects" className="text-base font-medium">
                  Sound Effects
                </Label>
                <p className="text-sm text-muted-foreground">
                  Play sounds for answers
                </p>
              </div>
              <Switch
                id="sound-effects"
                checked={state.soundEnabled}
                onCheckedChange={onSoundToggle}
              />
            </div>

            <div className="flex items-center justify-between bg-background p-4 rounded-2xl border border-border/40">
              <div className="space-y-0.5">
                <Label htmlFor="voice-guidance" className="text-base font-medium">
                  Voice Guidance
                </Label>
                <p className="text-sm text-muted-foreground">
                  Spoken feedback
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
          <div className="bg-background p-4 rounded-2xl border border-border/40 space-y-3">
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
              <span className="font-bold text-foreground">{state.voiceSettings.rate.toFixed(1)}x</span>
              <span>Faster</span>
            </div>
          </div>

          {/* Voice Pitch */}
          <div className="bg-background p-4 rounded-2xl border border-border/40 space-y-3">
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
              <span className="font-bold text-foreground">{state.voiceSettings.pitch.toFixed(1)}</span>
              <span>Higher</span>
            </div>
          </div>
        </div>
      </BentoCard>

      {/* Time & Goals Section */}
      <BentoCard>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <div className="w-8 h-8">
            <AnimatedMascot type="cookie" animated />
          </div>
          <span>Time Limits</span>
        </h3>
        
        <div className="bg-background p-4 rounded-2xl border border-border/40 space-y-3">
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
            className="w-full px-4 py-3 border-2 border-input rounded-xl focus:border-primary outline-none bg-background transition-colors text-lg font-bold"
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
                className={`py-2 rounded-xl font-bold transition-all ${
                  state.timeLimit === minutes
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted hover:bg-muted/70'
                }`}
              >
                {minutes === 0 ? '∞' : `${minutes}m`}
              </button>
            ))}
          </div>
        </div>
      </BentoCard>

      {/* Child Safety & Distraction Prevention Section */}
      <BentoCard variant="gradient" gradientFrom="from-green-500/10" gradientTo="to-emerald-500/5">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <div className="w-8 h-8">
            <AnimatedMascot type="bear" animated />
          </div>
          <span>Child Safety</span>
        </h3>
        
        <SafetySettingsPanel />
      </BentoCard>

      {/* Privacy & Safety Section */}
      <BentoCard>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <div className="w-8 h-8">
            <AnimatedMascot type="blueberry" animated />
          </div>
          <span>Privacy & Data</span>
        </h3>
        
        <div className="space-y-3">
          <div className="bg-background p-4 rounded-2xl border border-border/40">
            <div className="font-medium mb-1">Parent Access Code</div>
            <p className="text-sm text-muted-foreground mb-2">
              Current code: 1234 (default)
            </p>
            <button className="text-primary hover:underline text-sm font-medium">
              Change Code →
            </button>
          </div>

          <div className="bg-background p-4 rounded-2xl border border-border/40">
            <div className="font-medium mb-1">Data Privacy</div>
            <p className="text-sm text-muted-foreground">
              All data is stored securely and never shared with third parties.
            </p>
          </div>
        </div>
      </BentoCard>
    </div>
  );
}

function SafetySettingsPanel() {
  const [settings, setSettings] = useLocalStorage<SafetySettings>('safetySettings', {
    disableZoom: true,
    disableCopy: true,
    confirmExit: true,
    orientationLock: true,
    simplifiedUI: false,
  });

  const updateSetting = (key: keyof SafetySettings, value: boolean) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between bg-background p-4 rounded-2xl border border-border/40">
        <div className="space-y-0.5">
          <Label htmlFor="disable-zoom" className="text-base font-medium">
            Disable Zooming/Pinching
          </Label>
          <p className="text-sm text-muted-foreground">
            Prevents accidental zooming during gameplay
          </p>
        </div>
        <Switch
          id="disable-zoom"
          checked={settings.disableZoom}
          onCheckedChange={(v) => updateSetting('disableZoom', v)}
        />
      </div>

      <div className="flex items-center justify-between bg-background p-4 rounded-2xl border border-border/40">
        <div className="space-y-0.5">
          <Label htmlFor="disable-copy" className="text-base font-medium">
            Disable Text Copying
          </Label>
          <p className="text-sm text-muted-foreground">
            Prevents text selection and copy/paste menus
          </p>
        </div>
        <Switch
          id="disable-copy"
          checked={settings.disableCopy}
          onCheckedChange={(v) => updateSetting('disableCopy', v)}
        />
      </div>

      <div className="flex items-center justify-between bg-background p-4 rounded-2xl border border-border/40">
        <div className="space-y-0.5">
          <Label htmlFor="confirm-exit" className="text-base font-medium">
            Exit Confirmation
          </Label>
          <p className="text-sm text-muted-foreground">
            Asks for confirmation before exiting game
          </p>
        </div>
        <Switch
          id="confirm-exit"
          checked={settings.confirmExit}
          onCheckedChange={(v) => updateSetting('confirmExit', v)}
        />
      </div>

      <div className="flex items-center justify-between bg-background p-4 rounded-2xl border border-border/40">
        <div className="space-y-0.5">
          <Label htmlFor="orientation-lock" className="text-base font-medium">
            Lock Portrait Orientation
          </Label>
          <p className="text-sm text-muted-foreground">
            Keeps game in portrait mode (mobile only)
          </p>
        </div>
        <Switch
          id="orientation-lock"
          checked={settings.orientationLock}
          onCheckedChange={(v) => updateSetting('orientationLock', v)}
        />
      </div>

      <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-xl">
        These settings help minimize distractions and keep children focused on learning.
        Text selection is always enabled in this Parent Dashboard.
      </p>
    </div>
  );
}
