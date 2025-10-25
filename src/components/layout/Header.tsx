import { Menu } from 'lucide-react';

interface HeaderProps {
  stars: number;
  onMenuClick: () => void;
}

export function Header({ stars, onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-purple-600">Counting Fun!</h1>
        <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
          <span className="text-xl">⭐</span>
          <span className="font-bold text-lg">{stars}</span>
        </div>
      </div>
      <button
        onClick={onMenuClick}
        className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center hover:bg-purple-200 transition-colors"
      >
        <Menu className="h-6 w-6 text-purple-600" />
      </button>
    </header>
  );
}
