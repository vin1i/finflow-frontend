import { useState, useCallback } from "react";
import { CreateTransactionDTO, UpdateTransactionDTO } from "@/types/transactions";
import { api } from "@/lib/axios"

export function useTransactions(token: string) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const fetchTransactions = useCallback(async (filters?: Record<string, any>) => {
  setLoading(true);
  setError(null);
  try {
    const params = filters ? filters : {};
    const res = await api.get("/transactions", { params });
    // Converte o campo date para Date
    const transactionsWithDate = res.data.map((tx: any) => ({
      ...tx,
      date: tx.date ? new Date(tx.date) : null,
    }));
    setTransactions(transactionsWithDate);
  } catch (err) {
    setError("Erro ao buscar transações");
  }
  setLoading(false);
}, [token]);

const createTransaction = useCallback(async (payload: Omit<CreateTransactionDTO, "userId">) => {
  setLoading(true);
  setError(null);
  try {
    const res = await api.post("/transaction", payload);
    const tx = res.data;
    setTransactions(prev => [...prev, { ...tx, date: tx.date ? new Date(tx.date) : null }]);
  } catch (err) {
    setError("Erro ao criar transação");
  }
  setLoading(false);
}, [token]);

const updateTransaction = useCallback(async (id: string, payload: UpdateTransactionDTO) => {
  setLoading(true);
  setError(null);
  try {
    const res = await api.patch(`/transaction/${id}`, payload);
    const tx = res.data;
    setTransactions(prev => prev.map(txOld => txOld.id === id ? { ...tx, date: tx.date ? new Date(tx.date) : null } : txOld));
  } catch (err) {
    setError("Erro ao atualizar transação");
  }
  setLoading(false);
}, [token]);

const deleteTransaction = useCallback(async (id: string) => {
  setLoading(true);
  setError(null);
  try {
    await api.delete(`/transaction/${id}`);
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  } catch (err) {
    setError("Erro ao deletar transação");
  }
  setLoading(false);
}, [token]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction
  };
}