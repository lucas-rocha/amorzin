// app/api/game-pages/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const page = await prisma.gamePage.findUnique({
    where: { slug },
    include: {
      targetPhotos: { orderBy: { order: "asc" } },
      hitMessages: { orderBy: { order: "asc" } },
      missMessages: { orderBy: { order: "asc" } },
    },
  });

  if (!page || page.status !== "PUBLISHED") {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (page.expiresAt && page.expiresAt < new Date()) {
    return NextResponse.json({ error: "expired" }, { status: 410 });
  }

  return NextResponse.json({
    slug: page.slug,
    targetPhotoUrl: page.targetPhotos[0]?.url ?? null,
    couplePhotoUrls: page.targetPhotos.slice(1).map((p) => p.url),
    hitMessages: page.hitMessages.map((m) => m.text),
    missMessages: page.missMessages.map((m) => m.text),
    finalQuestion: page.finalQuestion,
    acceptButtonText: page.acceptButtonText,
    requiredHits: page.requiredHits,
  });
}