import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authEvent, setAuthEvent] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthEvent(event); // Track event type (SIGNED_IN, SIGNED_OUT, etc.)
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    // Always use production URL for email verification redirect
    // This ensures users can always return to the app after clicking email link
    // even if they signed up from localhost or a different environment
    const productionUrl = 'https://kudzimusar.github.io/count-with-dad/app';
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: productionUrl
      }
    });
    
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resendVerificationEmail = async (email: string) => {
    const productionUrl = 'https://kudzimusar.github.io/count-with-dad/app';
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: productionUrl
      }
    });
    
    return { error };
  };

  return {
    user,
    session,
    loading,
    authEvent, // Export auth event for detecting sign-out
    signUp,
    signIn,
    signOut,
    resendVerificationEmail,
  };
}
