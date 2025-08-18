import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

interface DeleteTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transactionDescription?: string
  isLoading?: boolean
  onConfirm: () => Promise<void>
  onCancel?: () => void
}

export function DeleteTransactionDialog({
  open,
  onOpenChange,
  transactionDescription,
  isLoading,
  onConfirm,
  onCancel,
}: DeleteTransactionDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir transação</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a transação{transactionDescription ? ` "${transactionDescription}"` : ""}? Essa ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading || isLoading} onClick={() => { onCancel?.(); onOpenChange(false); }}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction disabled={loading || isLoading} onClick={handleConfirm}>
            {loading || isLoading ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}