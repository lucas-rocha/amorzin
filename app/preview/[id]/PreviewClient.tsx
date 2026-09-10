// app/preview/[id]/PreviewClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CupidGame from "@/components/CupidGame";
import { Pencil } from "lucide-react";
import { useSession } from "next-auth/react";

interface PreviewData {
  status: "DRAFT" | "PUBLISHED" | "EXPIRED";
  targetPhotoUrl: string | null;
  couplePhotoUrls: string[];
  hitMessages: string[];
  missMessages: string[];
  finalQuestion: string;
  finalSub: string;
  acceptedTitle: string;
  acceptedSub: string;
  requiredHits: number;
}

export default function PreviewClient({ gamePageId }: { gamePageId: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [data, setData] = useState<PreviewData | null>(null);

  useEffect(() => {
    fetch(`/api/game-pages/preview/${gamePageId}`)
      .then((res) => res.json())
      .then(setData);
  }, [gamePageId]);

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFFCFA]">
        <p className="text-sm text-[#35131F]">Carregando preview...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FFFCFA] px-4 py-6">
      {data.status === "DRAFT" && (
        <button
          type="button"
          onClick={() => router.push(`/criar?editId=${gamePageId}`)}
          className="flex items-center gap-2 self-center text-sm font-medium text-[#8F747C] transition hover:text-[#E6395B]"
        >
          <Pencil size={15} />
          Editar
        </button>
      )}

      <CupidGame
        requiredHits={data.requiredHits}
        targetPhotoUrl={data.targetPhotoUrl}
        couplePhotoUrls={data.couplePhotoUrls}
        hitMessages={data.hitMessages}
        missMessages={data.missMessages}
        finalQuestion={data.finalQuestion}
        finalSub={data.finalSub}
        acceptedTitle={data.acceptedTitle}
        acceptedSub={data.acceptedSub}
        showWatermark
        onShare={async () => {
          if (session?.user?.isPremiumMember) {
            const res = await fetch(`/api/game-pages/publish/${gamePageId}`, { method: "POST" });
            const { slug } = await res.json();
            router.push(`/compartilhar/${slug}`);
          } else {
            router.push(`/preview/${gamePageId}/planos`);
          }
        }}
      />
    </main>
  );
}