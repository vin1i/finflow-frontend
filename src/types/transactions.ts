import type { Account } from "./account"
import type { Category } from "./categories"

export type TransactionType = "income" | "expense";


export interface Transaction {
  id: string
  title: string
  description: string
  amount: number
  type: "income" | "expense"
  accountId: string
  categoryId: string
  date: Date
  notes?: string

  account?: Account
  category?: Category
}


export interface CreateTransactionDTO {
  amount: number;
  date: string;
  type: TransactionType;
  title: string
  description?: string;
  accountId: string;
  categoryId: string;
  userId: string;
}

export interface UpdateTransactionDTO {
  amount?: number;
  date?: string;
  type?: TransactionType;
  title: string
  description?: string;
  accountId?: string;
  categoryId?: string;
}