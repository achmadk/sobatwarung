import { useState, useEffect, useCallback } from "react";
import { initAuth, login as authLogin, register as authRegister, logout as authLogout, getAuthState, type AuthState } from "../services/auth.js";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const init = async () => {
      await initAuth();
      setAuthState(getAuthState());
    };
    init();
  }, []);

  const login = useCallback(async (whatsapp: string, password: string) => {
    const result = await authLogin(whatsapp, password);
    setAuthState(getAuthState());
    return result;
  }, []);

  const register = useCallback(async (data: { name: string; whatsapp: string; password: string; role: "RESELLER" | "PEMASOK" }) => {
    const result = await authRegister(data);
    setAuthState(getAuthState());
    return result;
  }, []);

  const logout = useCallback(async () => {
    await authLogout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const refresh = useCallback(async () => {
    setAuthState(getAuthState());
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    refresh,
  };
}
