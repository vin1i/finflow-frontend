"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Transaction } from "@/types/transactions"

interface TransactionItemProps {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
  onDelete: (transactionId: string) => void
}

export function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center space-x-4 flex-1">
        <div className={`w-3 h-3 rounded-full ${transaction.type === "income" ? "bg-green-500" : "bg-red-500"}`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium truncate">{transaction.title}</p>
            <Badge
              variant="secondary"
              className={transaction.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
            >
              {transaction.type === "income" ? (
                <>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Receita
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3 mr-1" />
                  Despesa
                </>
              )}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{transaction.account?.name}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              {transaction.category?.color && (
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: transaction.category.color }} />
              )}
              <span>{transaction.category?.name}</span>
            </div>
            <span>•</span>
            <span>{format(transaction.date, "dd/MM/yyyy", { locale: ptBR })}</span>
          </div>

          {transaction.notes && <p className="text-xs text-muted-foreground mt-1 truncate">{transaction.notes}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
            {transaction.type === "income" ? "+" : "-"}
            {formatCurrency(Math.abs(transaction.amount))}
          </div>
        </div>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="z-50">
            <DropdownMenuItem
              // use onSelect para garantir que o menu feche antes de abrir o Dialog
              onSelect={() => {
                // deixa o dropdown fechar e só depois abre o modal
                setTimeout(() => onEdit(transaction), 0)
                // ou: requestAnimationFrame(() => onEdit(transaction))
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onSelect={() => {
                setTimeout(() => onDelete(transaction.id), 0)
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
