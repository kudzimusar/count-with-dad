import { useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { User, LogIn, LogOut, Mail, Lock, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { BentoCard } from './widgets';
import { AnimatedMascot } from '@/components/mascots/AnimatedMascot';

export function AccountTab() {
  const { user, loading, signUp, signIn, signOut } = useSupabaseAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created! Please check your email to verify.');
          setEmail('');
          setPassword('');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Successfully signed in!');
          setEmail('');
          setPassword('');
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed out successfully');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // User is signed in
  if (user) {
    return (
      <div className="space-y-6">
        <BentoCard variant="gradient" gradientFrom="from-green-500/10" gradientTo="to-emerald-500/5" className="border-2 border-green-300/40">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16">
              <AnimatedMascot type="panda" animated wiggle />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Welcome Back!</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <div className="bg-background rounded-2xl p-4 mb-4 border border-border/40">
            <h4 className="font-bold text-foreground mb-3">Account Benefits:</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 flex-shrink-0">
                  <AnimatedMascot type="blueberry" />
                </div>
                <span className="text-sm">Progress saved across all devices</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 flex-shrink-0">
                  <AnimatedMascot type="bear" />
                </div>
                <span className="text-sm">Manage subscriptions securely</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 flex-shrink-0">
                  <AnimatedMascot type="star" />
                </div>
                <span className="text-sm">Access detailed analytics and reports</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground py-3 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </BentoCard>

        <BentoCard variant="gradient" gradientFrom="from-blue-500/10" gradientTo="to-cyan-500/5" className="border-2 border-blue-300/30">
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <div className="w-5 h-5 flex-shrink-0 mt-0.5">
              <AnimatedMascot type="blueberry" />
            </div>
            <span>
              <strong>Auto-Save Enabled:</strong> Your child's progress is automatically saved to your account. 
              You can access it from any device by signing in.
            </span>
          </p>
        </BentoCard>
      </div>
    );
  }

  // User is not signed in - show auth form
  return (
    <div className="space-y-6">
      <BentoCard variant="hero">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16">
            <AnimatedMascot type="bunny" animated wiggle />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Create an Account</h3>
            <p className="text-sm text-muted-foreground">Optional - Play as guest or sign in</p>
          </div>
        </div>

        <div className="bg-background rounded-2xl p-4 mb-4 border border-border/40">
          <h4 className="font-bold text-foreground mb-3">Why create an account?</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 flex-shrink-0">
                <AnimatedMascot type="blueberry" />
              </div>
              <span className="text-sm"><strong>Save Progress:</strong> Access your child's learning progress from any device</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 flex-shrink-0">
                <AnimatedMascot type="bear" />
              </div>
              <span className="text-sm"><strong>Secure Sync:</strong> Your data is encrypted and safely stored in the cloud</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 flex-shrink-0">
                <AnimatedMascot type="star" />
              </div>
              <span className="text-sm"><strong>Premium Access:</strong> Manage subscriptions and unlock all features</span>
            </li>
          </ul>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full pl-10 pr-4 py-3 border-2 border-input rounded-xl focus:border-primary focus:outline-none bg-background"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border-2 border-input rounded-xl focus:border-primary focus:outline-none bg-background"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                {isSignUp ? 'Create Account' : 'Sign In'}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-primary hover:text-primary/80 py-2 text-sm font-medium"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </form>
      </BentoCard>

      <BentoCard variant="gradient" gradientFrom="from-green-500/10" gradientTo="to-emerald-500/5" className="border-2 border-green-300/30">
        <p className="text-sm text-muted-foreground flex items-start gap-2">
          <div className="w-5 h-5 flex-shrink-0 mt-0.5">
            <AnimatedMascot type="frog" />
          </div>
          <span>
            <strong>Playing as Guest:</strong> You can continue playing without an account. 
            Progress will be saved locally on this device only.
          </span>
        </p>
      </BentoCard>
    </div>
  );
}
