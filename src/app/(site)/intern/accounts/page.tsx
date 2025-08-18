"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Filter } from "lucide-react"
import { AccountCard } from "@/app/components/accounts/account-card"
import { AccountForm } from "@/app/components/accounts/account-form"
import { DeleteAccountDialog } from "@/app/components/accounts/delete-account-dialog"
import { toast } from "sonner"
import { useAccounts, type Account } from "@/hooks/useAccounts/useAccounts"

export default function AccountsPage() {
  const {
    accounts,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  } = useAccounts()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Buscar contas ao carregar a página
  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  // Mostrar erro se houver
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const filteredAccounts = accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateAccount = async (data: { name: string; type: string; balance: number; description?: string }) => {
    try {
      await createAccount({
        name: data.name,
        type: data.type,
        balance: data.balance || 0,
      })
      setIsFormOpen(false)
      toast.success("A conta foi criada com sucesso.")
    } catch (error) {
      // O erro já é tratado no hook
    }
  }

  const handleEditAccount = async (data: { name: string; type: string; balance: number; description?: string }) => {
    if (!editingAccount) return

    try {
      await updateAccount(editingAccount.id, {
        name: data.name,
        type: data.type,
        balance: data.balance,
      })
      setEditingAccount(null)
      setIsFormOpen(false)
      toast.success("As informações da conta foram atualizadas.")
    } catch (error) {
      // O erro já é tratado no hook
    }
  }

  const handleDeleteAccount = async () => {
    if (!deletingAccount) return

    try {
      await deleteAccount(deletingAccount.id)
      setDeletingAccount(null)
      toast.success("A conta foi excluída com sucesso.")
    } catch (error) {
      // O erro já é tratado no hook
    }
  }

  const openCreateForm = () => {
    setEditingAccount(null)
    setIsFormOpen(true)
  }

  const openEditForm = (account: Account) => {
    setEditingAccount(account)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingAccount(null)
  }

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + account.balance, 0)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Loading inicial
  if (loading && accounts.length === 0) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contas Bancárias</h2>
          <p className="text-muted-foreground">
            Saldo total: <span className="font-semibold">{formatCurrency(getTotalBalance())}</span>
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateForm} disabled={loading}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Conta
            </Button>
          </DialogTrigger>
          <DialogContent  className="p-0 bg-transparent border-0 shadow-none rounded-none sm:max-w-md">
             <DialogTitle className="sr-only">
      {editingAccount ? "Editar Conta" : "Nova Conta"}
    </DialogTitle>
    <DialogDescription className="sr-only">
      {editingAccount ? "Atualize as informações da conta." : "Preencha os dados para criar uma conta."}
    </DialogDescription>
            <AccountForm
              account={editingAccount ? {
                id: editingAccount.id,
                name: editingAccount.name,
                type: editingAccount.type,
                balance: editingAccount.balance,
              } : undefined}
              onSubmit={editingAccount ? handleEditAccount : handleCreateAccount}
              onCancel={closeForm}
              isLoading={loading}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar contas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" disabled={loading}>
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAccounts.map((account) => (
          <AccountCard
            key={account.id}
            account={{
              id: account.id,
              name: account.name,
              type: account.type,
              balance: account.balance,
              lastUpdated: new Date(account.updatedAt).toLocaleDateString("pt-BR")
            }}
            onEdit={openEditForm}
            onDelete={(id) => setDeletingAccount(accounts.find((a) => a.id === id) || null)}
            onView={(account) => {
              toast.info(account.name, {
                description: `Saldo atual: ${formatCurrency(account.balance)}`,
              })
            }}
          />
        ))}
      </div>

      {filteredAccounts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm ? "Nenhuma conta encontrada." : "Nenhuma conta cadastrada ainda."}
          </p>
          {!searchTerm && (
            <Button onClick={openCreateForm} className="mt-4" disabled={loading}>
              <Plus className="mr-2 h-4 w-4" />
              Criar primeira conta
            </Button>
          )}
        </div>
      )}

      <DeleteAccountDialog
        isOpen={!!deletingAccount}
        onClose={() => setDeletingAccount(null)}
        onConfirm={handleDeleteAccount}
        accountName={deletingAccount?.name || ""}
        isLoading={loading}
      />
    </div>
  )
}