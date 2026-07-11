import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState({ app_name: 'BOYZ IN THE WOODZ' });

  useEffect(() => {
    checkAppState();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          const { data: { user } } = await supabase.auth.getUser();
          setIsAuthenticated(true);
          await fetchOrCreateUserProfile(user);
          setIsLoadingAuth(false);
          setAuthChecked(true);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoadingAuth(false);
          setAuthChecked(true);
        } else {
          setIsLoadingAuth(false);
          setAuthChecked(true);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const awardWelcomePoints = async (userId) => {
    const { error: ltErr } = await supabase.from('loyalty_transactions').insert({
      user_id: userId,
      points_amount: 100,
      type: 'earn',
      source: 'welcome_bonus',
      description: 'Welcome to the Brotherhood! +100 points',
    });
    if (ltErr) { console.debug('welcome points insert error:', ltErr.message); return; }

    await supabase.from('profiles').update({
      loyalty_points: 100,
      last_active_at: new Date().toISOString(),
    }).eq('id', userId);

    const { data: firstBadge } = await supabase
      .from('badges')
      .select('id')
      .eq('slug', 'first-step')
      .single();

    if (firstBadge) {
      await supabase.from('user_badges').insert({ user_id: userId, badge_id: firstBadge.id });
      await supabase.from('activity_feed').insert({
        user_id: userId,
        action_type: 'badge_earned',
        description: 'Earned the "First Step" badge',
        points: 100,
        metadata: { badge_slug: 'first-step' },
      });
    }

    sessionStorage.setItem('bw_welcome_toast', 'true');
  };

  const fetchOrCreateUserProfile = async (user) => {
    if (!user?.id) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.debug('Error fetching profile:', error.message);
      return null;
    }

    // Profile already exists (e.g. created by trigger)
    if (profile) {
      const mergedUser = { ...user, ...profile };
      setUser(mergedUser);
      if (!profile.loyalty_points) {
        awardWelcomePoints(user.id);
      }
      return mergedUser;
    }

    // No profile found — create one
    const profileDefaults = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || null,
      role: user.user_metadata?.role || 'user',
      created_at: new Date().toISOString(),
    };

    const { data: createdProfile, error: insertError } = await supabase
      .from('profiles')
      .insert(profileDefaults)
      .select()
      .maybeSingle();

    if (insertError) {
      console.debug('Error creating profile:', insertError.message);
      const mergedUser = { ...user, ...profileDefaults };
      setUser(mergedUser);
      // Award welcome points anyway even if profile insert failed
      awardWelcomePoints(user.id);
      return mergedUser;
    }

    const mergedUser = { ...user, ...createdProfile };
    setUser(mergedUser);
    awardWelcomePoints(user.id);
    return mergedUser;
  };

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      
      // ─── FIX: Use maybeSingle() to avoid 406 errors ───
      const { data: settings, error } = await supabase
        .from('app_settings')
        .select('*')
        .maybeSingle(); // Changed from .single() to .maybeSingle()
      
      // If no settings found or error, use defaults
      if (settings && !error) {
        setAppPublicSettings(settings);
      } else {
        setAppPublicSettings({ app_name: 'BOYZ IN THE WOODZ' });
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(true);
        await fetchOrCreateUserProfile(user);
      }
      
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
      
    } catch (error) {
      console.debug('App state check error:', error.message);
      setAppPublicSettings({ app_name: 'BOYZ IN THE WOODZ' });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password, metadata = {}) => {
    const signUpMetadata = { ...metadata, role: metadata.role || 'member' };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: signUpMetadata,
        redirectTo: window.location.origin + '/auth/callback',
      },
    });
    if (error) throw error;

    if (data?.user) {
      await fetchOrCreateUserProfile(data.user);
    }

    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  const navigateToLogin = () => {
    window.location.href = '/auth/signin';
  };

  return (
    <AuthContext.Provider value={{ 
      user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings,
      authError, appPublicSettings, authChecked, logout, navigateToLogin,
      signIn, signUp
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};