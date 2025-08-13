import { useAuth as useAuthContext } from "@/contexts/AuthContext";

export function useAuthUser() {
  const { user, isAuthenticated, token, isLoading } = useAuthContext();
  
  return { 
    user, 
    isAuthenticated, 
    token, 
    isLoading,
    // Informações derivadas úteis
    userId: user?.id,
    userEmail: user?.email,
    userName: user?.name,
  };
}

// Hook para verificar permissões específicas
export function useAuthGuard() {
  const { isAuthenticated, isLoading } = useAuthContext();
  
  return {
    isAuthenticated,
    isLoading,
    canAccess: isAuthenticated && !isLoading,
  };
}

// Hook para ações de autenticação
export function useAuthActions() {
  const { login, logout, register, refresh } = useAuthContext();
  
  return {
    login,
    logout,
    register,
    refresh,
  };
}