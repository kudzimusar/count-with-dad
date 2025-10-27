import { AppState } from '@/types';
import { Crown, Check, Lock, CreditCard, AlertTriangle } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface SubscriptionTabProps {
  state: AppState;
  onUpgrade: () => void;
  onDowngrade?: () => void;
}

export function SubscriptionTab({ state, onUpgrade, onDowngrade }: SubscriptionTabProps) {
  const { user } = useSupabaseAuth();
  const isPremium = state.subscriptionStatus === 'premium';
  const isTrial = state.subscriptionStatus === 'trial';

  // Calculate days remaining if premium/trial
  const daysRemaining = state.trialStartedAt 
    ? Math.max(0, Math.ceil((new Date(state.trialStartedAt).getTime() + 30 * 24 * 60 * 60 * 1000 - Date.now()) / (24 * 60 * 60 * 1000)))
    : null;

  return (
    <div className="space-y-6">
      {/* TEST MODE Banner */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 border-4 border-yellow-600 rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">🧪</span>
          <div className="text-center">
            <h3 className="text-xl font-bold text-black">TEST MODE ACTIVE</h3>
            <p className="text-sm text-black/80 font-medium">
              Free premium access for testing • 30-day trial period
            </p>
          </div>
          <span className="text-3xl">🧪</span>
        </div>
      </div>
      {/* Current Plan Status */}
      <div className={`p-6 rounded-xl border-2 ${
        isPremium 
          ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-300 dark:border-purple-600' 
          : 'bg-muted/50 border-border'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Crown className={`h-6 w-6 ${isPremium ? 'text-purple-600' : 'text-muted-foreground'}`} />
            <div>
              <h3 className="text-xl font-bold">Current Plan</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {state.subscriptionStatus} {isTrial && '(Trial Active)'}
              </p>
              {isPremium && daysRemaining !== null && (
                <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mt-1">
                  ⏳ {daysRemaining} days remaining in test trial
                </p>
              )}
            </div>
          </div>
          {isPremium && (
            <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold">
              ⭐ Premium
            </div>
          )}
        </div>

        {!isPremium && (
          <p className="text-muted-foreground mb-4">
            Upgrade to premium to unlock all games, puzzles, and math activities!
          </p>
        )}

        {isPremium && (
          <div className="bg-white/80 dark:bg-white/10 p-4 rounded-lg">
            <p className="text-sm font-medium">
              Thank you for testing premium features! 🎉
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This is a mock subscription for testing purposes. Downgrade anytime to test the free experience.
            </p>
          </div>
        )}
      </div>

      {/* Feature Comparison */}
      <div className="bg-background rounded-xl border-2 border-border overflow-hidden">
        <div className="grid grid-cols-2 bg-muted/50">
          <div className="p-4 text-center font-bold border-r border-border">
            Free Plan
          </div>
          <div className="p-4 text-center font-bold bg-gradient-to-r from-purple-100 to-pink-100">
            Premium Plan ⭐
          </div>
        </div>

        {[
          { feature: 'Count in Order Mode', free: true, premium: true },
          { feature: 'First 3 Puzzle Levels', free: true, premium: true },
          { feature: 'First 3 Math Levels', free: true, premium: true },
          { feature: 'Voice Guidance', free: true, premium: true },
          { feature: 'Progress Tracking', free: true, premium: true },
          { feature: 'Number Challenge Mode', free: false, premium: true },
          { feature: 'All 10 Puzzle Levels', free: false, premium: true },
          { feature: 'All 10 Math Levels', free: false, premium: true },
          { feature: 'No Advertisements', free: false, premium: true },
          { feature: 'Cloud Progress Sync', free: false, premium: true },
          { feature: 'Priority Support', free: false, premium: true },
        ].map((item, index) => (
          <div key={index} className="grid grid-cols-2 border-t border-border">
            <div className="p-4 border-r border-border">
              <div className="flex items-center gap-2">
                {item.free ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-gray-300" />
                )}
                <span className="text-sm">{item.feature}</span>
              </div>
            </div>
            <div className="p-4 bg-purple-50/30">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">{item.feature}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade Button */}
      {!isPremium && (
        <>
          {!user && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-600 rounded-xl p-4 mb-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ <strong>Account Required:</strong> Please create an account in the "Account" tab before subscribing to premium features.
              </p>
            </div>
          )}
          <button
            onClick={onUpgrade}
            disabled={!user}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
              user 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow-xl'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            <CreditCard className="h-5 w-5" />
            {user ? 'Get Premium (Test)' : 'Sign In to Upgrade'}
          </button>
        </>
      )}

      {/* Downgrade Button (Test Only) */}
      {isPremium && onDowngrade && (
        <button
          onClick={onDowngrade}
          className="w-full py-3 rounded-xl font-bold text-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-all shadow flex items-center justify-center gap-2"
        >
          <AlertTriangle className="h-5 w-5" />
          Downgrade to Free (Testing)
        </button>
      )}

      {/* Test Mode Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-600 rounded-xl p-6">
        <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
          <span className="text-xl">ℹ️</span>
          Testing Subscription Flow
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <li>• <strong>Mock Payment:</strong> Simulates Google Play checkout flow</li>
          <li>• <strong>30-Day Trial:</strong> Test expiration logic and reminders</li>
          <li>• <strong>Free Downgrade:</strong> Test locked features again anytime</li>
          <li>• <strong>Database Synced:</strong> Subscription status saved to cloud</li>
        </ul>
      </div>

      {/* Support */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Need help? Contact us at <a href="mailto:support@example.com" className="text-primary hover:underline">support@example.com</a></p>
      </div>
    </div>
  );
}
