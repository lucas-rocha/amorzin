// app/dashboard/DashboardClient.tsx
"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Calendar, ExternalLink, LogOut, Plus, Share2, Sparkles, User } from "lucide-react";
import { PLAN_LIMITS, PlanType } from "@/lib/plans";

interface Game {
  id: string;
  slug: string;
  loverName: string;
  status: "DRAFT" | "PUBLISHED" | "EXPIRED";
  plan: PlanType;
  createdAt: string;
  expiresAt: string | null;
  thumbnailUrl: string | null;
}

interface DashboardClientProps {
  games: Game[];
  userName: string;
}

const STATUS_LABEL: Record<Game["status"], { label: string; className: string }> = {
  DRAFT: { label: "Rascunho", className: "bg-[#F0E7E9] text-[#8F747C]" },
  PUBLISHED: { label: "Publicado", className: "bg-[#E1F5EE] text-[#0F6E56]" },
  EXPIRED: { label: "Expirado", className: "bg-[#FFE8EE] text-[#E6395B]" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function DashboardClient({ games, userName }: DashboardClientProps) {
  const { data: session, status: sessionStatus } = useSession();
  const isPremium = session?.user?.isPremiumMember ?? false;

  async function handleUpgrade() {
    const res = await fetch("/api/checkout/premium-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callbackUrl: "/dashboard" }),
    });

    if (!res.ok) {
      console.error("Falha ao iniciar checkout premium");
      return;
    }

    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <main className="min-h-screen bg-[#FFFCFA] px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-5xl">
        {/* header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="font-serif text-lg font-bold text-[#35131F]">🏹 Momozin</div>
            {userName && (
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#8F747C]">
                Olá, {userName}
                {isPremium && (
                  <span className="rounded-full bg-gradient-to-br from-[#E6395B] to-[#9F1835] px-2 py-0.5 text-[9px] font-bold text-white">
                    PREMIUM
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {sessionStatus !== "loading" && !isPremium && (
              <button
                type="button"
                onClick={handleUpgrade}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#E6395B] to-[#9F1835] px-3.5 py-2 text-[11px] font-bold text-white shadow-[0_7px_18px_rgba(230,57,91,0.2)] transition hover:brightness-105 active:scale-[0.98]"
              >
                <Sparkles size={13} />
                Virar Premium
              </button>
            )}
            
            <Link
              href="/conta"
              className="flex items-center gap-1.5 text-xs font-medium text-[#8F747C] transition hover:text-[#E6395B]"
            >
            <User size={14} />
              Conta
            </Link>
            
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-1.5 text-xs font-medium text-[#8F747C] transition hover:text-[#E6395B]"
            >
              <LogOut size={14} />
              Sair
            </button>
          </div>
        </div>

        {!isPremium && sessionStatus !== "loading" && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#E6395B]/15 bg-[#FFF8F9] px-4 py-3">
            <Sparkles size={16} className="flex-shrink-0 text-[#E6395B]" />
            <p className="text-xs leading-5 text-[#6E4E58]">
              <strong className="text-[#35131F]">Vire Premium</strong> e crie quantos Momozins quiser
              sem pagar por jogo — pagamento único, pra sempre.
            </p>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-[#35131F]">Seus Momozins</h1>
          <Link
            href="/criar"
            className="flex items-center gap-1.5 rounded-full bg-[#E6395B] px-4 py-2.5 text-xs font-bold text-white shadow-[0_7px_18px_rgba(230,57,91,0.18)] transition hover:bg-[#D62F50] active:scale-[0.98]"
          >
            <Plus size={14} />
            Criar novo
          </Link>
        </div>

        {games.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#E8DADD] bg-white px-6 py-16 text-center">
            <p className="text-sm text-[#8F747C]">Você ainda não tem nenhum Momozin por aqui.</p>
            <Link
              href="/criar"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#E6395B] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#D62F50]"
            >
              <Plus size={14} />
              Criar meu primeiro Momozin
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function GameCard({ game }: { game: Game }) {
  const status = STATUS_LABEL[game.status];
  const isActive = game.status === "PUBLISHED";

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#35131F]/10 bg-white shadow-[0_10px_30px_rgba(53,19,31,0.04)]">
      <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-[#FFE8EE] to-[#FFF5F7]">
        {game.thumbnailUrl ? (
          <img src={game.thumbnailUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-3xl">💗</span>
        )}
        <span className={`absolute right-2.5 top-2.5 rounded-full px-2.5 py-1 text-[9px] font-bold ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="p-4">
        <h3 className="truncate text-sm font-bold text-[#35131F]">
          {game.loverName || "Sem nome"}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#A1888F]">
          <Calendar size={11} />
          {formatDate(game.createdAt)}
          <span className="mx-0.5">·</span>
          <span className="font-semibold text-[#8F747C]">{PLAN_LIMITS[game.plan].label}</span>
        </div>

        {game.status === "EXPIRED" ? (
          <p className="mt-3 text-[10px] text-[#E6395B]">O link desse Momozin expirou.</p>
        ) : (
          <div className="mt-3 flex gap-2">
            <a
              href={`/p/${game.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#E8DADD] py-2 text-[10px] font-semibold text-[#35131F] transition hover:border-[#D7BEC4] hover:bg-[#FFF8F9]"
            >
              <ExternalLink size={12} />
              Ver jogo
            </a>
            <Link
              href={`/compartilhar/${game.slug}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#FFE8EE] py-2 text-[10px] font-semibold text-[#E6395B] transition hover:bg-[#FFD8E3]"
            >
              <Share2 size={12} />
              Compartilhar
            </Link>
          </div>
        )}

        {!isActive && game.status !== "EXPIRED" && (
          <p className="mt-3 text-[10px] text-[#A1888F]">Aguardando publicação.</p>
        )}
      </div>
    </div>
  );
}