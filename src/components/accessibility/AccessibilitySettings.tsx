import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AccessibilitySettingsProps {
  onSettingsChange: (settings: AccessibilitySettings) => void;
}

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large';
  highContrastMode: boolean;
  voiceSpeed: number;
  sensoryFriendlyMode: boolean;
  focusMode: boolean;
}

export function AccessibilitySettings({ onSettingsChange }: AccessibilitySettingsProps) {
  const [settings, setSettings] = useLocalStorage<AccessibilitySettings>('accessibilitySettings', {
    fontSize: 'medium',
    highContrastMode: false,
    voiceSpeed: 1.0,
    sensoryFriendlyMode: false,
    focusMode: false
  });

  const handleSettingChange = (key: keyof AccessibilitySettings, value: string | number | boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="accessibility-settings p-6 bg-white rounded-2xl shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Accessibility Settings</h3>

      <div className="space-y-6">
        {/* Font Size */}
        <div>
          <label className="block text-lg font-semibold mb-2">Font Size</label>
          <div className="flex gap-3">
            {['small', 'medium', 'large'].map(size => (
              <button
                key={size}
                onClick={() => handleSettingChange('fontSize', size)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  settings.fontSize === size
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast Mode */}
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-lg font-semibold mb-1">High Contrast Mode</label>
            <p className="text-sm text-gray-600">Improves visibility for better readability</p>
          </div>
          <button
            onClick={() => handleSettingChange('highContrastMode', !settings.highContrastMode)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.highContrastMode ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <span className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${
              settings.highContrastMode ? 'translate-x-6' : ''
            }`} />
          </button>
        </div>

        {/* Voice Speed */}
        <div>
          <label className="block text-lg font-semibold mb-2">Voice Speed</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleSettingChange('voiceSpeed', Math.max(0.5, settings.voiceSpeed - 0.1))}
              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
            >
              -
            </button>
            <span className="font-semibold">{settings.voiceSpeed.toFixed(1)}x</span>
            <button
              onClick={() => handleSettingChange('voiceSpeed', Math.min(2.0, settings.voiceSpeed + 0.1))}
              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Sensory Friendly Mode */}
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-lg font-semibold mb-1">Sensory Friendly Mode</label>
            <p className="text-sm text-gray-600">Reduces animations and visual effects</p>
          </div>
          <button
            onClick={() => handleSettingChange('sensoryFriendlyMode', !settings.sensoryFriendlyMode)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.sensoryFriendlyMode ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <span className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${
              settings.sensoryFriendlyMode ? 'translate-x-6' : ''
            }`} />
          </button>
        </div>

        {/* Focus Mode */}
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-lg font-semibold mb-1">Focus Mode</label>
            <p className="text-sm text-gray-600">Minimizes distractions for better concentration</p>
          </div>
          <button
            onClick={() => handleSettingChange('focusMode', !settings.focusMode)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.focusMode ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <span className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${
              settings.focusMode ? 'translate-x-6' : ''
            }`} />
          </button>
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-8">
        <button
          onClick={() => {
            const defaultSettings: AccessibilitySettings = {
              fontSize: 'medium',
              highContrastMode: false,
              voiceSpeed: 1.0,
              sensoryFriendlyMode: false,
              focusMode: false
            };
            setSettings(defaultSettings);
            onSettingsChange(defaultSettings);
          }}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
