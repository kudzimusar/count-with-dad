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
    <div className="math-mode-selector p-2 sm:p-4 md:p-8 pb-safe">
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-primary mb-1 sm:mb-2">
          Choose Your Math Adventure!
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Age {userAge} • All games available at your level
        </p>
      </div>

      {/* Category Filter - Scrollable on mobile */}
      <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold whitespace-nowrap transition-colors text-sm sm:text-base ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Mode Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
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
      className={`relative p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl transition-all duration-300 ${
        isUnlocked
          ? isConceptual
            ? 'bg-gradient-to-br from-amber-50 to-orange-50 hover:scale-[1.02] sm:hover:scale-105 cursor-pointer border-2 border-amber-200'
            : 'bg-gradient-to-br from-blue-50 to-purple-50 hover:scale-[1.02] sm:hover:scale-105 cursor-pointer'
          : 'bg-muted opacity-60 cursor-not-allowed'
      }`}
    >
      {/* Lock Overlay for Prerequisites */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-10 rounded-2xl sm:rounded-3xl z-10">
          <Lock className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground mb-1 sm:mb-2" />
          <p className="text-xs sm:text-sm text-foreground text-center px-2 sm:px-4">{unlockReason}</p>
        </div>
      )}

      {/* Conceptual Mode Badge */}
      {isConceptual && isUnlocked && (
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-amber-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          Explore
        </div>
      )}

      {/* Mode Icon */}
      <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4 text-center">{mode.icon}</div>

      {/* Mode Name (Age-specific) */}
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-1 sm:mb-2 text-foreground">
        {displayName}
      </h3>

      {/* Description (Age-specific) */}
      <p className="text-xs sm:text-sm text-muted-foreground text-center mb-2 sm:mb-4 line-clamp-2">
        {description}
      </p>

      {/* Age Level Badge */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-4">
        <span className="bg-primary/10 text-primary px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold">
          Age {userAge} Level
        </span>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map(dot => (
            <div
              key={dot}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                dot <= difficultyLevel ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      {isUnlocked && currentLevel > 0 && (
        <div className="mb-2 sm:mb-4">
          <div className="flex justify-between text-xs sm:text-sm mb-0.5 sm:mb-1">
            <span className="font-semibold text-foreground">Level {currentLevel}/{totalLevels}</span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 sm:h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-primary h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Stars Earned */}
      {isUnlocked && starsEarned > 0 && (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-4">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" />
          <span className="font-bold text-base sm:text-lg text-foreground">{starsEarned}</span>
        </div>
      )}

      {/* Completion Badge */}
      {currentLevel === totalLevels && (
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-green-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-sm font-bold flex items-center gap-1">
          <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
          Complete!
        </div>
      )}

      {/* Learning Outcome Tooltip */}
      {ageVariant?.learningOutcome && (
        <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-border">
          <p className="text-[10px] sm:text-xs text-muted-foreground text-center italic">
            🎯 {ageVariant.learningOutcome}
          </p>
        </div>
      )}
    </div>
  );
}
