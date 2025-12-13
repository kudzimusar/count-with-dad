import { MathGameContainer } from '../MathGameContainer';
import { VoiceSettings } from '@/types';

interface AdditionBasicProps {
  level: number;
  userId: string;
  childName?: string;
  voiceSettings: VoiceSettings;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  onComplete: (result: {
    passed: boolean;
    stars: number;
    accuracy: number;
    timeSpent: number;
  }) => void;
  onExit: () => void;
}

export function AdditionBasic({
  level,
  userId,
  childName,
  voiceSettings,
  soundEnabled,
  voiceEnabled,
  onComplete,
  onExit
}: AdditionBasicProps) {
  return (
    <MathGameContainer
      modeId="addition-basic"
      level={level}
      userId={userId}
      childName={childName}
      voiceSettings={voiceSettings}
      soundEnabled={soundEnabled}
      voiceEnabled={voiceEnabled}
      onComplete={onComplete}
      onExit={onExit}
    />
  );
}
