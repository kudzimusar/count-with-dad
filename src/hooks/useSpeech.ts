import { useCallback } from 'react';
import { VoiceSettings } from '@/types';

export function useSpeech(settings?: VoiceSettings) {
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = settings?.rate || 0.9;
      utterance.pitch = settings?.pitch || 1.2;
      utterance.volume = 1.0;
      
      const voices = speechSynthesis.getVoices();
      const childVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Female') ||
        voice.name.includes('Samantha')
      );
      
      if (childVoice) {
        utterance.voice = childVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  }, [settings]);

  return { speak };
}
