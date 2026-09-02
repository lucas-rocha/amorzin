// app/p/[slug]/MomozinSlugClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CupidGame from "@/components/CupidGame";

export interface Momozin {
  slug: string;
  targetPhotoUrl?: string | null;
  couplePhotoUrls: string[];
  hitMessages: string[];
  missMessages: string[];
  finalQuestion: string;
  finalSub: string;
  acceptedTitle: string;
  acceptedSub: string;
  requiredHits: number;
}

const MAX_RETRIES = 6;
const RETRY_DELAY_MS = 1500;

export default function MomozinSlugClient({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const justPaid = searchParams.get("paid") === "1";

  const [momozin, setMomozin] = useState<Momozin | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(justPaid);

  useEffect(() => {
    let cancelled = false;

    async function load(attempt: number) {
      try {
        const res = await fetch(`/api/game-pages/${slug}`);

        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setMomozin(data);
            setConfirmingPayment(false);
          }
          return;
        }

        // 404: se acabou de pagar, o webhook pode só não ter chegado ainda —
        // tenta de novo por alguns segundos antes de desistir de vez.
        if (justPaid && attempt < MAX_RETRIES) {
          setTimeout(() => !cancelled && load(attempt + 1), RETRY_DELAY_MS);
          return;
        }

        if (!cancelled) {
          setNotFound(true);
          setConfirmingPayment(false);
        }
      } catch {
        if (!cancelled) {
          setNotFound(true);
          setConfirmingPayment(false);
        }
      }
    }

    load(0);
    return () => {
      cancelled = true;
    };
  }, [slug, justPaid]);

  if (notFound) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFFCFA]">
        <p className="text-sm text-[#35131F]">Esse Momozin não existe (ou expirou).</p>
      </main>
    );
  }

  if (!momozin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFFCFA]">
        <p className="text-sm text-[#35131F]">
          {confirmingPayment ? "Confirmando seu pagamento..." : "Carregando seu Momozin..."}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFCFA]">
      <div className="flex min-h-screen items-center justify-center">
        <CupidGame
          requiredHits={momozin.requiredHits}
          targetPhotoUrl={momozin.targetPhotoUrl}
          couplePhotoUrls={momozin.couplePhotoUrls}
          hitMessages={momozin.hitMessages}
          missMessages={momozin.missMessages}
          finalQuestion={momozin.finalQuestion}
          finalSub={momozin.finalSub}
          acceptedTitle={momozin.acceptedTitle}
          acceptedSub={momozin.acceptedSub}
        />
      </div>
    </main>
  );
}