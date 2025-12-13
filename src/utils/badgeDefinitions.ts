import { Badge } from '@/types/badges';

export const BADGES: Badge[] = [
  // Skill Badges
  {
    id: 'counting_pro',
    badgeId: 'counting_pro',
    name: 'Counting Pro',
    description: 'Complete Counting 1-100 mode',
    icon: '🔢',
    category: 'skill',
    criteria: { type: 'mode_complete', modeId: 'counting-1-100' },
    isHidden: false,
    rarity: 'common'
  },
  {
    id: 'addition_master',
    badgeId: 'addition_master',
    name: 'Addition Master',
    description: 'Complete all Addition Foundation levels',
    icon: '➕',
    category: 'skill',
    criteria: { type: 'mode_complete', modeId: 'addition-basic' },
    isHidden: false,
    rarity: 'common'
  },
  {
    id: 'subtraction_star',
    badgeId: 'subtraction_star',
    name: 'Subtraction Star',
    description: 'Complete all Subtraction levels',
    icon: '➖',
    category: 'skill',
    criteria: { type: 'mode_complete', modeId: 'subtraction-basic' },
    isHidden: false,
    rarity: 'common'
  },
  {
    id: 'multiplication_whiz',
    badgeId: 'multiplication_whiz',
    name: 'Multiplication Whiz',
    description: 'Master multiplication tables',
    icon: '✖️',
    category: 'skill',
    criteria: { type: 'mode_complete', modeId: 'multiplication-basic' },
    isHidden: false,
    rarity: 'rare'
  },
  {
    id: 'division_detective',
    badgeId: 'division_detective',
    name: 'Division Detective',
    description: 'Solve all division challenges',
    icon: '➗',
    category: 'skill',
    criteria: { type: 'mode_complete', modeId: 'division-basic' },
    isHidden: false,
    rarity: 'rare'
  },
  {
    id: 'pattern_expert',
    badgeId: 'pattern_expert',
    name: 'Pattern Expert',
    description: 'Complete Shape & Pattern Recognition',
    icon: '🎯',
    category: 'skill',
    criteria: { type: 'mode_complete', modeId: 'shapes' },
    isHidden: false,
    rarity: 'common'
  },
  {
    id: 'time_teller',
    badgeId: 'time_teller',
    name: 'Time Teller',
    description: 'Master telling time',
    icon: '⏰',
    category: 'skill',
    criteria: { type: 'mode_complete', modeId: 'time' },
    isHidden: false,
    rarity: 'common'
  },
  {
    id: 'money_manager',
    badgeId: 'money_manager',
    name: 'Money Manager',
    description: 'Complete Money & Value mode',
    icon: '💰',
    category: 'skill',
    criteria: { type: 'mode_complete', modeId: 'money' },
    isHidden: false,
    rarity: 'common'
  },
  {
    id: 'measurement_maestro',
    badgeId: 'measurement_maestro',
    name: 'Measurement Maestro',
    description: 'Master measurement concepts',
    icon: '📏',
    category: 'skill',
    criteria: { type: 'mode_complete', modeId: 'measurement' },
    isHidden: false,
    rarity: 'common'
  },
  {
    id: 'place_value_pro',
    badgeId: 'place_value_pro',
    name: 'Place Value Pro',
    description: 'Understand tens and ones',
    icon: '🧮',
    category: 'skill',
    criteria: { type: 'mode_complete', modeId: 'place-value' },
    isHidden: false,
    rarity: 'rare'
  },

  // Performance Badges
  {
    id: 'speed_thinker',
    badgeId: 'speed_thinker',
    name: 'Speed Thinker',
    description: 'Answer 10 questions in under 30 seconds',
    icon: '⚡',
    category: 'performance',
    criteria: { type: 'speed', speedTarget: 20 },
    isHidden: false,
    rarity: 'rare'
  },
  {
    id: 'perfect_streak',
    badgeId: 'perfect_streak',
    name: 'Perfect Streak',
    description: 'Get 20 correct answers in a row',
    icon: '🎖️',
    category: 'performance',
    criteria: { type: 'streak', streakTarget: 20 },
    isHidden: false,
    rarity: 'epic'
  },
  {
    id: 'accuracy_ace',
    badgeId: 'accuracy_ace',
    name: 'Accuracy Ace',
    description: 'Maintain 95% accuracy over 50 problems',
    icon: '🎯',
    category: 'performance',
    criteria: { type: 'accuracy_threshold', accuracyTarget: 0.95 },
    isHidden: false,
    rarity: 'epic'
  },

  // Milestone Badges
  {
    id: 'bronze_scholar',
    badgeId: 'bronze_scholar',
    name: 'Bronze Scholar',
    description: 'Earn 10 total stars',
    icon: '🥉',
    category: 'milestone',
    criteria: { type: 'total_stars', starTarget: 10 },
    isHidden: false,
    rarity: 'common'
  },
  {
    id: 'silver_scholar',
    badgeId: 'silver_scholar',
    name: 'Silver Scholar',
    description: 'Earn 50 total stars',
    icon: '🥈',
    category: 'milestone',
    criteria: { type: 'total_stars', starTarget: 50 },
    isHidden: false,
    rarity: 'rare'
  },
  {
    id: 'gold_scholar',
    badgeId: 'gold_scholar',
    name: 'Gold Scholar',
    description: 'Earn 100 total stars',
    icon: '🥇',
    category: 'milestone',
    criteria: { type: 'total_stars', starTarget: 100 },
    isHidden: false,
    rarity: 'epic'
  },
  {
    id: 'diamond_scholar',
    badgeId: 'diamond_scholar',
    name: 'Diamond Scholar',
    description: 'Earn 250 total stars',
    icon: '💎',
    category: 'milestone',
    criteria: { type: 'total_stars', starTarget: 250 },
    isHidden: false,
    rarity: 'legendary'
  },
  {
    id: 'math_champion',
    badgeId: 'math_champion',
    name: 'Math Champion',
    description: 'Complete all age-appropriate modes',
    icon: '👑',
    category: 'milestone',
    criteria: { type: 'multi_condition', conditions: [] },
    isHidden: false,
    rarity: 'legendary'
  },

  // Streak Badges
  {
    id: 'daily_learner',
    badgeId: 'daily_learner',
    name: 'Daily Learner',
    description: 'Practice 7 days in a row',
    icon: '📚',
    category: 'streak',
    criteria: { type: 'streak', streakTarget: 7 },
    isHidden: false,
    rarity: 'common'
  },
  {
    id: 'two_week_warrior',
    badgeId: 'two_week_warrior',
    name: 'Two Week Warrior',
    description: 'Practice 14 days in a row',
    icon: '🔥',
    category: 'streak',
    criteria: { type: 'streak', streakTarget: 14 },
    isHidden: false,
    rarity: 'rare'
  },
  {
    id: 'month_master',
    badgeId: 'month_master',
    name: 'Month Master',
    description: 'Practice 30 days in a row',
    icon: '🌟',
    category: 'streak',
    criteria: { type: 'streak', streakTarget: 30 },
    isHidden: false,
    rarity: 'epic'
  },

  // Surprise Badges (hidden)
  {
    id: 'comeback_kid',
    badgeId: 'comeback_kid',
    name: 'Comeback Kid',
    description: 'Retry a failed level and score 100%',
    icon: '🦸',
    category: 'surprise',
    criteria: { type: 'multi_condition', conditions: [] },
    isHidden: true,
    rarity: 'rare'
  },
  {
    id: 'team_player',
    badgeId: 'team_player',
    name: 'Team Player',
    description: 'Parent joins for 5 sessions',
    icon: '🤝',
    category: 'surprise',
    criteria: { type: 'multi_condition', conditions: [] },
    isHidden: true,
    rarity: 'rare'
  },
  {
    id: 'early_bird',
    badgeId: 'early_bird',
    name: 'Early Bird',
    description: 'Complete a session before 8 AM',
    icon: '🌅',
    category: 'surprise',
    criteria: { type: 'multi_condition', conditions: [] },
    isHidden: true,
    rarity: 'common'
  },
  {
    id: 'night_owl',
    badgeId: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a session after 7 PM',
    icon: '🦉',
    category: 'surprise',
    criteria: { type: 'multi_condition', conditions: [] },
    isHidden: true,
    rarity: 'common'
  }
];

