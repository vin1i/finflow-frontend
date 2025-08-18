"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AccountFormProps {
  account?: {
    id: string
    name: string
    type: string
    balance: number
    description?: string
  }
  onSubmit: (data: {
    name: string
    type: string
    balance: number
    description?: string
  }) => void
  onCancel: () => void
  isLoading?: boolean
}

export function AccountForm({ account, onSubmit, onCancel, isLoading }: AccountFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    balance: 0,
    description: "",
  })

  // Preencher formulário quando account mudar
  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        type: account.type,
        balance: account.balance,
        description: account.description || "",
      })
    } else {
      setFormData({
        name: "",
        type: "",
        balance: 0,
        description: "",
      })
    }
  }, [account])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.type) {
      return
    }

    onSubmit({
      name: formData.name.trim(),
      type: formData.type,
      balance: formData.balance,
      description: formData.description.trim() || undefined,
    })
  }

  const accountTypes = [
    { value: "checking", label: "Conta Corrente" },
    { value: "savings", label: "Poupança" },
    { value: "investment", label: "Investimento" },
    { value: "credit", label: "Cartão de Crédito" },
  ]

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{account ? "Editar Conta" : "Nova Conta"}</CardTitle>
        <CardDescription>
          {account ? "Atualize as informações da conta" : "Adicione uma nova conta bancária"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Conta</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Conta Corrente Banco do Brasil"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo da Conta</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({ ...formData, type: value })} 
              required
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Saldo {account ? "Atual" : "Inicial"}</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: Number.parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Informações adicionais sobre a conta"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading || !formData.name.trim() || !formData.type} 
              className="flex-1"
            >
              {isLoading ? "Salvando..." : account ? "Atualizar" : "Criar Conta"}
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