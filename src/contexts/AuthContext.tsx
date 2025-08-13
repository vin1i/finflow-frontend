'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { getTokenFromCookie, login as serviceLogin, logout as serviceLogout, User } from "@/services/auth";
import { setAuthToken } from "@/lib/axios";
import { getUserIdFromToken } from "@/lib/jwt";
import { getUserById } from "@/services/auth";
import { api } from "@/lib/axios"; 
import { useRouter, usePathname } from "next/navigation";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  
  const isAuthenticated = useMemo(() => !!token && !!user, [token, user]);

  // Função para limpar estado de autenticação
  const clearAuthState = useCallback(() => {
    setToken(null);
    setUser(null);
    serviceLogout();
  }, []);

  // Função para restaurar usuário do token
  const restoreUserFromToken = useCallback(async (cookieToken: string) => {
    try {
      const userId = getUserIdFromToken(cookieToken);
      if (!userId) {
        clearAuthState();
        return;
      }

      setAuthToken(cookieToken);
      const userData = await getUserById(userId);
      
      setToken(cookieToken);
      setUser(userData);
    } catch (error) {
      console.error('Erro ao restaurar usuário:', error);
      clearAuthState();
    }
  }, [clearAuthState]);

  // Inicialização: restaura token do cookie
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const cookieToken = getTokenFromCookie();
        
        if (cookieToken) {
          await restoreUserFromToken(cookieToken);
        }
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error);
        clearAuthState();
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [restoreUserFromToken, clearAuthState]);

  // Redirecionamento baseado no estado de autenticação
  useEffect(() => {
    if (!isInitialized || isLoading) return;

    const isAuthRoute = pathname?.startsWith('/auth');
    const isInternRoute = pathname?.startsWith('/intern');
    const isRootRoute = pathname === '/';

    if (isAuthenticated) {
      if (isAuthRoute || isRootRoute) {
        router.replace('/intern/dashboard');
      }
    } else {
      if (isInternRoute) {
        router.replace('/auth/login');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, isInitialized]);

  // Função de registro
  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      await api.post("/register", { name, email, password });
      await login(email, password);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Erro ao registrar usuário.";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Função de login
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { token: newToken, user: userData } = await serviceLogin(email, password);
      
      setToken(newToken);
      setUser(userData);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "E-mail ou senha inválidos.";
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Função de logout
  const logout = useCallback(() => {
    clearAuthState();
    router.replace('/auth/login');
  }, [clearAuthState, router]);

  // Função de refresh
  const refresh = useCallback(async () => {
    if (!token) return;
    
    try {
      const userId = getUserIdFromToken(token);
      if (!userId) {
        logout();
        return;
      }
      
      const userData = await getUserById(userId);
      setUser(userData);
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      logout();
    }
  }, [token, logout]);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      login,
      logout,
      refresh,
      register,
    }),
    [user, token, isAuthenticated, isLoading, login, logout, refresh, register]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}