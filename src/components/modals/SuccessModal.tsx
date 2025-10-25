interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  icon: string;
  color: string;
}

export function SuccessModal({ isOpen, onClose, title, message, icon, color }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-8 rounded-2xl text-center max-w-md w-full mx-4">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className={`text-3xl font-bold ${color} mb-2`}>{title}</h3>
        <p className="text-xl mb-6">{message}</p>
        <button
          onClick={onClose}
          className={`${color.replace('text', 'bg')} text-white px-6 py-3 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
