import {
  setAuthToken,
  login as apiLogin,
  register as apiRegister,
  refreshAccessToken as apiRefresh,
  getCurrentUser as apiGetMe,
  logout as apiLogout,
} from "./api";
import type { User } from "@sobatwarung/sdk";

const TOKEN_KEY = "sobat_access_token";
const REFRESH_TOKEN_KEY = "sobat_refresh_token";
const USER_KEY = "sobat_user";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

let currentUser: User | null = null;
let accessToken: string | null = null;
let refreshToken: string | null = null;

function loadFromStorage() {
  if (typeof window === "undefined") return;

  accessToken = localStorage.getItem(TOKEN_KEY);
  refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const userJson = localStorage.getItem(USER_KEY);

  if (userJson) {
    try {
      currentUser = JSON.parse(userJson);
    } catch {
      currentUser = null;
    }
  }

  if (accessToken) {
    setAuthToken(accessToken);
  }
}

function saveToStorage() {
  if (typeof window === "undefined") return;

  if (accessToken) {
    localStorage.setItem(TOKEN_KEY, accessToken);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  if (currentUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

function clearStorage() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  accessToken = null;
  refreshToken = null;
  currentUser = null;
  setAuthToken("");
}

export async function initAuth() {
  loadFromStorage();

  if (accessToken && refreshToken) {
    try {
      currentUser = await apiGetMe();
      saveToStorage();
      return true;
    } catch {
      try {
        await refreshTokens();
        currentUser = await apiGetMe();
        saveToStorage();
        return true;
      } catch {
        clearStorage();
        return false;
      }
    }
  }

  return false;
}

export async function login(whatsapp: string, password: string) {
  const result = await apiLogin(whatsapp, password);
  accessToken = result.accessToken;
  refreshToken = result.refreshToken;
  setAuthToken(accessToken);

  currentUser = await apiGetMe();
  saveToStorage();

  return { user: currentUser, accessToken, refreshToken };
}

export async function register(data: {
  name: string;
  whatsapp: string;
  password: string;
  role: "RESELLER" | "PEMASOK";
}) {
  const roleMap = {
    RESELLER: "RESELLER" as const,
    PEMASOK: "PEMASOK" as const,
  };

  const result = await apiRegister({
    name: data.name,
    whatsapp: data.whatsapp,
    password: data.password,
    role: roleMap[data.role],
  });

  accessToken = result.accessToken;
  refreshToken = result.refreshToken;
  setAuthToken(accessToken);

  currentUser = await apiGetMe();
  saveToStorage();

  return { user: currentUser, accessToken, refreshToken };
}

export async function refreshTokens(): Promise<boolean> {
  if (!refreshToken) return false;

  try {
    const result = await apiRefresh(refreshToken);
    accessToken = result.accessToken;
    refreshToken = result.refreshToken;
    setAuthToken(accessToken);
    saveToStorage();
    return true;
  } catch {
    clearStorage();
    return false;
  }
}

export async function logout() {
  if (refreshToken) {
    try {
      await apiLogout({ refreshToken });
    } catch {
      // Ignore logout errors
    }
  }
  clearStorage();
}

export function getUser(): User | null {
  return currentUser;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function isAuthenticated(): boolean {
  return !!accessToken && !!currentUser;
}

export function getAuthState(): AuthState {
  return {
    user: currentUser,
    isAuthenticated: isAuthenticated(),
    isLoading: false,
  };
}
