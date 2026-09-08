// app/p/[slug]/AmorzinSlugClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CupidGame from "@/components/CupidGame";
import { PlanType } from "@prisma/client";

export interface Amorzin {
  id?: string;
  plan?: PlanType;
  loverName?: string; 
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

export default function AmorzinSlugClient({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const justPaid = searchParams.get("paid") === "1";

  const [Amorzin, setAmorzin] = useState<Amorzin | null>(null);
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
            setAmorzin(data);
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
        <p className="text-sm text-[#35131F]">Esse Amorzin não existe (ou expirou).</p>
      </main>
    );
  }

  if (!Amorzin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFFCFA]">
        <p className="text-sm text-[#35131F]">
          {confirmingPayment ? "Confirmando seu pagamento..." : "Carregando seu Amorzin..."}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFCFA]">
      <div className="flex min-h-screen items-center justify-center">
        <CupidGame
          requiredHits={Amorzin.requiredHits}
          targetPhotoUrl={Amorzin.targetPhotoUrl}
          couplePhotoUrls={Amorzin.couplePhotoUrls}
          hitMessages={Amorzin.hitMessages}
          missMessages={Amorzin.missMessages}
          finalQuestion={Amorzin.finalQuestion}
          finalSub={Amorzin.finalSub}
          acceptedTitle={Amorzin.acceptedTitle}
          acceptedSub={Amorzin.acceptedSub}
        />
      </div>
    </main>
  );
}