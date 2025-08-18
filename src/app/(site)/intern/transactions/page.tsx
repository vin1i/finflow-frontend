"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { TransactionForm } from "@/app/components/transactions/transactions-form"
import { TransactionItem } from "@/app/components/transactions/transaction-item"
import { TransactionFilters } from "@/app/components/transactions/transaction-filters"
import { toast } from "sonner"
import { Transaction } from "@/types/transactions"
import { useTransactions } from "@/hooks/useTransactions/useTransactions"
import { useAuthUser } from "@/hooks/useAuth/useAuth"
import { useAccounts } from "@/hooks/useAccounts/useAccounts"
import { useCategories } from "@/hooks/useCategories/useCategories"
import { DeleteTransactionDialog } from "@/app/components/transactions/delete-transaction-dialog"


export default function TransactionsPage() {
  const { token } = useAuthUser()
  const {
    transactions,
    loading: isLoading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions(token ?? "")
  const { accounts, fetchAccounts } = useAccounts()
  const { categories, fetchCategories } = useCategories()

  // Buscar transações ao montar
  useEffect(() => {
    fetchAccounts()
    fetchCategories()
    fetchTransactions()
  }, [])


  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)
  const [isImportModalOpen, setImportModalOpen] = React.useState(false)

  type FilterState = {
    search: string
    type: "all" | "income" | "expense"
    accountId: string
    categoryId: string
    dateFrom?: Date
    dateTo?: Date
  }

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: "all",
    accountId: "",
    categoryId: "",
    dateFrom: undefined,
    dateTo: undefined,
  })

  // Filtrar transações
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        const desc = transaction.description?.toLowerCase() ?? "";
        const notes = (transaction as any).notes?.toLowerCase?.() ?? "";
        const accountName = accounts.find(a => a.id === transaction.accountId)?.name?.toLowerCase() ?? "";
        const categoryName = categories.find(c => c.id === transaction.categoryId)?.name?.toLowerCase() ?? "";

        if (![desc, notes, accountName, categoryName].some(v => v.includes(s))) return false;
      }

      if (filters.type !== "all" && transaction.type !== filters.type) return false;
      if (filters.accountId && transaction.accountId !== filters.accountId) return false;
      if (filters.categoryId && transaction.categoryId !== filters.categoryId) return false;

        const txDate = new Date(transaction.date)

    if (filters.dateFrom && txDate < filters.dateFrom) return false
    if (filters.dateTo && txDate > filters.dateTo) return false

    return true
  })
}, [transactions, filters, accounts, categories])

  // Enriquecer transações com dados de conta e categoria
  const enrichedTransactions = filteredTransactions
    .map(t => ({
      ...t,
      account: accounts.find(a => a.id === t.accountId),
      category: categories.find(c => c.id === t.categoryId),
      date: t.date instanceof Date ? t.date : new Date(t.date),
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());


  // Handlers das transações
  const handleCreateTransaction = async (data: any) => {
    try {
      await createTransaction(data)
      toast.success("A transação foi registrada com sucesso.")
      setImportModalOpen(false)
    } catch (error) {
      toast.error("Erro ao criar transação")
    }
  }

  const handleEditTransaction = async (data: any) => {
    if (!editingTransaction) return
    try {
      await updateTransaction(editingTransaction.id, data)
      toast.success("As informações da transação foram atualizadas.")
      setImportModalOpen(false)
    } catch (error) {
      toast.error("Erro ao atualizar transação")
    }
  }

  const handleDeleteTransaction = async () => {
    if (!deletingTransaction) return
    try {
      await deleteTransaction(deletingTransaction.id)
      toast.success("A transação foi excluída com sucesso.")
      setDeletingTransaction(null)
    } catch (error) {
      toast.error("Erro ao excluir transação")
    }
  }

  // Calcular estatísticas
  const stats = useMemo(() => {
    const income = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const expense = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    return {
      totalTransactions: filteredTransactions.length,
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    }
  }, [filteredTransactions])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transações</h2>
          <p className="text-muted-foreground">
            {stats.totalTransactions} transação(ões) • Saldo: {formatCurrency(stats.balance)}
          </p>
        </div>
        
          <Button
  onClick={() => {
    setEditingTransaction(null)   // garante modo create
    setImportModalOpen(true)
  }}
>
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      {/* Dialog com Description obrigatória */}
 <Dialog
  open={isImportModalOpen}
  onOpenChange={(open) => {
    setImportModalOpen(open)
    if (!open) setEditingTransaction(null) // limpa ao fechar
  }}
>
  <DialogContent className="max-w-lg">
    <DialogTitle>
      {editingTransaction ? "Editar Transação" : "Nova Transação"}
    </DialogTitle>

    <DialogDescription>
      {editingTransaction
        ? "Atualize as informações da transação selecionada."
        : "Preencha os dados para registrar uma nova movimentação financeira."}
    </DialogDescription>

    <TransactionForm
      transaction={editingTransaction ?? undefined}
      accounts={accounts}
      categories={categories}
      onSubmit={
        editingTransaction
          ? handleEditTransaction
          : handleCreateTransaction
      }
      onCancel={() => setImportModalOpen(false)}
      isLoading={isLoading}
    />
  </DialogContent>
</Dialog>


      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalIncome)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredTransactions.filter((t) => t.type === "income").length} transação(ões)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalExpense)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredTransactions.filter((t) => t.type === "expense").length} transação(ões)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(stats.balance)}
            </div>
            <p className="text-xs text-muted-foreground">{stats.balance >= 0 ? "Saldo positivo" : "Saldo negativo"}</p>
          </CardContent>
        </Card>
      </div>

      <TransactionFilters
        accounts={accounts}
        categories={categories}
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>
            {enrichedTransactions.length > 0
              ? `Exibindo ${enrichedTransactions.length} de ${transactions.length} transação(ões)`
              : "Nenhuma transação encontrada"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {enrichedTransactions.map((transaction) => (
          <TransactionItem
  key={transaction.id}
  transaction={transaction}
  onEdit={(tx) => {                // recebe a transação
    setEditingTransaction(tx)      // seta para edição
    setImportModalOpen(true)
  }}
  onDelete={(id) => {
    const t = transactions.find((x) => x.id === id) || null
    setDeletingTransaction(t)
  }}
/>
            ))}

            {enrichedTransactions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {filters.search || filters.type !== "all" || filters.accountId || filters.categoryId
                    ? "Nenhuma transação encontrada com os filtros aplicados."
                    : "Nenhuma transação registrada ainda."}
                </p>
                <Button onClick={() => setImportModalOpen(true)} >
                  <Plus className="mr-2 h-4 w-4" />
                  Criar primeira transação
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

         <DeleteTransactionDialog
  open={!!deletingTransaction}
  onOpenChange={(open) => {
    if (!open) setDeletingTransaction(null)
  }}
  transactionDescription={deletingTransaction?.description}
  isLoading={isLoading}
  onConfirm={handleDeleteTransaction}
  onCancel={() => setDeletingTransaction(null)}
/>


    </div>
  )
}