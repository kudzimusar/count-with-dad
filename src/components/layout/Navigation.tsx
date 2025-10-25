import { Screen } from '@/types';

interface NavigationProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

export function Navigation({ currentScreen, onScreenChange }: NavigationProps) {
  const screens: { screen: Screen; label: string }[] = [
    { screen: 'counting', label: 'Counting' },
    { screen: 'puzzle', label: 'Puzzles' },
    { screen: 'math', label: 'Math' },
  ];

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-center gap-4">
      {screens.map(({ screen, label }) => (
        <button
          key={screen}
          onClick={() => onScreenChange(screen)}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            currentScreen === screen
              ? 'bg-purple-600 text-white'
              : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
