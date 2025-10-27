import { Sparkles, Lock, Star } from 'lucide-react';

interface PremiumGateProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  feature: string;
}

export function PremiumGate({ isOpen, onClose, onUpgrade, feature }: PremiumGateProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-[1000] flex justify-center items-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl max-w-md w-full mx-4 relative animate-in zoom-in-95 duration-200 border-4 border-purple-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mb-4 animate-bounce">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-purple-900 mb-2">
            Unlock Premium! 🎉
          </h2>
          <p className="text-lg text-purple-700">
            Get access to <span className="font-bold">{feature}</span> and more!
          </p>
        </div>

        <div className="bg-white/80 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Premium Includes:
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-gray-700">
                <strong>Number Challenge Mode</strong> - Test counting skills with fun challenges
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-gray-700">
                <strong>All Puzzle Levels</strong> - 10+ exciting puzzle games
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-gray-700">
                <strong>All Math Levels</strong> - Advanced learning activities
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-gray-700">
                <strong>No Ads</strong> - Distraction-free learning
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-gray-700">
                <strong>Progress Sync</strong> - Save across devices
              </span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Lock className="h-5 w-5" />
            Ask Parent to Upgrade
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-lg hover:bg-gray-300 transition-colors"
          >
            Maybe Later
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          All purchases are managed securely by parents
        </p>
      </div>
    </div>
  );
}
