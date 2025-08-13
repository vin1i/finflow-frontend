import Cookies from "js-cookie";
import { api } from "../lib/axios";
import { getUserIdFromToken } from "../lib/jwt";

const TOKEN_COOKIE = "finflow_token";

export type LoginResponse = { token: string };
export type User = { id: string; name: string; email: string };

export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
  const { data } = await api.post<LoginResponse>("/login", { email, password });
  const token = data.token;
  const userId = getUserIdFromToken(token);
  if (!userId) throw new Error("Token inválido.");

  // persiste
  Cookies.set(TOKEN_COOKIE, token); // (simples) — para httpOnly, use API route/server action
  // header
  api.defaults.headers.common.Authorization = `Bearer ${token}`;

  // busca usuário
  const me = await getUserById(userId);
  return { token, user: me };
}

export function logout() {
  Cookies.remove(TOKEN_COOKIE);
  delete api.defaults.headers.common.Authorization;
}

export function getTokenFromCookie(): string | null {
  return Cookies.get(TOKEN_COOKIE) ?? null;
}

export async function getUserById(id: string): Promise<User> {
  const { data } = await api.get<User>(`/user/${id}`);
  return data;
}
