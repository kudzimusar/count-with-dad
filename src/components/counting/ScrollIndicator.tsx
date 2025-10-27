interface ScrollIndicatorProps {
  visible: boolean;
}

export function ScrollIndicator({ visible }: ScrollIndicatorProps) {
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 animate-bounce z-10">
      <div className="bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
        <span className="text-lg font-bold">More numbers below!</span>
        <span className="text-2xl">👇</span>
      </div>
    </div>
  );
}
