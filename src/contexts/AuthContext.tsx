import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { User, AuthContextType, UserRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);
  const profileRequestIdRef = useRef(0);

  useEffect(() => {
    // This function runs when the component is unmounted to prevent memory leaks
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchUserProfile = useCallback(async (userId: string) => {
    const requestId = profileRequestIdRef.current + 1;
    profileRequestIdRef.current = requestId;
    setIsLoading(true);
    console.log('Fetching profile for user:', userId);

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        console.error('Error fetching profile:', error);
        if (isMountedRef.current && profileRequestIdRef.current === requestId) {
          setUser(null);
        }
        return;
      }

      const mappedUser: User = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role as UserRole,
        tenantId: profile.tenant_id,
        avatar: profile.avatar_url,
        createdAt: profile.created_at
      };

      console.log('Profile fetched successfully:', mappedUser);

      if (isMountedRef.current && profileRequestIdRef.current === requestId) {
        setUser(mappedUser);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (isMountedRef.current && profileRequestIdRef.current === requestId) {
        setUser(null);
      }
    } finally {
      if (isMountedRef.current && profileRequestIdRef.current === requestId) {
        setIsLoading(false);
      }
    }
  }, []);

  const handleSessionChange = useCallback(async (session: Session | null) => {
    if (!isMountedRef.current) {
      return;
    }

    if (session?.user) {
      console.log('Auth session confirmed:', session.user.id);
      await fetchUserProfile(session.user.id);
      return;
    }

    profileRequestIdRef.current += 1;
    console.log('No active session, clearing auth state');
    setUser(null);
    setIsLoading(false);
  }, [fetchUserProfile]);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error retrieving session:', error);
      }

      await handleSessionChange(data.session ?? null);
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSessionChange(session).catch((error) => {
        console.error('Error handling auth state change:', error);
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [handleSessionChange]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
    // onAuthStateChange will handle the rest
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    // onAuthStateChange will handle clearing the user
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}