// Mascot Character Definitions
// Kawaii-style character color palettes and properties

export const MASCOT_CHARACTERS = {
  apple: {
    name: 'Apple',
    primaryColor: 'hsl(0, 85%, 65%)',
    secondaryColor: 'hsl(0, 70%, 45%)',
    highlightColor: 'hsl(0, 100%, 92%)',
    leafColor: 'hsl(140, 60%, 45%)',
    stemColor: 'hsl(25, 40%, 30%)',
  },
  banana: {
    name: 'Banana',
    primaryColor: 'hsl(48, 100%, 70%)',
    secondaryColor: 'hsl(45, 90%, 55%)',
    highlightColor: 'hsl(50, 100%, 92%)',
    tipColor: 'hsl(30, 50%, 35%)',
  },
  blueberry: {
    name: 'Blueberry',
    primaryColor: 'hsl(240, 60%, 55%)',
    secondaryColor: 'hsl(240, 50%, 40%)',
    highlightColor: 'hsl(240, 80%, 85%)',
    crownColor: 'hsl(240, 40%, 35%)',
  },
  star: {
    name: 'Star',
    primaryColor: 'hsl(45, 100%, 60%)',
    secondaryColor: 'hsl(40, 90%, 50%)',
    highlightColor: 'hsl(50, 100%, 90%)',
    glowColor: 'hsl(45, 100%, 75%)',
  },
  cookie: {
    name: 'Cookie',
    primaryColor: 'hsl(30, 60%, 55%)',
    secondaryColor: 'hsl(25, 50%, 40%)',
    highlightColor: 'hsl(35, 70%, 80%)',
    chipColor: 'hsl(20, 50%, 25%)',
  },
  orange: {
    name: 'Orange',
    primaryColor: 'hsl(25, 95%, 55%)',
    secondaryColor: 'hsl(20, 85%, 45%)',
    highlightColor: 'hsl(30, 100%, 85%)',
    leafColor: 'hsl(120, 50%, 40%)',
    stemColor: 'hsl(100, 30%, 35%)',
  },
} as const;

export type MascotType = keyof typeof MASCOT_CHARACTERS;

// Emoji to mascot type mapping for easy conversion
// Covers all emojis used in mathProblems.ts and other config files
export const EMOJI_TO_MASCOT: Record<string, MascotType> = {
  // Fruits
  '🍎': 'apple',
  '🍏': 'apple',
  '🍌': 'banana',
  '🫐': 'blueberry',
  '🍊': 'orange',
  '🟠': 'orange',
  
  // Shapes/circles - map to blueberry (round)
  '🔵': 'blueberry',
  '🟦': 'blueberry',
  '⚫': 'blueberry',
  '🟣': 'blueberry',
  
  // Stars and sparkles
  '⭐': 'star',
  '🌟': 'star',
  '✨': 'star',
  '💫': 'star',
  
  // Treats
  '🍪': 'cookie',
  
  // Fallback mappings for other common emojis
  '❌': 'star', // Used in subtraction as "take away" marker - star works as neutral
  '✅': 'star',
  '🔴': 'apple',
  '🟡': 'banana',
  '🟢': 'apple',
};

// Default fallback mascot type
export const DEFAULT_MASCOT: MascotType = 'star';

export function getMascotType(emoji: string): MascotType {
  return EMOJI_TO_MASCOT[emoji] || DEFAULT_MASCOT;
}
