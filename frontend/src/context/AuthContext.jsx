import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Reusable notification helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Restore authentication state on startup
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen to axios 401 session expiration event
    const handleAuthExpired = (e) => {
      logout();
      showToast(e.detail?.message || 'Your session has expired. Please log in again.', 'danger');
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setToken(data.token);
        setUser(data.user);
        showToast('Login successful', 'success');
        return data;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Invalid email or password.';
      showToast(errorMsg, 'danger');
      throw error;
    }
  };

  const logout = (message = 'Logged out successfully') => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    if (message) {
      showToast(message, 'success');
    }
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        toast,
        showToast,
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
export default AuthContext;
