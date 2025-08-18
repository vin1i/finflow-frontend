import { useState, useCallback } from "react";
import { CreateCategoryDTO, UpdateCategoryDTO, CategoryType } from "@/types/categories";
import { api } from "@/lib/axios";

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Category[]>("/categories");
      setCategories(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao buscar categorias");
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (payload: Omit<CreateCategoryDTO, "userId">) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<Category>("/category", payload);
      setCategories(prev => [...prev, res.data]);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao criar categoria");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (id: string, payload: Partial<UpdateCategoryDTO>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.patch<Category>(`/category/${id}`, payload);
      setCategories(prev => prev.map(cat => cat.id === id ? res.data : cat));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao atualizar categoria");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/category/${id}`);
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao remover categoria");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAllCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await api.delete("/categories/all");
      setCategories([]);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao remover todas categorias");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    deleteAllCategories,
    setCategories,
  };
}