interface ProgressTrackerProps {
  current: number;
  target: number;
  label: string;
}

export function ProgressTracker({ current, target, label }: ProgressTrackerProps) {
  const progress = Math.min((current / target) * 100, 100);
  const remaining = Math.max(target - current, 0);
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="text-xs font-bold text-purple-600">
          {remaining > 0 ? `${remaining} more to unlock!` : '🎉 Unlocked!'}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-xs text-center mt-1 text-gray-600">
        {current} / {target}
      </div>
    </div>
  );
}
