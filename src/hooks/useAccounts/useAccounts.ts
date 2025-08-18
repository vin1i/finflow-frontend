import { useState, useCallback } from "react";
import { api } from "@/lib/axios";

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Account[]>("/accounts");
      setAccounts(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao buscar contas");
    } finally {
      setLoading(false);
    }
  }, []);

  const createAccount = useCallback(async (payload: { name: string; type: string; balance?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<Account>("/accounts", payload);
      setAccounts(prev => [...prev, res.data]);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAccount = useCallback(async (id: string, payload: Partial<{ name: string; type: string; balance: number }>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.patch<Account>(`/account/${id}`, payload);
      setAccounts(prev => prev.map(acc => acc.id === id ? res.data : acc));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao atualizar conta");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAccount = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/account/${id}`);
      setAccounts(prev => prev.filter(acc => acc.id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao remover conta");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAllAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await api.delete("/accounts");
      setAccounts([]);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao remover todas contas");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    deleteAllAccounts,
    setAccounts,
  };
}