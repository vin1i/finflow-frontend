import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/intern"];
const PUBLIC_ROUTES = ["/auth", "/", "/api"];
const TOKEN_COOKIE = "finflow_token";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(TOKEN_COOKIE)?.value;

  // Permite rotas públicas
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  if (isPublicRoute) {
    // Se está logado e tentando acessar auth, redireciona para dashboard
    if (token && pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/intern/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Verifica rotas protegidas
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};