// Child Safety Utilities - Prevent distractions during gameplay

let lastTouchEnd = 0;
let isInitialized = false;

// Event handlers stored for cleanup
const handlers = {
  contextmenu: (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.allow-context-menu') && !target.closest('.parent-dashboard')) {
      e.preventDefault();
    }
  },
  selectstart: (e: Event) => {
    const target = e.target as HTMLElement;
    if (
      !target.closest('.allow-selection') && 
      !target.closest('.parent-dashboard') &&
      !(target instanceof HTMLInputElement) &&
      !(target instanceof HTMLTextAreaElement)
    ) {
      e.preventDefault();
    }
  },
  gesturestart: (e: Event) => e.preventDefault(),
  gesturechange: (e: Event) => e.preventDefault(),
  gestureend: (e: Event) => e.preventDefault(),
  touchend: (e: TouchEvent) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  },
};

export function setupChildSafety(): void {
  if (isInitialized) return;
  
  // Prevent context menu (right-click/long-press)
  document.addEventListener('contextmenu', handlers.contextmenu);

  // Prevent text selection
  document.addEventListener('selectstart', handlers.selectstart);

  // Prevent iOS zoom gestures
  document.addEventListener('gesturestart', handlers.gesturestart);
  document.addEventListener('gesturechange', handlers.gesturechange);
  document.addEventListener('gestureend', handlers.gestureend);

  // Prevent double-tap to zoom
  document.addEventListener('touchend', handlers.touchend, { passive: false });

  // Prevent pull-to-refresh
  document.body.style.overscrollBehavior = 'none';

  isInitialized = true;
}

export function cleanupChildSafety(): void {
  if (!isInitialized) return;

  document.removeEventListener('contextmenu', handlers.contextmenu);
  document.removeEventListener('selectstart', handlers.selectstart);
  document.removeEventListener('gesturestart', handlers.gesturestart);
  document.removeEventListener('gesturechange', handlers.gesturechange);
  document.removeEventListener('gestureend', handlers.gestureend);
  document.removeEventListener('touchend', handlers.touchend);

  document.body.style.overscrollBehavior = '';
  
  isInitialized = false;
}
