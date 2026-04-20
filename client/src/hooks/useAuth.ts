import { useState, useCallback } from 'react';
import { adminLogin } from '../lib/api';

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ss-admin-token'));

  const login = useCallback(async (username: string, password: string) => {
    const { token: t } = await adminLogin(username, password);
    localStorage.setItem('ss-admin-token', t);
    setToken(t);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ss-admin-token');
    setToken(null);
  }, []);

  return { token, isAuth: !!token, login, logout };
}
