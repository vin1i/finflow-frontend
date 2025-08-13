'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  fallback,
  requireAuth = true 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, requireAuth, router]);

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      )
    );
  }

  // Se requer autenticação mas não está autenticado, não renderiza nada
  // (o redirecionamento já foi feito no useEffect)
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}