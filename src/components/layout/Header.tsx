import { useState, useEffect, useMemo } from 'react';
import { Menu, X, Settings } from 'lucide-react';
import { AnimatedMascot } from '@/components/mascots/AnimatedMascot';
import { MascotType } from '@/config/mascotCharacters';

interface HeaderProps {
  stars: number;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onParentZoneClick: () => void;
  childName?: string;
}

// Available mascots for the greeter
const GREETER_MASCOTS: MascotType[] = ['apple', 'banana', 'blueberry', 'star', 'cookie', 'orange'];

export function Header({ stars, menuOpen, onMenuToggle, onParentZoneClick, childName }: HeaderProps) {
  // Pick a random greeter mascot that persists for the session
  const greeterMascot = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * GREETER_MASCOTS.length);
    return GREETER_MASCOTS[randomIndex];
  }, []);

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-md py-4 px-6 flex justify-between items-center relative z-10">
      <div className="flex items-center gap-3">
        {/* Greeter Mascot */}
        <div className="flex-shrink-0">
          <AnimatedMascot 
            type={greeterMascot} 
            animated={true} 
            className="w-10 h-10 md:w-12 md:h-12"
          />
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold text-primary">
            {childName ? `Hi, ${childName}!` : 'Counting Fun!'}
          </h1>
          {childName && (
            <span className="text-xs text-muted-foreground hidden sm:block">
              Let's learn together! 🌟
            </span>
          )}
        </div>
        
        {/* Star Counter */}
        <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200 ml-2">
          <AnimatedMascot 
            type="star" 
            animated={true} 
            className="w-5 h-5"
          />
          <span className="font-bold text-lg text-yellow-700">{stars}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={onParentZoneClick}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          title="Parent Zone"
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
        </button>
        <button
          onClick={onMenuToggle}
          className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
        >
          {menuOpen ? (
            <X className="h-6 w-6 text-primary" />
          ) : (
            <Menu className="h-6 w-6 text-primary" />
          )}
        </button>
      </div>
    </header>
  );
}
