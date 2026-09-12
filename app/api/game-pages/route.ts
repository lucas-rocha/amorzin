import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";
import { PlanType } from "@/lib/plans";
import { getCurrentUser } from "@/lib/auth";

interface CreateGamePageBody {
  loverName: string;
  photos: string[]; // photos[0] = foto-alvo, o resto = fotos do casal
  hitMessages: string[];
  missMessages: string[];
  finalMessage: string;
  acceptButtonText: string;
  plan: PlanType;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateGamePageBody;

  if (!body.loverName?.trim() || !body.finalMessage?.trim()) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }
  if (!body.photos || body.photos.length === 0) {
    return NextResponse.json({ error: "Adicione pelo menos uma foto" }, { status: 400 });
  }

  const user = await getCurrentUser() || null;

  const slug = generateSlug(body.loverName);
  const couplePhotos = body.photos.slice(1);

  const gamePage = await prisma.gamePage.create({
    data: {
      slug,
      status: "DRAFT",
      userId: user?.id,
      plan: body.plan,
      loverName: body.loverName,
      requiredHits: Math.max(couplePhotos.length, 1),
      finalQuestion: body.finalMessage,
      acceptButtonText: body.acceptButtonText || "Sim, eu aceito 💍",
      targetPhotos: {
        create: body.photos.map((url, order) => ({ url, order })),
      },
      hitMessages: {
        create: body.hitMessages.filter(Boolean).map((text, order) => ({ text, order })),
      },
      missMessages: {
        create: body.missMessages.filter(Boolean).map((text, order) => ({ text, order })),
      },
    },
  });

  return NextResponse.json({ id: gamePage.id, slug: gamePage.slug });
}