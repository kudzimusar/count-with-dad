import { useState } from 'react';
import { Crown, CreditCard, Check, Loader2, X } from 'lucide-react';

interface MockPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function MockPaymentModal({ isOpen, onClose, onSuccess }: MockPaymentModalProps) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setProcessing(true);
    
    // Simulate Google Play payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setProcessing(false);
    setSuccess(true);
    
    // Show success animation then close
    setTimeout(() => {
      onSuccess();
      setSuccess(false);
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-[1001] flex justify-center items-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-background p-8 rounded-3xl max-w-md w-full mx-4 relative animate-in zoom-in-95 duration-200 border-4 border-primary"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TEST MODE Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-2 rounded-full font-bold text-sm shadow-lg border-2 border-yellow-600 flex items-center gap-2 animate-pulse">
          <span className="text-lg">🧪</span>
          TEST MODE - Free Premium
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
          disabled={processing}
        >
          <X className="h-6 w-6" />
        </button>

        {!success ? (
          <>
            <div className="text-center mb-6 mt-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                Upgrade to Premium
              </h2>
              <p className="text-muted-foreground">
                Simulating Google Play purchase flow
              </p>
            </div>

            <div className="bg-muted/50 rounded-2xl p-6 mb-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-lg font-bold">Premium Plan</span>
                <span className="text-2xl font-bold text-primary">
                  <span className="line-through text-muted-foreground text-lg mr-2">$9.99</span>
                  FREE
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>30-day trial period (testing)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>All premium features unlocked</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Can downgrade anytime for testing</span>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-600 rounded-xl p-3 mt-4">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  <strong>Test Mode:</strong> This simulates the Google Play payment flow. No real payment will be processed. Premium access will expire in 30 days for testing purposes.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePurchase}
                disabled={processing}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Confirm Purchase (Test)
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={processing}
                className="w-full bg-muted text-muted-foreground py-3 rounded-xl font-bold text-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 animate-in zoom-in-95 duration-300">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 animate-bounce">
              <Check className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              Success! 🎉
            </h3>
            <p className="text-muted-foreground">
              Premium features unlocked
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
