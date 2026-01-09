import { useState } from 'react';
import { MATH_MODES, checkModeUnlock, ModeDefinition } from '@/utils/mathLevels';
import { getMathAgeVariant, isConceptualMode, type MathAgeVariant } from '@/config/ageVariants';
import { Lock, Star, Trophy, Sparkles } from 'lucide-react';

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

  // ALL modes visible to ALL ages (no age filtering)
  const allModes = MATH_MODES;

  // Group by category
  const categories = ['all', 'foundation', 'operations', 'applications', 'advanced'];

  const filteredModes = selectedCategory === 'all'
    ? allModes
    : allModes.filter(m => m.category === selectedCategory);

  return (
    <div className="math-mode-selector p-4 md:p-8">
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
          Choose Your Math Adventure!
        </h1>
        <p className="text-muted-foreground">
          Age {userAge} • All games available at your level
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
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
          const ageVariant = getMathAgeVariant(mode.id, userAge);
          const conceptual = isConceptualMode(mode.id, userAge);
          const currentLevel = userProgress[mode.id] || 0;
          const starsEarned = userStars[mode.id] || 0;
          const progress = (currentLevel / mode.totalLevels) * 100;

          return (
            <ModeCard
              key={mode.id}
              mode={mode}
              ageVariant={ageVariant}
              userAge={userAge}
              isUnlocked={unlockStatus.unlocked}
              isConceptual={conceptual}
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
  ageVariant: MathAgeVariant | null;
  userAge: number;
  isUnlocked: boolean;
  isConceptual: boolean;
  unlockReason?: string;
  currentLevel: number;
  totalLevels: number;
  starsEarned: number;
  progress: number;
  onClick: () => void;
}

function ModeCard({
  mode,
  ageVariant,
  userAge,
  isUnlocked,
  isConceptual,
  unlockReason,
  currentLevel,
  totalLevels,
  starsEarned,
  progress,
  onClick
}: ModeCardProps) {
  // Use age-specific display name and description if available
  const displayName = ageVariant?.displayName || mode.displayName;
  const description = ageVariant?.description || mode.description;
  const difficultyLevel = ageVariant?.difficultyLevel || 3;

  return (
    <div
      onClick={onClick}
      className={`relative p-6 rounded-3xl shadow-xl transition-all duration-300 ${
        isUnlocked
          ? isConceptual
            ? 'bg-gradient-to-br from-amber-50 to-orange-50 hover:scale-105 cursor-pointer border-2 border-amber-200'
            : 'bg-gradient-to-br from-blue-50 to-purple-50 hover:scale-105 cursor-pointer'
          : 'bg-muted opacity-60 cursor-not-allowed'
      }`}
    >
      {/* Lock Overlay for Prerequisites */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-10 rounded-3xl z-10">
          <Lock size={48} className="text-muted-foreground mb-2" />
          <p className="text-sm text-foreground text-center px-4">{unlockReason}</p>
        </div>
      )}

      {/* Conceptual Mode Badge */}
      {isConceptual && isUnlocked && (
        <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Sparkles size={12} />
          Explore
        </div>
      )}

      {/* Mode Icon */}
      <div className="text-6xl mb-4 text-center">{mode.icon}</div>

      {/* Mode Name (Age-specific) */}
      <h3 className="text-2xl font-bold text-center mb-2 text-foreground">
        {displayName}
      </h3>

      {/* Description (Age-specific) */}
      <p className="text-sm text-muted-foreground text-center mb-4">
        {description}
      </p>

      {/* Age Level Badge */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
          Age {userAge} Level
        </span>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map(dot => (
            <div
              key={dot}
              className={`w-2 h-2 rounded-full ${
                dot <= difficultyLevel ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      {isUnlocked && currentLevel > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold text-foreground">Level {currentLevel}/{totalLevels}</span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
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
          <span className="font-bold text-lg text-foreground">{starsEarned}</span>
        </div>
      )}

      {/* Completion Badge */}
      {currentLevel === totalLevels && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
          <Trophy size={16} />
          Complete!
        </div>
      )}

      {/* Learning Outcome Tooltip */}
      {ageVariant?.learningOutcome && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center italic">
            🎯 {ageVariant.learningOutcome}
          </p>
        </div>
      )}
    </div>
  );
}
