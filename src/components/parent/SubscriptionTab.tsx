import { AppState } from '@/types';
import { Crown, Check, Lock, CreditCard, AlertTriangle, Timer, FlaskConical, Info } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { BentoCard } from './widgets';
import { AnimatedMascot } from '@/components/mascots/AnimatedMascot';

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
      <BentoCard variant="gradient" gradientFrom="from-amber-400/20" gradientTo="to-orange-400/10" className="border-2 border-amber-500/30">
        <div className="flex items-center justify-center gap-4">
          <div className="w-10 h-10">
            <AnimatedMascot type="cookie" animated wiggle />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground">TEST MODE ACTIVE</h3>
            <p className="text-sm text-muted-foreground font-medium">
              Free premium access for testing • 30-day trial period
            </p>
          </div>
          <div className="w-10 h-10">
            <AnimatedMascot type="cookie" animated wiggle />
          </div>
        </div>
      </BentoCard>

      {/* Current Plan Status */}
      <BentoCard variant={isPremium ? 'hero' : 'default'}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Crown className={`h-6 w-6 ${isPremium ? 'text-primary' : 'text-muted-foreground'}`} />
            <div>
              <h3 className="text-xl font-bold">Current Plan</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {state.subscriptionStatus} {isTrial && '(Trial Active)'}
              </p>
              {isPremium && daysRemaining !== null && (
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1 flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  {daysRemaining} days remaining in test trial
                </p>
              )}
            </div>
          </div>
          {isPremium && (
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
              <div className="w-5 h-5">
                <AnimatedMascot type="star" animated />
              </div>
              Premium
            </div>
          )}
        </div>

        {!isPremium && (
          <p className="text-muted-foreground mb-4">
            Upgrade to premium to unlock all games, puzzles, and math activities!
          </p>
        )}

        {isPremium && (
          <div className="bg-background p-4 rounded-2xl border border-border/40">
            <p className="text-sm font-medium flex items-center gap-2">
              <div className="w-5 h-5">
                <AnimatedMascot type="banana" animated />
              </div>
              Thank you for testing premium features!
            </p>
            <p className="text-xs text-muted-foreground mt-1 ml-7">
              This is a mock subscription for testing purposes. Downgrade anytime to test the free experience.
            </p>
          </div>
        )}
      </BentoCard>

      {/* Feature Comparison */}
      <BentoCard className="p-0 overflow-hidden">
        <div className="grid grid-cols-2">
          <div className="p-4 text-center font-bold border-r border-b border-border/40 bg-muted/30">
            Free Plan
          </div>
          <div className="p-4 text-center font-bold border-b border-border/40 bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center gap-2">
            Premium Plan
            <div className="w-5 h-5">
              <AnimatedMascot type="star" animated />
            </div>
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
          <div key={index} className="grid grid-cols-2 border-t border-border/40">
            <div className="p-4 border-r border-border/40">
              <div className="flex items-center gap-2">
                {item.free ? (
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                )}
                <span className="text-sm">{item.feature}</span>
              </div>
            </div>
            <div className="p-4 bg-primary/5">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{item.feature}</span>
              </div>
            </div>
          </div>
        ))}
      </BentoCard>

      {/* Upgrade Button */}
      {!isPremium && (
        <>
          {!user && (
            <BentoCard variant="gradient" gradientFrom="from-amber-500/10" gradientTo="to-yellow-500/5" className="border-2 border-amber-300/40">
              <p className="text-sm text-foreground flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Account Required:</strong> Please create an account in the "Account" tab before subscribing to premium features.
                </span>
              </p>
            </BentoCard>
          )}
          <button
            onClick={onUpgrade}
            disabled={!user}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
              user 
                ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:shadow-xl hover:scale-[1.02]'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
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
          className="w-full py-3 rounded-2xl font-bold text-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-all shadow flex items-center justify-center gap-2"
        >
          <AlertTriangle className="h-5 w-5" />
          Downgrade to Free (Testing)
        </button>
      )}

      {/* Test Mode Information */}
      <BentoCard variant="gradient" gradientFrom="from-blue-500/10" gradientTo="to-cyan-500/5" className="border-2 border-blue-300/30">
        <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <div className="w-6 h-6">
            <AnimatedMascot type="blueberry" animated />
          </div>
          Testing Subscription Flow
        </h4>
        <ul className="text-sm text-muted-foreground space-y-2 ml-8">
          <li className="flex items-start gap-2">
            <FlaskConical className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span><strong>Mock Payment:</strong> Simulates Google Play checkout flow</span>
          </li>
          <li className="flex items-start gap-2">
            <Timer className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span><strong>30-Day Trial:</strong> Test expiration logic and reminders</span>
          </li>
          <li className="flex items-start gap-2">
            <Lock className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span><strong>Free Downgrade:</strong> Test locked features again anytime</span>
          </li>
          <li className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span><strong>Database Synced:</strong> Subscription status saved to cloud</span>
          </li>
        </ul>
      </BentoCard>

      {/* Support */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Need help? Contact us at <a href="mailto:kudzimusar@gmail.com" className="text-primary hover:underline">kudzimusar@gmail.com</a></p>
      </div>
    </div>
  );
}
