"use client"
import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const { login, isLoading } = useAuth();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    
    try {
      await login(email, password);
      toast.success("Login realizado com sucesso!");
      // O redirecionamento será feito automaticamente pelo AuthContext
    } catch (err: any) {
      toast.error(err?.message || "Erro ao fazer login");
    }
  }

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Entre com sua conta</h1>
        <p className="text-balance text-sm text-muted-foreground">Digite suas credenciais para fazer login</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Esqueceu sua senha ?
            </a>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Entrar
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">Ou continue com</span>
        </div>
      </div>
      <div className="text-center text-sm">
        Não possui conta?{" "}
        <a href="/auth/register" className="underline underline-offset-4">
          Registrar
        </a>
      </div>
    </form>
  )
}