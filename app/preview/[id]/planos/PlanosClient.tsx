// app/preview/[id]/planos/PlanosClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PlanPicker } from "@/components/PlanPicker";
import { PlanType } from "@/lib/plans";

interface PlanosData {
  eligiblePlans: PlanType[];
  recommendedPlan: PlanType;
}

export default function PlanosClient({ gamePageId }: { gamePageId: string }) {
  const router = useRouter();
  const [data, setData] = useState<PlanosData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    fetch(`/api/game-pages/preview/${gamePageId}`)
      .then((res) => res.json())
      .then((json: PlanosData) => {
        setData(json);
        setSelectedPlan(json.recommendedPlan);
      });
  }, [gamePageId]);

  async function handlePay() {
    if (!selectedPlan || isPaying) return;
    setIsPaying(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gamePageId, plan: selectedPlan }),
    });
    const { url } = await res.json();
    window.location.href = url;
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFFCFA]">
        <p className="text-sm text-[#35131F]">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFCFA] px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-2xl items-center justify-center">
        <div className="w-full rounded-[24px] border border-[#35131F]/10 bg-white p-6 shadow-[0_20px_60px_rgba(53,19,31,0.08)] sm:p-8">
          <button
            type="button"
            onClick={() => router.push(`/preview/${gamePageId}`)}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-[#8F747C] transition hover:text-[#E6395B]"
          >
            <ArrowLeft size={16} />
            Voltar pro jogo
          </button>

          <h1 className="text-center font-serif text-xl font-bold text-[#35131F]">Escolha seu plano</h1>
          <p className="mt-1 text-center text-xs text-[#8F747C]">
            Pra liberar o link e compartilhar de verdade.
          </p>

          <div className="mt-6">
            <PlanPicker
              eligiblePlans={data.eligiblePlans}
              recommended={data.recommendedPlan}
              selected={selectedPlan ?? data.recommendedPlan}
              onSelect={setSelectedPlan}
            />
          </div>

          <button
            type="button"
            onClick={handlePay}
            disabled={isPaying}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-[#E6395B] text-sm font-bold text-white shadow-[0_8px_24px_rgba(230,57,91,0.22)] transition hover:bg-[#D62F50] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPaying ? "Redirecionando..." : "Ir para o pagamento"}
          </button>
        </div>
      </div>
    </main>
  );
}