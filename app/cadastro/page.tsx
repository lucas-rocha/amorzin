// app/cadastro/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowLeft, Lock, Mail, User } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }
    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    setIsLoading(true);

    const registerRes = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() || undefined, email: email.trim(), password }),
    });

    if (!registerRes.ok) {
      const { error: apiError } = await registerRes.json();
      setError(apiError ?? "Não foi possível criar sua conta.");
      setIsLoading(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (signInResult?.error) {
      // conta criada, mas o login automático falhou — manda pra tela de login
      router.push(`/entrar?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <main className="min-h-screen bg-[#FFFCFA] px-4 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-md items-center justify-center">
        <div className="w-full rounded-[28px] border border-[#35131F]/10 bg-white p-6 shadow-[0_20px_60px_rgba(53,19,31,0.08)] sm:p-8">
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 text-sm font-medium text-[#8F747C] transition hover:text-[#E6395B]"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>

          <div className="text-center">
            <div className="font-serif text-xl font-bold text-[#35131F]">🏹 Momozin</div>
            <h1 className="mt-4 font-serif text-2xl font-bold text-[#35131F]">Criar sua conta</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8F747C]">
              Necessário pro plano Premium — gerencie vários Momozins num só lugar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#35131F]">Nome (opcional)</label>
              <div className="relative mt-2">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B9A3A9]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  autoComplete="name"
                  className="h-12 w-full rounded-xl border border-[#E8DADD] bg-[#FFFDFC] pl-11 pr-4 text-sm outline-none transition placeholder:text-[#C4B3B8] focus:border-[#E6395B] focus:ring-4 focus:ring-[#E6395B]/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#35131F]">E-mail</label>
              <div className="relative mt-2">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B9A3A9]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border border-[#E8DADD] bg-[#FFFDFC] pl-11 pr-4 text-sm outline-none transition placeholder:text-[#C4B3B8] focus:border-[#E6395B] focus:ring-4 focus:ring-[#E6395B]/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#35131F]">Senha</label>
              <div className="relative mt-2">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B9A3A9]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="mínimo 8 caracteres"
                  autoComplete="new-password"
                  className="h-12 w-full rounded-xl border border-[#E8DADD] bg-[#FFFDFC] pl-11 pr-4 text-sm outline-none transition placeholder:text-[#C4B3B8] focus:border-[#E6395B] focus:ring-4 focus:ring-[#E6395B]/10"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-[#FFE8EE] px-3 py-2 text-xs font-medium text-[#E6395B]">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-[#E6395B] text-sm font-bold text-white shadow-[0_8px_24px_rgba(230,57,91,0.22)] transition hover:bg-[#D62F50] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#A1888F]">
            Já tem conta?{" "}
            <Link
              href={`/entrar${callbackUrl !== "/dashboard" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
              className="font-semibold text-[#E6395B] hover:underline"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}