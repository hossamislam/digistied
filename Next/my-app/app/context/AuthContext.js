'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = Cookies.get('auth_token');
    if (token) {
      try {
        const response = await authApi.getUser();
        setUser(response.data);
      } catch (error) {
        console.error('Auth check failed:', error);
        Cookies.remove('auth_token');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await authApi.login(email, password);
    Cookies.set('auth_token', response.data.token, { expires: 7 });
    setUser(response.data.user);
    return response.data;
  };

  const register = async (name, email, password, password_confirmation) => {
    const response = await authApi.register(name, email, password, password_confirmation);
    Cookies.set('auth_token', response.data.token, { expires: 7 });
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    Cookies.remove('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}