import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const page = await prisma.gamePage.findUnique({
    where: { id },
    include: {
      targetPhotos: { orderBy: { order: "asc" } },
      hitMessages: { orderBy: { order: "asc" } },
      missMessages: { orderBy: { order: "asc" } },
    },
  });

  if (!page) return NextResponse.json({ error: "not found" }, { status: 404 });

  // nem devolve os dados pra edição se já não for mais rascunho
  if (page.status !== "DRAFT") {
    return NextResponse.json({ error: "already_published" }, { status: 409 });
  }

  if (page.userId) {
    const user = await getCurrentUser();
    if (!user || user.id !== page.userId) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
  }
  

  return NextResponse.json({
    loverName: page.loverName,
    photos: page.targetPhotos.map((p) => p.url),
    hitMessages: page.hitMessages.map((m) => m.text),
    missMessages: page.missMessages.map((m) => m.text),
    finalMessage: page.finalQuestion,
    acceptButtonText: page.acceptedTitle,
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.gamePage.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  // edição só é permitida em rascunho — depois de publicado, o link já pode
  // ter sido compartilhado, então não faz sentido trocar o conteúdo por baixo.
  if (existing.status !== "DRAFT") {
    return NextResponse.json({ error: "Só é possível editar rascunhos" }, { status: 409 });
  }

  const couplePhotos = (body.photos as string[]).slice(1);

  await prisma.$transaction([
    // recria fotos/mensagens do zero — mais simples que diffar item a item
    prisma.targetPhoto.deleteMany({ where: { gamePageId: id } }),
    prisma.hitMessage.deleteMany({ where: { gamePageId: id } }),
    prisma.missMessage.deleteMany({ where: { gamePageId: id } }),
    prisma.gamePage.update({
      where: { id },
      data: {
        loverName: body.loverName,
        finalQuestion: body.finalMessage,
        requiredHits: Math.max(couplePhotos.length, 1),
        targetPhotos: { create: (body.photos as string[]).map((url, order) => ({ url, order })) },
        hitMessages: { create: (body.hitMessages as string[]).filter(Boolean).map((text, order) => ({ text, order })) },
        missMessages: { create: (body.missMessages as string[]).filter(Boolean).map((text, order) => ({ text, order })) },
      },
    }),
  ]);

  return NextResponse.json({ id });
}