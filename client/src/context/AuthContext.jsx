import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('artchulbul_token'));
  const [loading, setLoading] = useState(true);

  // Fetch current user details on boot
  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data?.success) {
        setUser(res.data.data);
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('artchulbul_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.success) {
      const { token: receivedToken, data: userData } = res.data;
      if (receivedToken) {
        localStorage.setItem('artchulbul_token', receivedToken);
        setToken(receivedToken);
      }
      setUser(userData);
      toast.success(res.data.message || 'Welcome back!');
      return userData;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data?.success) {
      const { token: receivedToken, data: userData } = res.data;
      if (receivedToken) {
        localStorage.setItem('artchulbul_token', receivedToken);
        setToken(receivedToken);
      }
      setUser(userData);
      toast.success(res.data.message || 'Account created successfully!');
      return userData;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Continue cleanup
    } finally {
      localStorage.removeItem('artchulbul_token');
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (formData) => {
    const res = await api.put('/auth/update-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (res.data?.success) {
      setUser(res.data.data);
      toast.success('Profile updated');
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Failed to update profile');
  };

  const updatePassword = async (currentPassword, newPassword) => {
    const res = await api.put('/auth/update-password', { currentPassword, newPassword });
    if (res.data?.success) {
      toast.success('Password updated successfully');
      return true;
    }
    throw new Error(res.data?.message || 'Failed to update password');
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        refreshUser
      }}
    >
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
