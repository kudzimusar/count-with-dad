interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CelebrationModal({ isOpen, onClose }: CelebrationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-8 rounded-2xl text-center max-w-md w-full mx-4">
        <div className="text-6xl mb-4">🎉🎊🌟</div>
        <h3 className="text-3xl font-bold text-purple-600 mb-2">Amazing!</h3>
        <p className="text-xl mb-6">You counted to 100! You're a counting superstar!</p>
        <button
          onClick={onClose}
          className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
