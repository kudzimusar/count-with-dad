interface ProgressBarProps {
  currentNumber: number;
}

export function ProgressBar({ currentNumber }: ProgressBarProps) {
  const progress = ((currentNumber - 1) / 100) * 100;

  return (
    <div className="bg-gray-200 rounded-full h-4 mb-4">
      <div
        className="progress-bar bg-green-500 h-4 rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
