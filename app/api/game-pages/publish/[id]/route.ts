import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user?.isPremiumMember) {
    return NextResponse.json({ error: "Conta Premium necessária" }, { status: 403 });
  }

  const page = await prisma.gamePage.findUnique({ where: { id } });
  if (!page) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (page.userId !== user.id) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const updated = await prisma.gamePage.update({
    where: { id },
    data: { status: "PUBLISHED", plan: "PREMIUM", expiresAt: null },
  });

  return NextResponse.json({ slug: updated.slug });
}