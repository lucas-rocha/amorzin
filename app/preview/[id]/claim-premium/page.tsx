// app/preview/[id]/claim-premium/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const MAX_RETRIES = 6;
const RETRY_DELAY_MS = 1500;

export default function ClaimPremiumPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function tryPublish(attempt: number) {
      try {
        const res = await fetch(`/api/game-pages/publish/${params.id}`, { method: "POST" });

        if (res.ok) {
          const { slug } = await res.json();
          if (!cancelled) router.push(`/compartilhar/${slug}`);
          return;
        }

        if (attempt < MAX_RETRIES) {
          setTimeout(() => !cancelled && tryPublish(attempt + 1), RETRY_DELAY_MS);
        } else if (!cancelled) {
          setError("Ainda não conseguimos confirmar sua conta Premium. Tenta recarregar em instantes.");
        }
      } catch {
        if (!cancelled) setError("Algo deu errado. Tenta recarregar a página.");
      }
    }

    tryPublish(0);
    return () => {
      cancelled = true;
    };
  }, [params.id, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFFCFA] px-4">
      <p className="max-w-sm text-center text-sm text-[#35131F]">
        {error ?? "Confirmando sua conta Premium e publicando seu jogo..."}
      </p>
    </main>
  );
}