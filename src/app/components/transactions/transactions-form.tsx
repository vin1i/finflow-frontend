"use client"
import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Account {
  id: string
  name: string
  type: string
  balance: number
}

interface Category {
  id: string
  name: string
  type: "income" | "expense"
  color?: string
}

interface Transaction {
  id: string
  title: string
  amount: number
  type: "income" | "expense"
  accountId: string
  categoryId: string
  date: Date
  description?: string
}

interface TransactionFormProps {
  transaction?: Transaction
  accounts: Account[]
  categories: Category[]
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
}

export function TransactionForm({
  transaction,
  accounts,
  categories,
  onSubmit,
  onCancel,
  isLoading,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    title: transaction?.title || "",
    amount: transaction?.amount || 0,
    type: transaction?.type || ("expense" as "income" | "expense"),
    accountId: transaction?.accountId || "",
    categoryId: transaction?.categoryId || "",
    date: transaction?.date || new Date(),
    description: transaction?.description || "",
  })

  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  useEffect(() => {
    // Filtrar categorias baseado no tipo da transação
    const filtered = categories.filter((category) => category.type === formData.type)
    setFilteredCategories(filtered)

    // Reset category if it doesn't match the type
    if (formData.categoryId) {
      const selectedCategory = categories.find((c) => c.id === formData.categoryId)
      if (selectedCategory && selectedCategory.type !== formData.type) {
        setFormData((prev) => ({ ...prev, categoryId: "" }))
      }
    }
  }, [formData.type, categories])

  const validateForm = () => {
    const errors: string[] = []

    if (!formData.title.trim()) {
      errors.push("Título é obrigatório")
    }

    if (formData.amount <= 0) {
      errors.push("Valor deve ser maior que zero")
    }

    if (!formData.accountId) {
      errors.push("Conta é obrigatória")
    }

    if (!formData.categoryId) {
      errors.push("Categoria é obrigatória")
    }

    // Verificar se a categoria é compatível com o tipo
    const selectedCategory = categories.find((c) => c.id === formData.categoryId)
    if (selectedCategory && selectedCategory.type !== formData.type) {
      errors.push("Categoria deve ser do mesmo tipo da transação")
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleTypeChange = (type: "income" | "expense") => {
    setFormData((prev) => ({ ...prev, type, categoryId: "" }))
  }

  const getAccountBalance = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId)
    return account ? account.balance : 0
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Card className="w-full max-w-lg">
  <CardHeader>
  <CardTitle>{transaction ? "Editar Transação" : "Nova Transação"}</CardTitle>
  <div className="text-muted-foreground text-sm">
    {transaction ? "Atualize as informações da transação" : "Registre uma nova movimentação financeira"}
  </div>
</CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {validationErrors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800 text-sm font-medium mb-2">
                <AlertCircle className="h-4 w-4" />
                Corrija os seguintes erros:
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="type">Tipo da Transação</Label>
            <Select value={formData.type} onValueChange={handleTypeChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Receita
                    </Badge>
                    <span>Entrada de dinheiro</span>
                  </div>
                </SelectItem>
                <SelectItem value="expense">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Despesa
                    </Badge>
                    <span>Saída de dinheiro</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Compra no supermercado, Salário janeiro"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account">Conta</Label>
            <Select
              value={formData.accountId}
              onValueChange={(value) => setFormData({ ...formData, accountId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a conta" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{account.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">{formatCurrency(account.balance)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.accountId && (
              <p className="text-xs text-muted-foreground">
                Saldo atual: {formatCurrency(getAccountBalance(formData.accountId))}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color || "#3b82f6" }} />
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filteredCategories.length === 0 && (
              <p className="text-xs text-amber-600">
                Nenhuma categoria de {formData.type === "income" ? "receita" : "despesa"} disponível
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP", { locale: ptBR }) : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && setFormData({ ...formData, date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Observações (Opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Informações adicionais sobre a transação"
              rows={3}
            />
          </div>

          <div className="flex space-x-2 pt-4">
       <Button type="submit" disabled={isLoading}>
  {isLoading ? "Salvando..." : "Salvar"}
</Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
