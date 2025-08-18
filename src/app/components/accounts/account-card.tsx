"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"

interface Account {
  id: string
  name: string
  type: string
  balance: number
  description?: string
  bank?: string
  lastUpdated?: string
}

interface AccountCardProps {
  account: Account
  onEdit: (account: Account) => void
  onDelete: (accountId: string) => void
  onView: (account: Account) => void
}

export function AccountCard({ account, onEdit, onDelete, onView }: AccountCardProps) {
  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      checking: "Conta Corrente",
      savings: "Poupança",
      investment: "Investimento",
      credit: "Cartão de Crédito",
    }
    return types[type] || type
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      checking: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      savings: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      investment: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      credit: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    }
    return colors[type] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleEdit = () => {
    onEdit({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance,
      description: account.description,
      bank: account.bank,
      lastUpdated: account.lastUpdated,
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-lg">{account.name}</CardTitle>
          <CardDescription className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className={getTypeColor(account.type)}>
              {getTypeLabel(account.type)}
            </Badge>
            {account.bank && <span className="text-sm">• {account.bank}</span>}
          </CardDescription>
        </div>
       <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="z-50">
            <DropdownMenuItem
              onSelect={() => {
                setTimeout(() => onView(account), 0)
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Visualizar
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() => {
                setTimeout(() => onEdit(account), 0)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onSelect={() => {
                setTimeout(() => onDelete(account.id), 0)
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className={`text-2xl font-bold ${account.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(account.balance)}
          </div>
          {account.description && <p className="text-sm text-muted-foreground">{account.description}</p>}
          <p className="text-xs text-muted-foreground">
            Última atualização: {account.lastUpdated || "hoje"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}