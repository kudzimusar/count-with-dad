import { useCallback } from 'react';
import { VoiceSettings } from '@/types';

export function useSpeech(settings?: VoiceSettings) {
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      // Slower rate for children — clear and friendly, not robotic
      utterance.rate = settings?.rate || 0.65;
      utterance.pitch = settings?.pitch || 1.1;
      utterance.volume = 1.0;
      
      const voices = speechSynthesis.getVoices();
      // Prefer natural-sounding voices, prioritize specific quality voices
      const childVoice = voices.find(voice => 
        voice.name.includes('Samantha') ||
        voice.name.includes('Karen') ||
        voice.name.includes('Moira')
      ) || voices.find(voice =>
        voice.name.includes('Google UK English Female') ||
        voice.name.includes('Google US English')
      ) || voices.find(voice =>
        voice.name.includes('Female') ||
        voice.lang.startsWith('en')
      );
      
      if (childVoice) {
        utterance.voice = childVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  }, [settings]);

  return { speak };
}
