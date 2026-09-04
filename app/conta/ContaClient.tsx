// app/conta/ContaClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Mail, Sparkles, User } from "lucide-react";

interface ContaData {
  name: string | null;
  email: string;
  isPremiumMember: boolean;
  premiumSince: string | null;
  createdAt: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function ContaClient({ user }: { user: ContaData }) {
  const [name, setName] = useState(user.name ?? "");
  const [nameStatus, setNameStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setNameStatus("saving");

    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setNameStatus(res.ok ? "saved" : "error");
    if (res.ok) setTimeout(() => setNameStatus("idle"), 2000);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordStatus("saving");
    setPasswordError(null);

    const res = await fetch("/api/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      setPasswordError(error ?? "Não foi possível trocar a senha");
      setPasswordStatus("error");
      return;
    }

    setPasswordStatus("saved");
    setCurrentPassword("");
    setNewPassword("");
    setTimeout(() => setPasswordStatus("idle"), 2000);
  }

  return (
    <main className="min-h-screen bg-[#FFFCFA] px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-lg">
        <Link
          href="/dashboard"
          className="mb-6 flex items-center gap-2 text-sm font-medium text-[#8F747C] transition hover:text-[#E6395B]"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>

        <h1 className="mb-6 font-serif text-2xl font-bold text-[#35131F]">Minha conta</h1>

        {/* status da conta */}
        <div className="mb-5 rounded-[20px] border border-[#35131F]/10 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail size={15} className="text-[#A1888F]" />
              <span className="text-sm text-[#35131F]">{user.email}</span>
            </div>
            {user.isPremiumMember && (
              <span className="flex items-center gap-1 rounded-full bg-gradient-to-br from-[#E6395B] to-[#9F1835] px-2.5 py-1 text-[9px] font-bold text-white">
                <Sparkles size={10} />
                PREMIUM
              </span>
            )}
          </div>

          <p className="mt-3 text-xs text-[#A1888F]">
            Conta criada em {formatDate(user.createdAt)}
            {user.isPremiumMember && user.premiumSince && (
              <> · Premium desde {formatDate(user.premiumSince)}</>
            )}
          </p>

          {!user.isPremiumMember && (
            <Link
              href="/dashboard"
              className="mt-3 inline-block text-xs font-semibold text-[#E6395B] hover:underline"
            >
              Virar Premium →
            </Link>
          )}
        </div>

        {/* editar nome */}
        <form onSubmit={handleSaveName} className="mb-5 rounded-[20px] border border-[#35131F]/10 bg-white p-5">
          <label className="flex items-center gap-2 text-xs font-semibold text-[#35131F]">
            <User size={14} />
            Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="mt-2 h-11 w-full rounded-xl border border-[#E8DADD] bg-[#FFFDFC] px-4 text-sm outline-none transition placeholder:text-[#C4B3B8] focus:border-[#E6395B] focus:ring-4 focus:ring-[#E6395B]/10"
          />
          <button
            type="submit"
            disabled={nameStatus === "saving"}
            className="mt-3 rounded-full bg-[#E6395B] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#D62F50] disabled:opacity-60"
          >
            {nameStatus === "saving" ? "Salvando..." : nameStatus === "saved" ? "Salvo ✓" : "Salvar nome"}
          </button>
          {nameStatus === "error" && (
            <p className="mt-2 text-xs text-[#E6395B]">Não foi possível salvar. Tente de novo.</p>
          )}
        </form>

        {/* trocar senha */}
        <form onSubmit={handleChangePassword} className="rounded-[20px] border border-[#35131F]/10 bg-white p-5">
          <label className="flex items-center gap-2 text-xs font-semibold text-[#35131F]">
            <Lock size={14} />
            Trocar senha
          </label>

          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Senha atual"
            autoComplete="current-password"
            className="mt-2 h-11 w-full rounded-xl border border-[#E8DADD] bg-[#FFFDFC] px-4 text-sm outline-none transition placeholder:text-[#C4B3B8] focus:border-[#E6395B] focus:ring-4 focus:ring-[#E6395B]/10"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nova senha (mín. 8 caracteres)"
            autoComplete="new-password"
            className="mt-2 h-11 w-full rounded-xl border border-[#E8DADD] bg-[#FFFDFC] px-4 text-sm outline-none transition placeholder:text-[#C4B3B8] focus:border-[#E6395B] focus:ring-4 focus:ring-[#E6395B]/10"
          />

          {passwordError && <p className="mt-2 text-xs text-[#E6395B]">{passwordError}</p>}

          <button
            type="submit"
            disabled={passwordStatus === "saving"}
            className="mt-3 rounded-full border border-[#E8DADD] px-5 py-2 text-xs font-semibold text-[#35131F] transition hover:border-[#D7BEC4] hover:bg-[#FFF8F9] disabled:opacity-60"
          >
            {passwordStatus === "saving" ? "Trocando..." : passwordStatus === "saved" ? "Senha trocada ✓" : "Trocar senha"}
          </button>
        </form>
      </div>
    </main>
  );
}