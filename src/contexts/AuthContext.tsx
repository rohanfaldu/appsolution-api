import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import {
  clearAuthStorage,
  clearShopState,
  getStoredUser,
  saveStoredUser,
  syncShopState,
} from '../utils/marketplaceStorage';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string; role?: string } | null;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    typeof window !== 'undefined' ? Boolean(window.localStorage.getItem('adminToken')) : false
  );
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Verify token with server
      authAPI.getMe()
        .then(response => {
          setIsAuthenticated(true);
          const nextUser = response.data.user;
          setUser(nextUser);
          saveStoredUser(nextUser);
          syncShopState().catch((error) => {
            console.error('Shop sync error:', error);
          });
        })
        .catch(() => {
          clearAuthStorage();
          clearShopState();
          setIsAuthenticated(false);
          setUser(null);
        });
    } else {
      clearShopState();
      setIsAuthenticated(false);
      setUser(getStoredUser());
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshShopState = () => {
      syncShopState().catch((error) => {
        console.error('Shop sync error:', error);
      });
    };

    refreshShopState();
    window.addEventListener('focus', refreshShopState);
    document.addEventListener('visibilitychange', refreshShopState);
    const intervalId = window.setInterval(refreshShopState, 10000);

    return () => {
      window.removeEventListener('focus', refreshShopState);
      document.removeEventListener('visibilitychange', refreshShopState);
      window.clearInterval(intervalId);
    };
  }, [isAuthenticated]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      setIsAuthenticated(true);
      setUser(user);
      localStorage.setItem('adminToken', token);
      saveStoredUser(user);
      syncShopState().catch((error) => {
        console.error('Shop sync error:', error);
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    clearAuthStorage();
    clearShopState();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
