import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on load
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('secureapp_token');
      const savedUser = localStorage.getItem('secureapp_user');

      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          // Verify token validity by fetching latest /api/users/me
          const response = await api.get('/users/me');
          setUser(response.data);
          localStorage.setItem('secureapp_user', JSON.stringify(response.data));
        } catch (err) {
          // Token expired or invalid
          localStorage.removeItem('secureapp_token');
          localStorage.removeItem('secureapp_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    const { access_token, user: loggedUser } = response.data;

    setToken(access_token);
    setUser(loggedUser);
    localStorage.setItem('secureapp_token', access_token);
    localStorage.setItem('secureapp_user', JSON.stringify(loggedUser));
    return loggedUser;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout');
      }
    } catch (err) {
      // Ignore network errors during logout
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('secureapp_token');
      localStorage.removeItem('secureapp_user');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
      localStorage.setItem('secureapp_user', JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateProfile = async (profileData) => {
    const response = await api.put('/users/me', profileData);
    setUser(response.data);
    localStorage.setItem('secureapp_user', JSON.stringify(response.data));
    return response.data;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
