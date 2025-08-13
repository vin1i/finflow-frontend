import { jwtDecode } from "jwt-decode";

type JwtPayload = { userId: string; iat?: number; exp?: number };

export function getUserIdFromToken(token: string): string | null {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    return payload.userId ?? null;
  } catch {
    return null;
  }
}
