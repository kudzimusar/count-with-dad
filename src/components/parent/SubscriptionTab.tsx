import { AppState } from '@/types';
import { Crown, Check, Lock, CreditCard } from 'lucide-react';

interface SubscriptionTabProps {
  state: AppState;
  onUpgrade: () => void;
}

export function SubscriptionTab({ state, onUpgrade }: SubscriptionTabProps) {
  const isPremium = state.subscriptionStatus === 'premium';
  const isTrial = state.subscriptionStatus === 'trial';

  return (
    <div className="space-y-6">
      {/* Current Plan Status */}
      <div className={`p-6 rounded-xl border-2 ${
        isPremium 
          ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300' 
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
          <div className="bg-white/80 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700">
              Thank you for being a premium member! 🎉
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Manage your subscription through your account settings or app store.
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
        <button
          onClick={onUpgrade}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <CreditCard className="h-5 w-5" />
          Upgrade to Premium
        </button>
      )}

      {/* Placeholder Information */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <span className="text-xl">ℹ️</span>
          Payment Integration Coming Soon
        </h4>
        <p className="text-sm text-blue-800">
          Subscription management will be integrated with Google Play Billing and Apple App Store. 
          For now, premium features can be tested by changing the subscription status in the database.
        </p>
      </div>

      {/* Support */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Need help? Contact us at <a href="mailto:support@example.com" className="text-primary hover:underline">support@example.com</a></p>
      </div>
    </div>
  );
}
