// app/api/game-pages/[slug]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const page = await prisma.gamePage.findUnique({
    where: { slug },
    include: { payment: true },
  });

  if (!page) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: page.status,
    payerEmail: page.payment?.payerEmail ?? null,
  });
}