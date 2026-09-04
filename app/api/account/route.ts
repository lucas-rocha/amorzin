// app/api/account/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const { name } = body as { name?: string };

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name: name?.trim() || null },
  });

  return NextResponse.json({ id: updated.id, name: updated.name });
}