// app/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { CONFIG } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
    const rememberedUser = localStorage.getItem(CONFIG.STORAGE_KEYS.REMEMBERED_USER);
    const sessionUser = sessionStorage.getItem(CONFIG.STORAGE_KEYS.LOGGED_IN_USER);
    const expiresIn = localStorage.getItem(CONFIG.STORAGE_KEYS.EXPIRED_SESSION);

    // Check if token exists and is not expired
    if (token) {
      if (expiresIn) {
        const currentTime = Date.now();
        const expirationTime = parseInt(expiresIn);
        
        // If token is expired, logout
        if (currentTime > expirationTime) {
          logout();
          return false;
        }
      }

      // Set user and authentication status
      const currentUser = rememberedUser || sessionUser;
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        return true;
      }
    }

    setIsAuthenticated(false);
    setUser(null);
    return false;
  };

  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN_ERP);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.REMEMBERED_USER);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.REMEMBERED_PASSWORD);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.EXPIRED_SESSION);
    sessionStorage.removeItem(CONFIG.STORAGE_KEYS.LOGGED_IN_USER);
    
    setIsAuthenticated(false);
    setUser(null);
    
    // Redirect to login
    navigate('/', { replace: true });
  };

  const login = (userData, token, expiresIn, rememberMe) => {
    if (rememberMe) {
      localStorage.setItem(CONFIG.STORAGE_KEYS.REMEMBERED_USER, userData.username);
      localStorage.setItem(CONFIG.STORAGE_KEYS.REMEMBERED_PASSWORD, userData.password);
      localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN_ERP, token);
    } else {
      localStorage.setItem(CONFIG.STORAGE_KEYS.EXPIRED_SESSION, Date.now() + (expiresIn * 1000));
      sessionStorage.setItem(CONFIG.STORAGE_KEYS.LOGGED_IN_USER, userData.username);
      localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN_ERP, token);
    }

    setUser(userData.username);
    setIsAuthenticated(true);
  };

useEffect(() => {
  const initAuth = async () => {
    await checkAuthStatus(); // jika checkAuthStatus jadi async
    setIsLoading(false);
  };

  initAuth();
}, []);

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuthStatus
  };
};

export default useAuth;