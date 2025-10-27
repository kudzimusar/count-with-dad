import { useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { User, LogIn, LogOut, Mail, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // User is signed in
  if (user) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-900">Signed In</h3>
              <p className="text-sm text-green-700">{user.email}</p>
            </div>
          </div>
          
          <div className="bg-white/80 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-gray-900 mb-2">Account Benefits:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Progress saved across all devices
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Manage subscriptions securely
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Access detailed analytics and reports
              </li>
            </ul>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your child's progress is automatically saved to your account. 
            You can access it from any device by signing in.
          </p>
        </div>
      </div>
    );
  }

  // User is not signed in - show auth form
  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-purple-900">Create an Account</h3>
            <p className="text-sm text-purple-700">Optional - Play as guest or sign in</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="font-bold text-gray-900 mb-3">Why create an account?</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">💾</span>
              <span><strong>Save Progress:</strong> Access your child's learning progress from any device</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">🔒</span>
              <span><strong>Secure Sync:</strong> Your data is encrypted and safely stored in the cloud</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">⭐</span>
              <span><strong>Premium Access:</strong> Manage subscriptions and unlock all features</span>
            </li>
          </ul>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
            className="w-full text-purple-600 hover:text-purple-700 py-2 text-sm font-medium"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </form>
      </div>

      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
        <p className="text-sm text-green-800">
          <strong>Playing as Guest:</strong> You can continue playing without an account. 
          Progress will be saved locally on this device only.
        </p>
      </div>
    </div>
  );
}
