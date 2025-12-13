export interface Badge {
  id: string;
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  category: 'skill' | 'performance' | 'milestone' | 'surprise' | 'streak';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  criteria: BadgeCriteria;
  isHidden: boolean;
}

export interface BadgeCriteria {
  type: 'mode_complete' | 'accuracy_threshold' | 'streak' | 'speed' | 'total_stars' | 'multi_condition';
  modeId?: string;
  accuracyTarget?: number;
  streakTarget?: number;
  speedTarget?: number;
  starTarget?: number;
  conditions?: BadgeCriteria[];
}

export interface UserBadge {
  userId: string;
  badgeId: string;
  earnedAt: Date;
}
