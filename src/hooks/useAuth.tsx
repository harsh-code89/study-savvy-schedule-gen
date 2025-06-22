
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle email confirmation
        if (event === 'SIGNED_IN' && session?.user && !session.user.email_confirmed_at) {
          console.log('User signed in but email not confirmed');
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        return { data, error };
      }

      // If user was created but needs email confirmation
      if (data.user && !data.user.email_confirmed_at) {
        console.log('User created, sending verification email');
        
        // Send custom verification email
        try {
          const confirmationUrl = `${window.location.origin}/?confirmed=true`;
          await supabase.functions.invoke('send-verification-email', {
            body: {
              email: data.user.email,
              confirmationUrl,
              type: 'signup'
            }
          });
          console.log('Custom verification email sent');
        } catch (emailError) {
          console.error('Failed to send custom verification email:', emailError);
          // Don't fail the signup if email sending fails
        }
      }

      return { data, error };
    } catch (err) {
      console.error('Unexpected signup error:', err);
      return { data: null, error: { message: 'An unexpected error occurred' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    return { data, error };
  };

  const signInWithGithub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resendVerification = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (!error) {
        // Also send our custom email
        const confirmationUrl = `${window.location.origin}/?confirmed=true`;
        await supabase.functions.invoke('send-verification-email', {
          body: {
            email,
            confirmationUrl,
            type: 'signup'
          }
        });
      }
      
      return { error };
    } catch (err) {
      console.error('Resend verification error:', err);
      return { error: { message: 'Failed to resend verification email' } };
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    resendVerification,
  };
};
