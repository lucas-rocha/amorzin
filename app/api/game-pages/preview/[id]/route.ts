// app/api/game-pages/preview/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEligiblePlans, getRecommendedPlan } from "@/lib/plans";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const page = await prisma.gamePage.findUnique({
    where: { id },
    include: {
      targetPhotos: { orderBy: { order: "asc" } },
      hitMessages: { orderBy: { order: "asc" } },
      missMessages: { orderBy: { order: "asc" } },
    },
  });

  if (!page) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const photoCount = page.targetPhotos.length;

  return NextResponse.json({
    id: page.id,
    slug: page.slug,
    status: page.status,
    targetPhotoUrl: page.targetPhotos[0]?.url ?? null,
    couplePhotoUrls: page.targetPhotos.slice(1).map((p) => p.url),
    hitMessages: page.hitMessages.map((m) => m.text),
    missMessages: page.missMessages.map((m) => m.text),
    finalQuestion: page.finalQuestion,
    acceptButtonText: page.acceptButtonText, // ← adicionado
    requiredHits: page.requiredHits,
    eligiblePlans: getEligiblePlans(photoCount),
    recommendedPlan: getRecommendedPlan(photoCount),
  });
}