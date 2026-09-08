// app/entrar/page.tsx

"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    if (!email.trim() || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("E-mail ou senha incorretos.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Não foi possível entrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
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

          <div className="mb-2 text-center">
            <div className="font-serif text-xl font-bold text-[#35131F]">
              🏹 Momozin
            </div>

            <h1 className="mt-4 font-serif text-2xl font-bold text-[#35131F]">
              Entrar na sua conta
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8F747C]">
              Acesse pra gerenciar seus Momozins.
            </p>
          </div>

          <GoogleSignInButton callbackUrl={callbackUrl} />

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E8DADD]" />

            <span className="text-[10px] font-medium text-[#A1888F]">
              ou com e-mail
            </span>

            <div className="h-px flex-1 bg-[#E8DADD]" />
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-[#35131F]"
              >
                E-mail
              </label>

              <div className="relative mt-2">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B9A3A9]"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  autoComplete="email"
                  disabled={isLoading}
                  className="h-12 w-full rounded-xl border border-[#E8DADD] bg-[#FFFDFC] pl-11 pr-4 text-sm outline-none transition placeholder:text-[#C4B3B8] focus:border-[#E6395B] focus:ring-4 focus:ring-[#E6395B]/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#35131F]"
              >
                Senha
              </label>

              <div className="relative mt-2">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B9A3A9]"
                />

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="h-12 w-full rounded-xl border border-[#E8DADD] bg-[#FFFDFC] pl-11 pr-4 text-sm outline-none transition placeholder:text-[#C4B3B8] focus:border-[#E6395B] focus:ring-4 focus:ring-[#E6395B]/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-[#FFE8EE] px-3 py-2 text-xs font-medium text-[#E6395B]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-[#E6395B] text-sm font-bold text-white shadow-[0_8px_24px_rgba(230,57,91,0.22)] transition hover:bg-[#D62F50] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#A1888F]">
            Ainda não tem conta?{" "}

            <Link
              href={`/cadastro${
                callbackUrl !== "/dashboard"
                  ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
                  : ""
              }`}
              className="font-semibold text-[#E6395B] hover:underline"
            >
              Criar conta
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}

function LoginFallback() {
  return (
    <main className="min-h-screen bg-[#FFFCFA] px-4 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-md items-center justify-center">
        <div className="w-full rounded-[28px] border border-[#35131F]/10 bg-white p-8 shadow-[0_20px_60px_rgba(53,19,31,0.08)]">
          <div className="mx-auto h-6 w-32 animate-pulse rounded bg-[#E8DADD]" />

          <div className="mx-auto mt-6 h-8 w-56 animate-pulse rounded bg-[#E8DADD]" />

          <div className="mx-auto mt-3 h-4 w-64 animate-pulse rounded bg-[#F1E7E9]" />

          <div className="mt-8 h-12 animate-pulse rounded-xl bg-[#F1E7E9]" />

          <div className="mt-5 h-12 animate-pulse rounded-xl bg-[#F1E7E9]" />

          <div className="mt-4 h-12 animate-pulse rounded-xl bg-[#F1E7E9]" />
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}