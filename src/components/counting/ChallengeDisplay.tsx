interface ChallengeDisplayProps {
  challengeNumber: number;
  challengeLevel: number;
  onLevelChange: (delta: number) => void;
}

export function ChallengeDisplay({ challengeNumber, challengeLevel, onLevelChange }: ChallengeDisplayProps) {
  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-2xl shadow-lg mb-6 text-center">
      <h2 className="text-2xl font-bold text-blue-600 mb-2">Find This Number!</h2>
      <div className="text-6xl font-bold text-purple-700">{challengeNumber}</div>
      <p className="text-lg text-gray-600 mt-2">
        Tap the number <span className="font-bold">{challengeNumber}</span> on the grid!
      </p>
      <div className="mt-4">
        <span className="text-lg">Challenge Level: </span>
        <div className="flex gap-1 justify-center items-center">
          <button
            onClick={() => onLevelChange(-1)}
            disabled={challengeLevel <= 1}
            className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg font-bold hover:bg-blue-200 disabled:opacity-50 transition-colors"
          >
            -
          </button>
          <span className="font-bold text-xl w-8 text-center">{challengeLevel}</span>
          <button
            onClick={() => onLevelChange(1)}
            disabled={challengeLevel >= 10}
            className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg font-bold hover:bg-blue-200 disabled:opacity-50 transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
