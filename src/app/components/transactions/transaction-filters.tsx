"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Account {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
  type: "income" | "expense"
}

interface FilterState {
  search: string
  type: "all" | "income" | "expense"
  accountId: string
  categoryId: string
  dateFrom?: Date
  dateTo?: Date
}

interface TransactionFiltersProps {
  accounts: Account[]
  categories: Category[]
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function TransactionFilters({ accounts, categories, filters, onFiltersChange }: TransactionFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      type: "all",
      accountId: "",
      categoryId: "",
      dateFrom: undefined,
      dateTo: undefined,
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.type !== "all") count++
    if (filters.accountId) count++
    if (filters.categoryId) count++
    if (filters.dateFrom) count++
    if (filters.dateTo) count++
    return count
  }

  const filteredCategories = filters.type === "all" ? categories : categories.filter((c) => c.type === filters.type)

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Buscar transações..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative bg-transparent">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filtros</h4>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Limpar
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={filters.type} onValueChange={(value: any) => updateFilter("type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="income">Receitas</SelectItem>
                    <SelectItem value="expense">Despesas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Conta</Label>
                <Select value={filters.accountId} onValueChange={(value) => updateFilter("accountId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as contas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as contas</SelectItem>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={filters.categoryId} onValueChange={(value) => updateFilter("categoryId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Data inicial</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateFrom ? format(filters.dateFrom, "dd/MM", { locale: ptBR }) : "Início"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateFrom}
                        onSelect={(date) => updateFilter("dateFrom", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Data final</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateTo ? format(filters.dateTo, "dd/MM", { locale: ptBR }) : "Fim"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateTo}
                        onSelect={(date) => updateFilter("dateTo", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Busca: {filters.search}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("search", "")} />
            </Badge>
          )}
          {filters.type !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {filters.type === "income" ? "Receitas" : "Despesas"}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("type", "all")} />
            </Badge>
          )}
          {filters.accountId && (
            <Badge variant="secondary" className="gap-1">
              {accounts.find((a) => a.id === filters.accountId)?.name}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("accountId", "")} />
            </Badge>
          )}
          {filters.categoryId && (
            <Badge variant="secondary" className="gap-1">
              {categories.find((c) => c.id === filters.categoryId)?.name}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("categoryId", "")} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
