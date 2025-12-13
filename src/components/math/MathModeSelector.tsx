import { useState, useEffect } from 'react';
import { MATH_MODES, checkModeUnlock, ModeDefinition } from '@/utils/mathLevels';
import { Lock, Star, Trophy } from 'lucide-react';

interface MathModeSelectorProps {
  userAge: number;
  userProgress: Record<string, number>;
  userStars: Record<string, number>;
  onSelectMode: (modeId: string) => void;
}

export function MathModeSelector({ 
  userAge, 
  userProgress, 
  userStars,
  onSelectMode 
}: MathModeSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter modes by age appropriateness
  const ageAppropriateModes = MATH_MODES.filter(mode =>
    userAge >= mode.ageRange[0] && userAge <= mode.ageRange[1]
  );

  // Group by category
  const categories = ['all', 'foundation', 'operations', 'applications', 'advanced'];

  const filteredModes = selectedCategory === 'all'
    ? ageAppropriateModes
    : ageAppropriateModes.filter(m => m.category === selectedCategory);

  return (
    <div className="math-mode-selector p-4 md:p-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-purple-600">
        Choose Your Math Adventure!
      </h1>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Mode Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModes.map(mode => {
          const unlockStatus = checkModeUnlock(mode.id, userProgress, userAge);
          const currentLevel = userProgress[mode.id] || 0;
          const starsEarned = userStars[mode.id] || 0;
          const progress = (currentLevel / mode.totalLevels) * 100;

          return (
            <ModeCard
              key={mode.id}
              mode={mode}
              isUnlocked={unlockStatus.unlocked}
              unlockReason={unlockStatus.reason}
              currentLevel={currentLevel}
              totalLevels={mode.totalLevels}
              starsEarned={starsEarned}
              progress={progress}
              onClick={() => unlockStatus.unlocked && onSelectMode(mode.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

interface ModeCardProps {
  mode: ModeDefinition;
  isUnlocked: boolean;
  unlockReason?: string;
  currentLevel: number;
  totalLevels: number;
  starsEarned: number;
  progress: number;
  onClick: () => void;
}

function ModeCard({
  mode,
  isUnlocked,
  unlockReason,
  currentLevel,
  totalLevels,
  starsEarned,
  progress,
  onClick
}: ModeCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative p-6 rounded-3xl shadow-xl transition-all duration-300 ${
        isUnlocked
          ? 'bg-gradient-to-br from-blue-50 to-purple-50 hover:scale-105 cursor-pointer'
          : 'bg-gray-100 opacity-60 cursor-not-allowed'
      }`}
    >
      {/* Lock Overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-10 rounded-3xl z-10">
          <Lock size={48} className="text-gray-500 mb-2" />
          <p className="text-sm text-gray-700 text-center px-4">{unlockReason}</p>
        </div>
      )}

      {/* Mode Icon */}
      <div className="text-6xl mb-4 text-center">{mode.icon}</div>

      {/* Mode Name */}
      <h3 className="text-2xl font-bold text-center mb-2 text-gray-800">
        {mode.displayName}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 text-center mb-4">
        {mode.description}
      </p>

      {/* Progress Bar */}
      {isUnlocked && currentLevel > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold">Level {currentLevel}/{totalLevels}</span>
            <span className="text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Stars Earned */}
      {isUnlocked && starsEarned > 0 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Star className="text-yellow-400" fill="currentColor" size={20} />
          <span className="font-bold text-lg">{starsEarned}</span>
        </div>
      )}

      {/* Completion Badge */}
      {currentLevel === totalLevels && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
          <Trophy size={16} />
          Complete!
        </div>
      )}

      {/* Age Range */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500">
        Ages {mode.ageRange[0]}-{mode.ageRange[1]}
      </div>
    </div>
  );
}
