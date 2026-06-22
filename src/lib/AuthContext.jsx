import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkAppState();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
              const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(true);
        await fetchOrCreateUserProfile(user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        }
        setIsLoadingAuth(false);
        setAuthChecked(true);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchOrCreateUserProfile = async (user) => {
    if (!user?.id) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return null;
    }

    if (profile) {
      const mergedUser = { ...user, ...profile };
      setUser(mergedUser);
      return mergedUser;
    }

    const profileDefaults = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || null,
      role: user.user_metadata?.role || 'member',
      created_at: new Date().toISOString(),
    };

    const { data: createdProfile, error: insertError } = await supabase
      .from('profiles')
      .insert(profileDefaults)
      .select()
      .single();

    if (insertError) {
      console.error('Error creating profile:', insertError);
      const mergedUser = { ...user, ...profileDefaults };
      setUser(mergedUser);
      return mergedUser;
    }

    const mergedUser = { ...user, ...createdProfile };
    setUser(mergedUser);
    return mergedUser;
  };

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      
      const { data: settings, error } = await supabase
        .from('app_settings')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      setAppPublicSettings(settings || { app_name: 'BOYZ IN THE WOODZ' });
      
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
      console.error('App state check failed:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'Failed to load app'
      });
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
      options: { data: signUpMetadata }
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