export function checkBadgeCriteria(
  badge: Badge,
  userStats: {
    completedModes: string[];
    totalStars: number;
    maxStreak: number;
    recentAccuracy: number;
    problemsPerMinute: number;
    sessionsWithParent: number;
  }
): boolean {
  const { criteria } = badge;

  switch (criteria.type) {
    case 'mode_complete':
      return userStats.completedModes.includes(criteria.modeId!);

    case 'total_stars':
      return userStats.totalStars >= criteria.starTarget!;

    case 'streak':
      return userStats.maxStreak >= criteria.streakTarget!;

    case 'accuracy_threshold':
      return userStats.recentAccuracy >= criteria.accuracyTarget!;

    case 'speed':
      return userStats.problemsPerMinute >= criteria.speedTarget!;

    case 'multi_condition':
      return false;

    default:
      return false;
  }
}

export function getEarnedBadges(
  userStats: any,
  earnedBadgeIds: string[]
): Badge[] {
  return BADGES.filter(badge => earnedBadgeIds.includes(badge.id));
}

export function getUpcomingBadges(
  userStats: any,
  earnedBadgeIds: string[]
): Array<{ badge: Badge; progress: number }> {
  return BADGES
    .filter(badge => !earnedBadgeIds.includes(badge.id) && !badge.isHidden)
    .map(badge => ({
      badge,
      progress: calculateBadgeProgress(badge, userStats)
    }))
    .filter(item => item.progress > 0)
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3);
}

function calculateBadgeProgress(badge: Badge, userStats: any): number {
  const { criteria } = badge;

  switch (criteria.type) {
    case 'total_stars':
      return Math.min(1, userStats.totalStars / criteria.starTarget!);

    case 'streak':
      return Math.min(1, userStats.maxStreak / criteria.streakTarget!);

    case 'mode_complete':
      const modeProgress = userStats.modeProgress[criteria.modeId!] || 0;
      const totalLevels = MATH_MODES.find(m => m.id === criteria.modeId)?.totalLevels || 20;
      return modeProgress / totalLevels;

    default:
      return 0;
  }
}

// Import MATH_MODES from mathLevels
import { MATH_MODES } from '@/utils/mathLevels';
