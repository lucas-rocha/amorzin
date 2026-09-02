// app/preview/[id]/PreviewClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CupidGame from "@/components/CupidGame";
import { Pencil } from "lucide-react";

interface PreviewData {
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
    <main className="flex min-h-screen items-center justify-center bg-[#FFFCFA]">

      <button
        type="button"
        onClick={() => router.push(`/criar?editId=${gamePageId}`)}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-[#8F747C] transition hover:text-[#E6395B]"
      >
        <Pencil size={15} />
        Editar
      </button>
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
        onShare={() => router.push(`/preview/${gamePageId}/planos`)}
      />
    </main>
  );
}