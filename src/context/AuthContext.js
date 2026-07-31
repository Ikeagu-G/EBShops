import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

/**
 * Auth state derived from the server, not from localStorage.
 *
 * The backend issues httpOnly cookies, which JavaScript cannot read by design.
 * The old code looked for a token in localStorage that was never written there,
 * so the dashboard bounced straight back to the login page.
 */
export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  // "checking" prevents guarded routes from redirecting before the session
  // check resolves, which would kick out an already-authenticated admin.
  const [checking, setChecking] = useState(true);

  const verifySession = useCallback(async () => {
    try {
      await api.get('/admin/check-auth');
      setIsAdmin(true);
      return true;
    } catch {
      setIsAdmin(false);
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  const login = useCallback(async (username, password) => {
    await api.post('/admin/login', { username, password });
    setIsAdmin(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/admin/logout');
    } catch {
      // Even if the request fails, drop local admin state so the UI locks down.
    }
    setIsAdmin(false);
  }, []);

  const value = useMemo(
    () => ({ isAdmin, checking, login, logout, verifySession }),
    [isAdmin, checking, login, logout, verifySession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
