// app/api/account/password/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { currentPassword, newPassword } = (await req.json()) as {
    currentPassword: string;
    newPassword: string;
  };

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: "Nova senha precisa ter no mínimo 8 caracteres" }, { status: 400 });
  }

  if (!user.passwordHash) {
    return NextResponse.json({ error: "Essa conta não usa senha (login por outro método)" }, { status: 400 });
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Senha atual incorreta" }, { status: 401 });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  });

  return NextResponse.json({ ok: true });
}