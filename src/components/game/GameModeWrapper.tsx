import { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

interface GameModeWrapperProps {
  children: ReactNode;
  onExit: () => void;
  totalProblems: number;
  currentProblem: number;
  showHeader?: boolean;
}

export function GameModeWrapper({
  children,
  onExit,
  totalProblems,
  currentProblem,
  showHeader = true
}: GameModeWrapperProps) {
  
  useEffect(() => {
    // Add game mode class to body
    document.body.classList.add('game-mode-active');
    
    // Lock orientation to portrait on supported devices
    const orientation = screen.orientation as ScreenOrientation & { lock?: (type: string) => Promise<void> };
    if (orientation?.lock) {
      orientation.lock('portrait').catch(() => {
        // Silently fail - not all browsers support this
      });
    }
    
    // Prevent overscroll/bounce
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overflow = 'hidden';
    
    // Try to request fullscreen (will fail silently if not allowed)
    const requestFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch {
        // Fullscreen not available or denied - continue without it
      }
    };
    
    // Only request fullscreen on user gesture (click), not automatically
    // requestFullscreen();
    
    return () => {
      // Cleanup
      document.body.classList.remove('game-mode-active');
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overflow = '';
      
      // Unlock orientation
      const orientation = screen.orientation as ScreenOrientation & { unlock?: () => void };
      if (orientation?.unlock) {
        orientation.unlock();
      }
      
      // Exit fullscreen if active
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="game-fullscreen">
      {showHeader && (
        <header className="game-header flex justify-between items-center px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10">
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalProblems }).map((_, i) => (
              <div
                key={i}
                className={`progress-dot ${i < currentProblem ? 'completed' : 'pending'}`}
              />
            ))}
          </div>
          
          {/* Exit button */}
          <button
            onClick={onExit}
            className="p-2 rounded-full hover:bg-destructive/10 transition-colors"
            aria-label="Exit game"
          >
            <X size={24} className="text-muted-foreground hover:text-destructive" />
          </button>
        </header>
      )}
      
      {/* Game content */}
      <main className="game-content">
        {children}
      </main>
    </div>
  );
}
