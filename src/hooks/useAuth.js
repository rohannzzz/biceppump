"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { API_ENDPOINTS } from '@/config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Checking initial auth state');
    checkAuth();
  }, []);

  useEffect(() => {
    console.log('AuthProvider: User state changed:', user);
    console.log('AuthProvider: Loading state:', loading);
  }, [user, loading]);

  const checkAuth = async () => {
    try {
      console.log('checkAuth: Starting auth check');
      const token = localStorage.getItem('token');
      console.log('checkAuth: Token from localStorage:', token ? 'Found' : 'Not found');

      if (!token) {
        console.log('checkAuth: No token, setting loading to false');
        setLoading(false);
        return;
      }

      console.log('checkAuth: Fetching profile from:', API_ENDPOINTS.PROFILE);
      console.log('checkAuth: Authorization header:', `Bearer ${token.substring(0, 20)}...`);

      const response = await fetch(API_ENDPOINTS.PROFILE, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('checkAuth: Response status:', response.status);
      console.log('checkAuth: Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('checkAuth: Profile data received:', data);
        setUser(data.user);
        console.log('checkAuth: User set in state');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('checkAuth: Failed to get profile:', response.status, errorData);
        localStorage.removeItem('token');
        console.log('checkAuth: Token removed from localStorage');
      }
    } catch (error) {
      console.error('checkAuth: Error during auth check:', error);
      localStorage.removeItem('token');
    } finally {
      console.log('checkAuth: Setting loading to false');
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login to:', API_ENDPOINTS.LOGIN);
      console.log('Login payload:', { email, password: '***' });

      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      console.log('Login response status:', response.status);
      console.log('Login response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Login response data:', data);
      console.log('Response has user?', 'user' in data);
      console.log('Response user value:', data.user);
      console.log('Response keys:', Object.keys(data));
      console.log('Response has user?', 'user' in data);
      console.log('Response user value:', data.user);
      console.log('Response keys:', Object.keys(data));

      if (response.ok) {
        console.log('Storing token in localStorage:', data.token ? 'Token received' : 'No token');
        localStorage.setItem('token', data.token);
        console.log('Setting user in context:', data.user);
        setUser(data.user);
        console.log('Login successful, user set in context');
        return { success: true, message: data.message, user: data.user };
      } else {
        console.error('Login failed with status:', response.status, 'Message:', data.message);
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login network error:', error);
      return { success: false, message: 'Network error: ' + error.message };
    }
  };

  const signup = async (formData) => {
    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error: ' + error.message };
    }
  };

  const logout = async () => {
    try {
      await fetch(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};